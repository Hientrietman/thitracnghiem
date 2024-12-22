package com.prelude.thitracnghiem_backend.dtos.req;

import lombok.Data;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@Data
public class ExamScheduleDTO {
    // Exam Paper Details
    private Integer examPaperId;
    private String examPaperTitle;
    private Integer duration;
    private Integer maxScore;
    private Integer passingScore;

    // Subject Details
    private Integer subjectId;
    private String subjectName;
    private String subjectDescription;

    // Session Details
    private Integer sessionId;
    private String sessionName;
    private Timestamp startTime;

    // Location Details
    private Integer locationId;
    private String locationName;
    private String locationAddress;
    private Integer locationCapacity;
}