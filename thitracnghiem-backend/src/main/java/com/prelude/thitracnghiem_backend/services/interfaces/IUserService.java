package com.prelude.thitracnghiem_backend.services.interfaces;

import com.prelude.thitracnghiem_backend.dtos.req.*;
import com.prelude.thitracnghiem_backend.dtos.res.LoginResponse;
import com.prelude.thitracnghiem_backend.dtos.res.ResponseApi;
import com.prelude.thitracnghiem_backend.dtos.res.UserAndRoleResponse;
import com.prelude.thitracnghiem_backend.models.ApplicationUser;

public interface IUserService {

    ResponseApi<String> initiateRegistration(RegisterReq user);

    ResponseApi<ApplicationUser> verifyRegistration(VerifyAccountReq accountReq);
//
//    ResponseApi<ApplicationUser> register(InfoUpdateReq user);
//    ResponseApi<String> generateVerificationCode(EmailRequest email);
//
//    ResponseApi<String> sendVerificationCode(String email);
//    ResponseApi<UserAndRoleRes> verifyEmail(VerifyAccountReq accountReq);
    ResponseApi<LoginResponse> login(LoginReq loginReq);
    ResponseApi<UserAndRoleResponse> getAuthenticatedUserProfile();
//
    ResponseApi<UserAndRoleResponse> updateUserProfile(InfoUpdateReq req);
}