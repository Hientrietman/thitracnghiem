package com.prelude.thitracnghiem_backend.dtos.res;

import com.prelude.thitracnghiem_backend.models.ApplicationUser;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserAndRoleResponse {
    private ApplicationUser user;
    private String role;
}
