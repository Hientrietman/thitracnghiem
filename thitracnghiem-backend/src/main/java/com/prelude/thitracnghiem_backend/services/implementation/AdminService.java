package com.prelude.thitracnghiem_backend.services.implementation;

import com.prelude.thitracnghiem_backend.dtos.res.ResponseApi;
import com.prelude.thitracnghiem_backend.dtos.res.UserAndRoleResponse;
import com.prelude.thitracnghiem_backend.exceptions.CustomError.InvalidRoleException;
import com.prelude.thitracnghiem_backend.exceptions.CustomError.RoleNotFoundException;
import com.prelude.thitracnghiem_backend.exceptions.CustomError.UserIdNotFoundException;
import com.prelude.thitracnghiem_backend.models.ApplicationUser;
import com.prelude.thitracnghiem_backend.models.Roles;
import com.prelude.thitracnghiem_backend.repositories.HasRolePermissionRepository;
import com.prelude.thitracnghiem_backend.repositories.RoleRepository;
import com.prelude.thitracnghiem_backend.repositories.UserRepository;
import com.prelude.thitracnghiem_backend.services.interfaces.IAdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService implements IAdminService {
    private final UserRepository userRepository;
    private final HasRolePermissionRepository hasRolePermissionRepository;
    private final RoleRepository roleRepository;

    /**
     * Lấy thông tin người dùng và vai trò của họ dựa trên user_id.
     *
     * Phương thức này tìm kiếm người dùng theo ID và lấy vai trò của họ từ
     * cơ sở dữ liệu. Sau đó, nó trả về thông tin người dùng cùng với vai trò
     * của họ.
     *
     * @param user_id ID của người dùng cần tìm kiếm.
     * @return ResponseApi<UserAndRoleRes> phản hồi chứa thông tin người dùng và vai trò của họ.
     * @throws UserIdNotFoundException Nếu không tìm thấy người dùng với user_id đã cung cấp.
     * @throws RoleNotFoundException Nếu không tìm thấy vai trò tương ứng với người dùng.
     */
    @Override
    public ResponseApi<UserAndRoleResponse> getUserAndRole(int user_id) {
        ApplicationUser user = userRepository.findById(user_id)
                .orElseThrow(() -> new UserIdNotFoundException("User with id: " + user_id + " not found"));
        List<String> roles = hasRolePermissionRepository.findRolesByUserId(user.getUserId());

        // Giả sử bạn chỉ lấy vai trò đầu tiên
        String userRole = roles.isEmpty() ? "UNKNOWN" : roles.get(0); // Lấy vai trò đầu tiên, nếu không có thì trả về "UNKNOWN"

        UserAndRoleResponse response = new UserAndRoleResponse(user, userRole);
        return new ResponseApi<>(HttpStatus.OK, "User info fetch successfully", response, true);
    }


    /**
     * Lấy tất cả người dùng trong hệ thống với chức năng phân trang.
     *
     * Phương thức này lấy danh sách tất cả người dùng từ cơ sở dữ liệu với phân trang và
     * tìm kiếm vai trò của từng người dùng. Kết quả sẽ trả về danh sách người dùng cùng
     * với vai trò của họ.
     *
     * @param page Số trang cần lấy.
     * @param size Kích thước của một trang (số lượng người dùng mỗi trang).
     * @return ResponseApi<Page<UserAndRoleRes>> phản hồi chứa trang kết quả người dùng và vai trò của họ.
     * @throws RoleNotFoundException Nếu không tìm thấy vai trò tương ứng với bất kỳ người dùng nào.
     */
    @Override
    public ResponseApi<Page<UserAndRoleResponse>> getAllUsers(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ApplicationUser> usersPage = userRepository.findAll(pageable);

        // Lấy danh sách người dùng và vai trò của họ
        List<UserAndRoleResponse> userAndRoleResponses = usersPage.getContent().stream()
                .map(user -> {
                    List<String> roles = hasRolePermissionRepository.findRolesByUserId(user.getUserId());
                    String userRole = roles.isEmpty() ? "UNKNOWN" : roles.get(0);
                    return new UserAndRoleResponse(user, userRole);
                })
                .toList();

        // Tạo một Page mới với UserAndRoleResponse
        Page<UserAndRoleResponse> userAndRoleResponsePage = new PageImpl<>(userAndRoleResponses, pageable, usersPage.getTotalElements());

        return new ResponseApi<>(HttpStatus.OK, "Users fetched successfully", userAndRoleResponsePage, true);
    }


    /**
     * Thay đổi vai trò của người dùng dựa trên yêu cầu.
     *
     * Phương thức này tìm người dùng theo user_id, sau đó tìm vai trò mới và
     * kiểm tra xem người dùng đã có vai trò đó hay chưa. Nếu vai trò mới hợp lệ
     * và khác với vai trò hiện tại, vai trò hiện tại sẽ bị xóa và thay bằng vai
     * trò mới.
     *
     * @param req Đối tượng yêu cầu chứa vai trò mới cần thay đổi.
     * @param user_id ID của người dùng cần thay đổi vai trò.
     * @return ResponseApi<String> phản hồi chứa thông báo thành công nếu vai trò được cập nhật.
     * @throws UserIdNotFoundException Nếu không tìm thấy người dùng với user_id đã cung cấp.
     * @throws InvalidRoleException Nếu vai trò mới không hợp lệ hoặc người dùng đã có vai trò đó.
     * @throws RoleNotFoundException Nếu không tìm thấy vai trò hiện tại của người dùng.
     */
    public ResponseApi<String> updateUserRole(int userId, int newRoleId) {
        ApplicationUser user = userRepository.findByUserId(userId).orElseThrow(
                () -> new UserIdNotFoundException("User with id: " + userId + " not found"));
        Roles role = roleRepository.findById(newRoleId).orElseThrow(
                ()-> new RoleNotFoundException("Role with id: " + newRoleId + " not found"));
        hasRolePermissionRepository.updateRoleByUserId(userId, newRoleId);

        return new ResponseApi<>(HttpStatus.OK,"Role and Permission changed successfully",null,true);
    }

}
