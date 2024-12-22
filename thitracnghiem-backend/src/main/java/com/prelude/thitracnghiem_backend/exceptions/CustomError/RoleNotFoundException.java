package com.prelude.thitracnghiem_backend.exceptions.CustomError;

public class RoleNotFoundException extends RuntimeException {
    private static final long serialVersionUID = 1L;
    public RoleNotFoundException(String message) {
        super(message);
    }
}
