package com.prelude.thitracnghiem_backend.exceptions.CustomError;

public class SessionNotFoundException extends RuntimeException {
    public SessionNotFoundException(String sessionNotFound, Integer sessionId) {
        super(sessionNotFound);
    }
}
