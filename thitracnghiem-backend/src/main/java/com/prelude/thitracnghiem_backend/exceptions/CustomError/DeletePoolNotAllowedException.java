package com.prelude.thitracnghiem_backend.exceptions.CustomError;

public class DeletePoolNotAllowedException extends RuntimeException {
    private static final long serialVersionUID = 1L;
    public DeletePoolNotAllowedException(String message) {
        super(message);
    }
}
