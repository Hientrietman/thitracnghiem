package com.prelude.thitracnghiem_backend.models.CompositeKeys;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Objects;

@Data
@NoArgsConstructor
public class QuestionAnswerId implements Serializable {

    private int questionId; // questionId
    private int answerId; // answerId

    // Constructor
    public QuestionAnswerId(int questionId, int answerId) {
        this.questionId = questionId;
        this.answerId = answerId;
    }

    // Equals method
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof QuestionAnswerId)) return false;
        QuestionAnswerId that = (QuestionAnswerId) o;
        return Objects.equals(questionId, that.questionId) &&
                Objects.equals(answerId, that.answerId);
    }

    // HashCode method
    @Override
    public int hashCode() {
        return Objects.hash(questionId, answerId);
    }
}
