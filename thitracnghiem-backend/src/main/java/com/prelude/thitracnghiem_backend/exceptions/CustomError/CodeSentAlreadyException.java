package com.prelude.thitracnghiem_backend.exceptions.CustomError;

public class CodeSentAlreadyException extends RuntimeException {
    public CodeSentAlreadyException(String message) {
        super(message);
    }
}
