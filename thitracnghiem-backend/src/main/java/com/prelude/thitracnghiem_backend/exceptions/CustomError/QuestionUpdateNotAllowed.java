package com.prelude.thitracnghiem_backend.exceptions.CustomError;

public class QuestionUpdateNotAllowed extends RuntimeException {
    public QuestionUpdateNotAllowed(String s) {
        super(s);
    }
}
