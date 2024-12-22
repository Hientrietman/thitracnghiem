package com.prelude.thitracnghiem_backend.dtos.req;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Data
@NoArgsConstructor
public class ExamPaperRequest {
    private int examId; // ID của kỳ thi liên kết
    private String title;
    private String description;
    private int duration;
    private int maxScore;
    private int passingScore;
    private boolean canAwardCertificate;
    // Getters và setters
}
