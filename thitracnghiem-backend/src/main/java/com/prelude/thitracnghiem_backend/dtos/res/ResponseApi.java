package com.prelude.thitracnghiem_backend.dtos.res;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResponseApi<T> {
    private HttpStatus status;
    private String message;
    private T data;
    private boolean success;

}