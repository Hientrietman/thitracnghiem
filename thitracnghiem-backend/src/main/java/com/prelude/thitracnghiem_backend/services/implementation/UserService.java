package com.prelude.thitracnghiem_backend.services.implementation;



import com.prelude.thitracnghiem_backend.dtos.req.InfoUpdateReq;
import com.prelude.thitracnghiem_backend.dtos.req.LoginReq;
import com.prelude.thitracnghiem_backend.dtos.req.RegisterReq;
import com.prelude.thitracnghiem_backend.dtos.req.VerifyAccountReq;
import com.prelude.thitracnghiem_backend.dtos.res.LoginResponse;
import com.prelude.thitracnghiem_backend.dtos.res.ResponseApi;
import com.prelude.thitracnghiem_backend.dtos.res.UserAndRoleResponse;
import com.prelude.thitracnghiem_backend.exceptions.CustomError.*;
import com.prelude.thitracnghiem_backend.models.ApplicationUser;
import com.prelude.thitracnghiem_backend.repositories.HasRolePermissionRepository;
import com.prelude.thitracnghiem_backend.repositories.RoleRepository;
import com.prelude.thitracnghiem_backend.repositories.UserRepository;
import com.prelude.thitracnghiem_backend.services.JwtService;
import com.prelude.thitracnghiem_backend.services.interfaces.IUserService;
import com.prelude.thitracnghiem_backend.utils.StringUtils;
import lombok.RequiredArgsConstructor;
import org.apache.commons.validator.routines.EmailValidator;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.Console;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class UserService implements IUserService {

    // Các dependencies của UserService...
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final RedisTemplate<String, String> redisTemplate;
    private final HasRolePermissionRepository hasRolePermissionRepository;

    @Override
    public ResponseApi<String> initiateRegistration(RegisterReq registerReq) {
        String email = registerReq.getEmail();

        // Kiểm tra email hợp lệ
        if (!EmailValidator.getInstance().isValid(email)) {
            throw new InvalidEmailFormationException("Invalid email format: " + email);
        }

        // Kiểm tra email đã tồn tại
        boolean emailExists = userRepository.existsByEmail(email);
        if (emailExists) {
            throw new EmailTakenException("Email already taken");
        }

        // Tạo khóa Redis cho mã xác thực và thời gian gửi
        String verificationKey = "verification:" + email;
        String lastSentTimeKey = verificationKey + ":timestamp";

        // Kiểm tra thời gian gửi mã xác thực gần đây
        String lastSentTimeString = redisTemplate.opsForValue().get(lastSentTimeKey);
        Long lastSentTime = lastSentTimeString != null ? Long.parseLong(lastSentTimeString) : null;

        // Kiểm tra xem mã xác thực có được gửi trong 5 phút qua không
        if (lastSentTime != null && (System.currentTimeMillis() - lastSentTime < TimeUnit.MINUTES.toMillis(5))) {
            throw new CodeSentAlreadyException("A verification code was sent recently. Please wait before requesting a new one.");
        }

        // Tạo mã xác thực
        String verificationCode = StringUtils.generateVerificationCode();

        // Lưu thông tin mã xác thực vào Redis
        redisTemplate.opsForValue().set(verificationKey, verificationCode, 10, TimeUnit.MINUTES);
        // Lưu thời gian gửi mã xác thực
        redisTemplate.opsForValue().set(lastSentTimeKey, String.valueOf(System.currentTimeMillis()), 10, TimeUnit.MINUTES);

        // Gửi mã xác thực đến email
        emailService.sendVerificationEmail(email, verificationCode);

        return new ResponseApi<>(HttpStatus.OK, "Verification code sent to your email.", null, true);
    }


    @Override
    public ResponseApi<ApplicationUser> verifyRegistration(VerifyAccountReq verifyReq) {
        String email = verifyReq.getEmail();
        String providedCode = verifyReq.getVerificationCode();

        // Tạo khóa Redis
        String redisKey = "verification:" + email;

        // Lấy mã xác thực từ Redis
        String storedCode = redisTemplate.opsForValue().get(redisKey);
        if (storedCode == null) {
            throw new InvalidVerificationCodeException("Verification code has expired or does not exist.");
        }

        // Kiểm tra mã xác thực
        if (!providedCode.equals(storedCode)) {
            throw new InvalidVerificationCodeException("Invalid verification code.");
        }

        // Mã xác thực hợp lệ, giờ hãy lưu thông tin người dùng vào cơ sở dữ liệu
        ApplicationUser newUser = new ApplicationUser();
        newUser.setEmail(email);
        newUser.setUserPassword(passwordEncoder.encode(verifyReq.getPassword())); // Nếu có trường mật khẩu
        newUser.setActive(true); // Kích hoạt tài khoản
        userRepository.save(newUser); // Lưu người dùng vào CSDL

        // Xóa dữ liệu xác thực khỏi Redis
        redisTemplate.delete(redisKey);

        return new ResponseApi<>(HttpStatus.OK, "Account verified and created successfully", newUser, true);
    }


    /**
     * Xác thực người dùng và đăng nhập, tạo JWT token.
     *
     * @param req Đối tượng chứa email và mật khẩu của người dùng.
     * @return ResponseApi chứa thông tin đăng nhập bao gồm JWT token và vai trò người dùng.
     * @throws BadCredentialsException Nếu thông tin đăng nhập không chính xác.
     * @throws EmaiilNotFoundException Nếu không tìm thấy người dùng với email đã cung cấp.
     * @throws RoleNotFoundException Nếu không tìm thấy vai trò của người dùng.
     */
    @Override
    public ResponseApi<LoginResponse> login(LoginReq req)  {
        // Xác thực người dùng
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword()));

        // Lấy thông tin người dùng
        ApplicationUser user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new EmaiilNotFoundException("User not found with email: " + req.getEmail()));

        // Lấy vai trò của người dùng từ bảng hasrolepermission
        List<String> roles = hasRolePermissionRepository.findRolesByUserId(user.getUserId());

        // Giả sử bạn chỉ lấy vai trò đầu tiên
        String userRole = roles.isEmpty() ? "UNKNOWN" : roles.get(0); // Lấy vai trò đầu tiên, nếu không có thì trả về "UNKNOWN"

        // Tạo JWT token và thông tin phản hồi đăng nhập
        LoginResponse loginResponse = new LoginResponse();
        loginResponse.setRole(userRole);  // Gán vai trò cho phản hồi
        loginResponse.setToken(jwtService.generateToken(user));  // Tạo token cho người dùng
        loginResponse.setUser(user);  // Gán thông tin người dùng

        return new ResponseApi<>(HttpStatus.OK, "Login successful", loginResponse, true);
    }



    /**
     * Lấy thông tin hồ sơ của người dùng hiện tại từ token xác thực (JWT).
     *
     * Phương thức này trích xuất email từ JWT token đã được xác thực và
     * tìm kiếm người dùng tương ứng trong cơ sở dữ liệu. Sau đó, nó tìm
     * vai trò của người dùng dựa trên ID của họ và trả về thông tin người
     * dùng cùng với vai trò của họ.
     *
     * @return ResponseApi<UserAndRoleRes> phản hồi chứa thông tin người dùng và vai trò của họ.
     * @throws EmaiilNotFoundException Nếu không tìm thấy người dùng với email từ token.
     * @throws RoleNotFoundException Nếu không tìm thấy vai trò tương ứng với người dùng.
     */
    @Override
    public ResponseApi<UserAndRoleResponse> getAuthenticatedUserProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();  // Lấy email từ token

        ApplicationUser user = userRepository.findByEmail(email).orElseThrow(
                () -> new EmaiilNotFoundException("User not found with email: " + email));
        List<String> roles = hasRolePermissionRepository.findRolesByUserId(user.getUserId());

        // Giả sử bạn chỉ lấy vai trò đầu tiên
        String userRole = roles.isEmpty() ? "UNKNOWN" : roles.get(0); // Lấy vai trò đầu tiên, nếu không có thì trả về "UNKNOWN"


        UserAndRoleResponse response = new UserAndRoleResponse(user,userRole);
        return new ResponseApi<>(HttpStatus.OK, "User is authenticated", response, true);
    }


    /**
     * Cập nhật thông tin hồ sơ người dùng hiện tại dựa trên thông tin được cung cấp.
     *
     * Phương thức này lấy email của người dùng từ JWT token đã được xác thực và
     * tìm kiếm người dùng tương ứng trong cơ sở dữ liệu. Sau đó, nó sẽ cập nhật
     * các thông tin như tên thật, tên người dùng, và số điện thoại nếu các trường
     * đó không phải là null. Sau khi cập nhật thông tin, nó cũng tìm vai trò của
     * người dùng và trả về phản hồi chứa thông tin người dùng đã được cập nhật và
     * vai trò của họ.
     *
     * @param req Đối tượng chứa các thông tin cần cập nhật (tên thật, tên người dùng, số điện thoại).
     * @return ResponseApi<UserAndRoleRes> phản hồi chứa thông tin người dùng đã cập nhật và vai trò của họ.
     * @throws EmaiilNotFoundException Nếu không tìm thấy người dùng với email từ token.
     * @throws RoleNotFoundException Nếu không tìm thấy vai trò tương ứng với người dùng.
     */
    @Override
    public ResponseApi<UserAndRoleResponse> updateUserProfile(InfoUpdateReq req) {
        // Lấy thông tin người dùng hiện tại từ Authentication (JWT)
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName().toString();  // Lấy email từ token

        // Tìm kiếm người dùng trong cơ sở dữ liệu
        ApplicationUser userToUpdate = userRepository.findByEmail(email).orElseThrow(
                () -> new EmaiilNotFoundException("User not found with email: " + email));

        // Kiểm tra từng trường và cập nhật nếu không phải null

        if (req.getUserName() != null) {
            userToUpdate.setUserName(req.getUserName());
        }
        if (req.getRealName() != null) {
            userToUpdate.setRealName(req.getRealName());
        }
        if (req.getPhoneNumber() != null) {
            userToUpdate.setPhoneNumber(req.getPhoneNumber());
        }

        // Lưu người dùng đã được cập nhật
        userRepository.save(userToUpdate);

        // Tìm vai trò của người dùng
        List<String> roles = hasRolePermissionRepository.findRolesByUserId(userToUpdate.getUserId());

        // Giả sử bạn chỉ lấy vai trò đầu tiên
        String userRole = roles.isEmpty() ? "UNKNOWN" : roles.get(0); // Lấy vai trò đầu tiên, nếu không có thì trả về "UNKNOWN"

        // Tạo đối tượng phản hồi
        UserAndRoleResponse response = new UserAndRoleResponse(userToUpdate, userRole);
        return new ResponseApi<>(HttpStatus.OK, "Profile updated successfully", response, true);
    }


}
