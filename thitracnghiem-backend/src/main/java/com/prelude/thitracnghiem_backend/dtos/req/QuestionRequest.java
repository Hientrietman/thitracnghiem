package com.prelude.thitracnghiem_backend.dtos.req;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class QuestionRequest {
    private String questionText;
    private String questionType;
    private String mediaUrl;
    private int difficulty;
    private int poolId;
    private List<AnswerRequest> answers;
}