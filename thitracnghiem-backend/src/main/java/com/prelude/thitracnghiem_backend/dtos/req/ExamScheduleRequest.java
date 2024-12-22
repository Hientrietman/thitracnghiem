package com.prelude.thitracnghiem_backend.dtos.req;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class ExamScheduleRequest {
    private int subjectId;
    private int sessionId;
    private int locationId;
    private int examPaperId;
}

