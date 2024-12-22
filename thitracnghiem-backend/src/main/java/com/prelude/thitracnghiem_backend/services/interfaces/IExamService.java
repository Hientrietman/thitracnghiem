package com.prelude.thitracnghiem_backend.services.interfaces;

import com.prelude.thitracnghiem_backend.dtos.req.ExamRequest;
import com.prelude.thitracnghiem_backend.dtos.res.ResponseApi;
import com.prelude.thitracnghiem_backend.models.Exam;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;

public interface IExamService {
    ResponseEntity<ResponseApi<Page<Exam>>> getAllExams(int page, int size);

    ResponseEntity<ResponseApi<Exam>> getExamById(int id);

    ResponseEntity<ResponseApi<Exam>> createExam(ExamRequest request);

    ResponseEntity<ResponseApi<Exam>> updateExam(int id, ExamRequest request);

    ResponseEntity<ResponseApi<Void>> deleteExam(int id);
}
