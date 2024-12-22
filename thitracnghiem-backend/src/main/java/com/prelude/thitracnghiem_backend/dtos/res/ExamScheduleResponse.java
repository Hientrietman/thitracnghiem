package com.prelude.thitracnghiem_backend.dtos.res;

import lombok.Data;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.sql.Timestamp;

@Data
@AllArgsConstructor
public class ExamScheduleResponse {
    private int id;
    private int examPaperId;
    private String subjectName;
    private Timestamp sessionStartTime;
    private String locationName;



}

