package com.prelude.thitracnghiem_backend.services.interfaces;

import com.prelude.thitracnghiem_backend.dtos.req.AddQuestionsToExamPaperRequest;
import com.prelude.thitracnghiem_backend.dtos.req.ExamPaperRequest;
import com.prelude.thitracnghiem_backend.dtos.req.ExamPaperUpdateRequest;
import com.prelude.thitracnghiem_backend.dtos.res.ResponseApi;
import com.prelude.thitracnghiem_backend.models.ExamPaper;
import com.prelude.thitracnghiem_backend.models.ExamPaperQuestion;
import jakarta.transaction.Transactional;

import java.util.List;

public interface IExamPaperService {
//    ResponseApi<Page<ExamPaper>> getAllExamPapers(Pageable pageable);
//    ResponseApi<ExamPaper> getExamPaperById(int id);
    ResponseApi<ExamPaper> createExamPaper(ExamPaperRequest request);

    ResponseApi<ExamPaper> updateExamPaper(int examPaperId, ExamPaperUpdateRequest request);


    @Transactional
    ResponseApi<List<ExamPaperQuestion>> addQuestionsToExamPaper(AddQuestionsToExamPaperRequest request);

    ResponseApi<Void> deleteExamPaper(int id);
}
