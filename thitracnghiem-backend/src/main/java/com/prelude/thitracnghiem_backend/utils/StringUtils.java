package com.prelude.thitracnghiem_backend.utils;

import org.springframework.stereotype.Component;

import java.security.SecureRandom;
@Component
public class StringUtils {

    public static String generateVerificationCode() {
        SecureRandom random = new SecureRandom();
        int code = 100000 + random.nextInt(900000); // Generates a number between 100000 and 999999
        return String.valueOf(code);
    }
}
