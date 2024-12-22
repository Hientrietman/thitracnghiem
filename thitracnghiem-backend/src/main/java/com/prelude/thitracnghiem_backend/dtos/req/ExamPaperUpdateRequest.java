package com.prelude.thitracnghiem_backend.dtos.req;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ExamPaperUpdateRequest {
    private String title;
    private String description;
    private int duration;
    private int maxScore;
    private int passingScore;
    private boolean canAwardCertificate;
    // Getters và setters
}