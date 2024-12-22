package com.prelude.thitracnghiem_backend.dtos.req;

import lombok.Data;

import java.sql.Timestamp;

@Data
public class SessionRequest {
    private String sessionName;
    private Timestamp startTime;
}
