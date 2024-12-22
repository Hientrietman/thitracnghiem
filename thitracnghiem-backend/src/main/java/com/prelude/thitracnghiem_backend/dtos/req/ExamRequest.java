package com.prelude.thitracnghiem_backend.dtos.req;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
@Data
@NoArgsConstructor
public class ExamRequest {

    private String examName; // Tên kỳ thi
    private String description; // Mô tả kỳ thi
    private LocalDateTime startDate; // Thời gian bắt đầu kỳ thi
    private LocalDateTime endDate; // Thời gian kết thúc kỳ thi
    private String status; // Trạng thái kỳ thi (e.g., "ACTIVE", "INACTIVE")



}
