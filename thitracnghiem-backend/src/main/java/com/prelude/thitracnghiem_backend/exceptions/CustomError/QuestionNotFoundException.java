package com.prelude.thitracnghiem_backend.exceptions.CustomError;

public class QuestionNotFoundException extends RuntimeException {
    private static final long serialVersionUID = 1L;
    public QuestionNotFoundException(String message) {
        super(message);
    }
}
