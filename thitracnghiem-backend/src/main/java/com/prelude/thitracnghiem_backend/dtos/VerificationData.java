package com.prelude.thitracnghiem_backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class VerificationData {
    private String verificationCode;
    private LocalDateTime expiryTime;
}