package com.prelude.thitracnghiem_backend.models.CompositeKeys;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Objects;
@Data
@NoArgsConstructor
public class ExamPaperQuestionId implements Serializable {

    private Integer examPaperId;
    private Integer questionId;

    // Constructor, equals, hashCode (để đảm bảo tính duy nhất của khóa kết hợp)
    public ExamPaperQuestionId(Integer examPaperId, Integer questionId) {
        this.examPaperId = examPaperId;
        this.questionId = questionId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ExamPaperQuestionId that = (ExamPaperQuestionId) o;
        return Objects.equals(examPaperId, that.examPaperId) && Objects.equals(questionId, that.questionId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(examPaperId, questionId);
    }


}
