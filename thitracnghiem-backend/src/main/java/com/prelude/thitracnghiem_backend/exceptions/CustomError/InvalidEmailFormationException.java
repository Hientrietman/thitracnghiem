package com.prelude.thitracnghiem_backend.exceptions.CustomError;

public class InvalidEmailFormationException extends RuntimeException {
    public InvalidEmailFormationException(String message) {
        super(message);
    }
}