package com.prelude.thitracnghiem_backend.exceptions.CustomError;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;


public class ExamPaperNotFoundException extends RuntimeException {
    public ExamPaperNotFoundException(String message) {
        super(message);
    }
}
