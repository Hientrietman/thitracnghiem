package com.prelude.thitracnghiem_backend.dtos.req;

import lombok.Data;

import java.util.List;

@Data
public class RemoveQuestionsFromExamPaperRequest {
    private int examPaperId;
    private List<Integer> questionIds; // Danh sách các ID của câu hỏi cần xóa
}
