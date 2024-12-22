package com.prelude.thitracnghiem_backend.exceptions.CustomError;

public class InvalidVerificationCodeException extends RuntimeException {
    private static final long serialVersionUID = 1L;
    public InvalidVerificationCodeException(String message) {
        super(message);
    }
}
