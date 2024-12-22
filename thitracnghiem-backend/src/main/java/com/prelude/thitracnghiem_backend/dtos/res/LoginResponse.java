package com.prelude.thitracnghiem_backend.dtos.res;

import com.prelude.thitracnghiem_backend.models.ApplicationUser;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class LoginResponse {
    private String role; // Thêm thuộc tính cho vai trò
    private String token; // JWT token
    private ApplicationUser user; // Thông tin người dùng
}

