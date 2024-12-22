package com.prelude.thitracnghiem_backend.repositories;

import com.prelude.thitracnghiem_backend.models.ExamPaper;
import com.prelude.thitracnghiem_backend.models.ExamPaperQuestion;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExamPaperRepository extends JpaRepository<ExamPaper, Integer> {

    @Query("SELECT DISTINCT epq FROM ExamPaperQuestion epq " +
            "LEFT JOIN FETCH epq.question q " +
            "LEFT JOIN FETCH q.mediaFiles m " +
            "WHERE epq.examPaper.examPaperId = :examPaperId " +
            "ORDER BY q.questionId ASC, " +
            "         m.mediaId ASC")
    List<ExamPaperQuestion> findExamPaperQuestionsWithAllDetailsSorted(@Param("examPaperId") int examPaperId);
}

