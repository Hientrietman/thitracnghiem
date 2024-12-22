package com.prelude.thitracnghiem_backend.dtos.req;

import lombok.Data;

import java.util.List;

@Data
public class AddQuestionsToExamPaperRequest {
    private int examPaperId;
    private List<QuestionWithPoint> questions;

    @Data
    public static class QuestionWithPoint {
        private int questionId;
        private int pointValue;
    }
}
