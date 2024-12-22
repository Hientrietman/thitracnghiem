package com.prelude.thitracnghiem_backend.repositories;

import com.prelude.thitracnghiem_backend.models.CompositeKeys.QuestionAnswerId;
import com.prelude.thitracnghiem_backend.models.QuestionAnswer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuestionAnswerRepository extends JpaRepository<QuestionAnswer, QuestionAnswerId> {
    void deleteByQuestionId(int questionId);
}
