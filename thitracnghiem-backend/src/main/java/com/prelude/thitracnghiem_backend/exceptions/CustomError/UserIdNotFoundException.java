package com.prelude.thitracnghiem_backend.exceptions.CustomError;

public class UserIdNotFoundException extends RuntimeException {
    public UserIdNotFoundException(String message) {
        super(message);
    }
}
