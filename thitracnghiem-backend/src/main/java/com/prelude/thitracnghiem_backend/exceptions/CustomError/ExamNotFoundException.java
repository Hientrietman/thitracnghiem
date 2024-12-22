package com.prelude.thitracnghiem_backend.exceptions.CustomError;

public class ExamNotFoundException extends RuntimeException {
    private static final long serialVersionUID = 1L;
    public ExamNotFoundException(String message) {
        super(message);
    }
}
