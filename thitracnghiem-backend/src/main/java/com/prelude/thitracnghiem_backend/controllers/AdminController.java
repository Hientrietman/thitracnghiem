package com.prelude.thitracnghiem_backend.controllers;

import com.prelude.thitracnghiem_backend.dtos.req.ChangeUserRoleReq;
import com.prelude.thitracnghiem_backend.dtos.res.ResponseApi;
import com.prelude.thitracnghiem_backend.dtos.res.UserAndRoleResponse;
import com.prelude.thitracnghiem_backend.models.ApplicationUser;
import com.prelude.thitracnghiem_backend.services.implementation.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin")
public class AdminController {

    private final AdminService adminService;

    /**
     * API lấy thông tin người dùng và vai trò dựa trên ID người dùng.
     *
     * @param user_id ID người dùng cần lấy thông tin.
     * @return ResponseEntity chứa ResponseApi với thông tin người dùng và vai trò, kèm theo mã trạng thái HTTP.
     * - Trả về thông tin người dùng và vai trò dựa trên ID.
     */
    @GetMapping("/users/{user_id}")
    public ResponseEntity<ResponseApi<UserAndRoleResponse>> getUserAndRole(@PathVariable int user_id) {
        ResponseApi<UserAndRoleResponse> response = adminService.getUserAndRole(user_id);
        return new ResponseEntity<>(response, response.getStatus());
    }

    /**
     * API lấy danh sách người dùng với phân trang.
     *
     * @param page Số trang cần lấy.
     * @param size Số lượng người dùng trên mỗi trang.
     * @return ResponseEntity chứa ResponseApi với danh sách người dùng và vai trò theo trang, kèm theo mã trạng thái HTTP.
     * - Trả về danh sách người dùng phân trang.
     */
    @GetMapping("/users")
    public ResponseEntity<ResponseApi<Page<UserAndRoleResponse>>> getUsers(@RequestParam (defaultValue = "0") int page, @RequestParam (defaultValue = "10") int size) {
        ResponseApi<Page<UserAndRoleResponse>> response = adminService.getAllUsers(page, size);
        return new ResponseEntity<>(response, response.getStatus());
    }
//
//
    /**
     * API thay đổi vai trò của người dùng.
     *
     * @param req     Đối tượng ChangeUserRoleReq chứa thông tin về vai trò mới.
     * @param userId ID người dùng cần thay đổi vai trò.
     * @return ResponseEntity chứa ResponseApi với thông báo trạng thái thay đổi vai trò, kèm theo mã trạng thái HTTP.
     * - Chỉ Admin mới có thể thay đổi vai trò của người dùng.
     */
    @PutMapping("/users/{userId}/role")
    public ResponseEntity<ResponseApi<String>> changeUserRole(@PathVariable int userId, @RequestBody ChangeUserRoleReq req) {
        ResponseApi<String> response = adminService.updateUserRole(userId, req.getRoleId());
        return new ResponseEntity<>(response, response.getStatus());
    }
}