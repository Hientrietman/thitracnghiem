package com.prelude.thitracnghiem_backend.exceptions.CustomError;

public class SubjectNotFoundException extends RuntimeException {
    public SubjectNotFoundException(String message, Integer subjectId) {
        super(message);
    }
}
