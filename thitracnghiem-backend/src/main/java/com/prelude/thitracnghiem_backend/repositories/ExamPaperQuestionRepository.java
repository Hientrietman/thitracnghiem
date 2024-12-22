package com.prelude.thitracnghiem_backend.repositories;

import com.prelude.thitracnghiem_backend.models.CompositeKeys.ExamPaperQuestionId;
import com.prelude.thitracnghiem_backend.models.ExamPaperQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ExamPaperQuestionRepository extends JpaRepository<ExamPaperQuestion, ExamPaperQuestionId> {

    @Query("SELECT epq FROM ExamPaperQuestion epq WHERE epq.examPaperId = :examPaperId AND epq.questionId = :questionId")
    Optional<ExamPaperQuestion> findByExamPaperIdAndQuestionId(@Param("examPaperId") Integer examPaperId, @Param("questionId") Integer questionId);
}
