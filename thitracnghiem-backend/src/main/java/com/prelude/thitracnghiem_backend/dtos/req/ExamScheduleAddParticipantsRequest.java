package com.prelude.thitracnghiem_backend.dtos.req;

import lombok.Data;
import java.util.List;

@Data
public class ExamScheduleAddParticipantsRequest {
    private Integer examScheduleId;  // ID của ExamSchedule
    private List<Integer> userIds;   // Danh sách ID của User
}
