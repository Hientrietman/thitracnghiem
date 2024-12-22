package com.prelude.thitracnghiem_backend.exceptions.CustomError;

public class EmaiilNotFoundException extends RuntimeException {
    private static final long serialVersionUID = 1L;
    public EmaiilNotFoundException(String message) {
        super(message);
    }
}
