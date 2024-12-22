package com.prelude.thitracnghiem_backend.repositories;

import com.prelude.thitracnghiem_backend.models.CompositeKeys.ExamExamPaperId;
import com.prelude.thitracnghiem_backend.models.Exam;
import com.prelude.thitracnghiem_backend.models.ExamExamPaper;
import com.prelude.thitracnghiem_backend.models.ExamPaper;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ExamExamPaperRepository extends JpaRepository<ExamExamPaper, ExamExamPaperId> {

    List<ExamExamPaper> findByExamPaperId(int examPaperId);
}
