package com.prelude.thitracnghiem_backend.dtos.req;

import lombok.Data;

@Data
public class ExamScheduleIdRequest {
    private Integer subjectId;
    private Integer sessionId;
    private Integer locationId;
    private Integer studentId;
    private Integer supervisoryId;
    private Integer examPaperId;
}
