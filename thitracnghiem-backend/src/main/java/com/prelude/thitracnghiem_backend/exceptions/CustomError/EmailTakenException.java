package com.prelude.thitracnghiem_backend.exceptions.CustomError;

public class EmailTakenException extends RuntimeException {
    private static final long serialVersionUID = 1L;
    public EmailTakenException(String message) {
        super(message);
    }
}
