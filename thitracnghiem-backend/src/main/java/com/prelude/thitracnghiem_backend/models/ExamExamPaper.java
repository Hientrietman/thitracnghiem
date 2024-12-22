package com.prelude.thitracnghiem_backend.models;


import com.fasterxml.jackson.annotation.JsonBackReference;
import com.prelude.thitracnghiem_backend.models.CompositeKeys.ExamExamPaperId;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@Table(name = "exam_exam_paper")
@IdClass(ExamExamPaperId.class) // Đặt khóa chính kết hợp
public class ExamExamPaper {

    @Id
    private int examId;

    @Id
    private int examPaperId;

    @ManyToOne
    @MapsId("examId")
    @JoinColumn(name = "exam_id", nullable = false)
    private Exam exam;

    @ManyToOne
    @MapsId("examPaperId")
    @JoinColumn(name = "exam_paper_id", nullable = false)
    @JsonBackReference
    private ExamPaper examPaper;

    public ExamExamPaper(Exam exam, ExamPaper examPaper) {
        this.exam = exam;
        this.examPaper = examPaper;
    }
}
