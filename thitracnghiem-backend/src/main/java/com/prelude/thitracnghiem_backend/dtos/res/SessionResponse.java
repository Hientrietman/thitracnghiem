package com.prelude.thitracnghiem_backend.dtos.res;

import lombok.Data;

import java.sql.Timestamp;

@Data
public class SessionResponse {
    private int sessionId;
    private String sessionName;
    private Timestamp startTime;
}
