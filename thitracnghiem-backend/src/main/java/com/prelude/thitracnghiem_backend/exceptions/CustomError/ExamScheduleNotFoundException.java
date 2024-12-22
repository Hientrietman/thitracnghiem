package com.prelude.thitracnghiem_backend.exceptions.CustomError;

public class ExamScheduleNotFoundException extends RuntimeException {
    public ExamScheduleNotFoundException(String message) {
        super(message);
    }
}
