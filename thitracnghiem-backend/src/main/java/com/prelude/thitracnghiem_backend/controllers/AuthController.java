package com.prelude.thitracnghiem_backend.controllers;

import com.prelude.thitracnghiem_backend.dtos.req.LoginReq;
import com.prelude.thitracnghiem_backend.dtos.req.RegisterReq;
import com.prelude.thitracnghiem_backend.dtos.req.VerifyAccountReq;
import com.prelude.thitracnghiem_backend.dtos.res.LoginResponse;
import com.prelude.thitracnghiem_backend.dtos.res.ResponseApi;
import com.prelude.thitracnghiem_backend.models.ApplicationUser;
import com.prelude.thitracnghiem_backend.services.implementation.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/v1/auth")
@RequiredArgsConstructor
public class AuthController {
    private final UserService userService;

    /**
     * API đăng ký người dùng bằng email và mật khẩu.
     * @param user Đối tượng chứa thông tin người dùng bao gồm email và mật khẩu.
     * @return ResponseEntity<ResponseApi<String>>: Trả về thông báo gửi mã xác thực đến email.
     */
    @PostMapping("/register/email")
    public ResponseEntity<ResponseApi<String>> registerUser(@RequestBody RegisterReq user) {
        ResponseApi<String> response = userService.initiateRegistration(user);
        return new ResponseEntity<>(response, response.getStatus());
    }

    /**
     * API xác minh tài khoản người dùng bằng mã xác thực.
     * @param accountReq Đối tượng chứa email và mã xác thực của người dùng.
     * @return ResponseEntity<ResponseApi<UserAndRoleRes>>: Trả về thông tin người dùng và vai trò sau khi xác minh thành công.
     */
    @PostMapping("/verify")
    public ResponseEntity<ResponseApi<ApplicationUser>> verify(@RequestBody VerifyAccountReq accountReq) {
        ResponseApi<ApplicationUser> response = userService.verifyRegistration(accountReq);
        return new ResponseEntity<>(response, response.getStatus());
    }

    /**
     * API đăng nhập người dùng và cấp token JWT.
     * @param req Đối tượng chứa email và mật khẩu của người dùng để đăng nhập.
     * @return ResponseEntity<ResponseApi<LoginRes>>: Trả về thông tin đăng nhập bao gồm token JWT và vai trò của người dùng.
     */
    @PostMapping("/login")
    public ResponseEntity<ResponseApi<LoginResponse>> login(@RequestBody LoginReq req){
        ResponseApi<LoginResponse> response = userService.login(req);
        return new ResponseEntity<>(response, response.getStatus());
    }
}
