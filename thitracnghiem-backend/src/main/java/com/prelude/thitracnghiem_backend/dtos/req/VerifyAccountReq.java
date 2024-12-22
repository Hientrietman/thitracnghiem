package com.prelude.thitracnghiem_backend.dtos.req;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class VerifyAccountReq {
    private String email;
    private String verificationCode;
    private String password;
}
