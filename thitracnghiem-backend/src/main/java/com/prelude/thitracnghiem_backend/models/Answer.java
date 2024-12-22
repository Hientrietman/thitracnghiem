package com.prelude.thitracnghiem_backend.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "answer")
public class Answer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int answerId;

    @Column(name = "answer_text", nullable = false)
    private String answerText;

    @Column(name = "is_correct", nullable = false)
    private boolean isCorrect;

    @OneToMany(mappedBy = "answer", fetch = FetchType.EAGER)
    @JsonIgnoreProperties({"answer"}) // Prevent infinite recursion with QuestionAnswer
    private Set<QuestionAnswer> questionAnswers = new HashSet<>();
}