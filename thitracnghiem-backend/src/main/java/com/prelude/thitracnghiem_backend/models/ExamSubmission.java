package com.prelude.thitracnghiem_backend.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
public class ExamSubmission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int resultId;

    private int userId;
    private int examPaperId;
    private int questionId;

    @Column(length = 1000) // Tùy chỉnh độ dài text cho phù hợp
    private String questionText;

    @ElementCollection
    private List<Integer> selectedAnswers;

    @ElementCollection
    private List<String> selectedAnswerTexts; // Lưu text của đáp án đã chọn

    @ElementCollection
    private List<Integer> correctAnswers;

    @ElementCollection
    private List<String> correctAnswerTexts; // Lưu text của đáp án đúng

    private boolean isCorrect;


}
