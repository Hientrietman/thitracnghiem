package com.prelude.thitracnghiem_backend.services.interfaces;

public interface IEmailService {
    public void sendVerificationEmail(String to, String verificationCode);
}
