package com.prelude.thitracnghiem_backend.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.prelude.thitracnghiem_backend.models.CompositeKeys.QuestionAnswerId;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "question_answer")
@IdClass(QuestionAnswerId.class)
public class QuestionAnswer {

    @Id
    @Column(name = "question_id")
    private int questionId;

    @Id
    @Column(name = "answer_id")
    private int answerId;

    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.REMOVE)
    @JoinColumn(name = "question_id", insertable = false, updatable = false)
    @JsonIgnoreProperties({"questionAnswers"})
    private Question question;

    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.REMOVE)
    @JoinColumn(name = "answer_id", insertable = false, updatable = false)
    @JsonIgnoreProperties({"questionAnswers"})
    private Answer answer;

    public QuestionAnswer(int questionId, int answerId) {
        this.questionId = questionId;
        this.answerId = answerId;
    }
}
