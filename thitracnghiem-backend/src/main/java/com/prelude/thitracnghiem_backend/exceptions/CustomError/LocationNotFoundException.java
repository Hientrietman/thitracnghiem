package com.prelude.thitracnghiem_backend.exceptions.CustomError;

public class LocationNotFoundException extends RuntimeException {
    public LocationNotFoundException(String locationNotFound, Integer locationId) {
        super(locationNotFound);
    }
}
