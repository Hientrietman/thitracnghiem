package com.prelude.thitracnghiem_backend.dtos.req;

import lombok.Data;

@Data
public class ExamScheduleUpdateRequest {
    // Current IDs for the schedule being updated
    private Integer currentSubjectId;
    private Integer currentSessionId;
    private Integer currentLocationId;
    private Integer currentStudentId;
    private Integer currentSupervisoryId;
    private Integer currentExamId;

    // New IDs that might be updated
    private Integer newSubjectId;
    private Integer newSessionId;
    private Integer newLocationId;
    private Integer newStudentId;
    private Integer newSupervisoryId;
    private Integer newExamId;
}