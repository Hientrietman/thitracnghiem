package com.prelude.thitracnghiem_backend.models.CompositeKeys;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Objects;

@Data
@NoArgsConstructor
public class ExamExamPaperId implements Serializable {
    private int examId;      // ID của kỳ thi
    private int examPaperId; // ID của bài thi

    // Constructor
    public ExamExamPaperId(int examId, int examPaperId) {
        this.examId = examId;
        this.examPaperId = examPaperId;
    }

    // Phương thức equals
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ExamExamPaperId)) return false;
        ExamExamPaperId that = (ExamExamPaperId) o;
        return examId == that.examId &&
                examPaperId == that.examPaperId;
    }

    // Phương thức hashCode
    @Override
    public int hashCode() {
        return Objects.hash(examId, examPaperId);
    }
}
