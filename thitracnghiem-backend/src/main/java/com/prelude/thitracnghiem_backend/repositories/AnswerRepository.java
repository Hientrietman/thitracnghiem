package com.prelude.thitracnghiem_backend.repositories;

import com.prelude.thitracnghiem_backend.models.Answer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AnswerRepository extends JpaRepository<Answer, Integer> {
    @Modifying
    @Query("DELETE FROM QuestionAnswer qa WHERE qa.questionId = :questionId AND qa.answerId = :answerId")
    void deleteQuestionAnswerRelation(@Param("questionId") int questionId, @Param("answerId") int answerId);

    @Query("SELECT a FROM Answer a JOIN QuestionAnswer qa ON a.answerId = qa.answerId " +
            "WHERE qa.questionId = :questionId AND a.isCorrect = true")
    List<Answer> findCorrectAnswersByQuestionId(@Param("questionId") int questionId);}
