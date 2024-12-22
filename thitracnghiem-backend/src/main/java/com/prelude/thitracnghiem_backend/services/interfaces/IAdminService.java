package com.prelude.thitracnghiem_backend.services.interfaces;

import com.prelude.thitracnghiem_backend.dtos.res.ResponseApi;
import com.prelude.thitracnghiem_backend.dtos.res.UserAndRoleResponse;
import com.prelude.thitracnghiem_backend.models.ApplicationUser;
import org.springframework.data.domain.Page;

public interface IAdminService {
    ResponseApi<UserAndRoleResponse> getUserAndRole(int user_id);
    ResponseApi<Page<UserAndRoleResponse>> getAllUsers(int page, int size);
////
    ResponseApi<String> updateUserRole(int userId, int newRoleId);
}
