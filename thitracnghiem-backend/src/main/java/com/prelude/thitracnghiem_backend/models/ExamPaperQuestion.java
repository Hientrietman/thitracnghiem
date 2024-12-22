package com.prelude.thitracnghiem_backend.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.prelude.thitracnghiem_backend.models.CompositeKeys.ExamPaperQuestionId;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "exam_paper_question")
@IdClass(ExamPaperQuestionId.class)  // Chỉ định khóa chính kết hợp
public class ExamPaperQuestion {

    @Id
    @Column(name = "exam_paper_id")
    private Integer examPaperId;

    @Id
    @Column(name = "question_id")
    private Integer questionId;

    @ManyToOne
    @MapsId("examPaperId")  // Ánh xạ khóa chính từ ExamPaper
    @JoinColumn(name = "exam_paper_id", nullable = false)
    @JsonBackReference
    private ExamPaper examPaper;

    @ManyToOne
    @MapsId("questionId")  // Ánh xạ khóa chính từ Question
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;

    @Column(name = "point_value")
    private Integer pointValue;

    // Getters and Setters
}
