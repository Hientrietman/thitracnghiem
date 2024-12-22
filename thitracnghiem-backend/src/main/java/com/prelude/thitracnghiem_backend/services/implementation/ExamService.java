package com.prelude.thitracnghiem_backend.services.implementation;

import com.prelude.thitracnghiem_backend.dtos.req.ExamRequest;
import com.prelude.thitracnghiem_backend.dtos.res.ResponseApi;
import com.prelude.thitracnghiem_backend.exceptions.CustomError.ExamNotFoundException;
import com.prelude.thitracnghiem_backend.models.EnumTypes.ExamStatusEnum;
import com.prelude.thitracnghiem_backend.models.Exam;
import com.prelude.thitracnghiem_backend.repositories.ExamRepository;
import com.prelude.thitracnghiem_backend.services.interfaces.IExamService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ExamService implements IExamService {

    private final ExamRepository examRepository;

    // 1. Create Exam
    @Override
    public ResponseEntity<ResponseApi<Exam>> createExam(ExamRequest request) {
        // Tạo một đối tượng Exam mới
        Exam exam = new Exam();
        exam.setExamName(request.getExamName());
        exam.setDescription(request.getDescription());
        exam.setStartDate(request.getStartDate());
        exam.setEndDate(request.getEndDate());
        exam.setStatus(ExamStatusEnum.valueOf(request.getStatus()));

        // Lưu vào cơ sở dữ liệu
        Exam savedExam = examRepository.save(exam);

        // Tạo ResponseApi và trả về thông tin chi tiết của kỳ thi
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ResponseApi<>(HttpStatus.CREATED, "Exam created successfully", savedExam, true));
    }


    // 2. Get all Exams
    @Override
    public ResponseEntity<ResponseApi<Page<Exam>>> getAllExams(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Exam> exams = examRepository.findAll(pageable);

        return ResponseEntity.ok(new ResponseApi<>(HttpStatus.OK, "Fetched all exams successfully", exams, true));
    }

    // 3. Get Exam by ID
    @Override
    public ResponseEntity<ResponseApi<Exam>> getExamById(int id) {
        Exam exam = examRepository.findById(id).orElseThrow(() -> new ExamNotFoundException("Exam not found"));

        return ResponseEntity.ok(new ResponseApi<>(HttpStatus.OK, "Exam fetched successfully", exam, true));
    }

    // 4. Update Exam
    @Override
    public ResponseEntity<ResponseApi<Exam>> updateExam(int id, ExamRequest request) {
        Exam exam = examRepository.findById(id).orElseThrow(() -> new ExamNotFoundException("Exam not found"));

        // Cập nhật các thuộc tính từ request vào exam
        exam.setExamName(request.getExamName());
        exam.setDescription(request.getDescription());
        exam.setStartDate(request.getStartDate());
        exam.setEndDate(request.getEndDate());
        exam.setStatus(ExamStatusEnum.valueOf(request.getStatus()));

        // Lưu và trả về exam đã cập nhật
        Exam updatedExam = examRepository.save(exam);
        return ResponseEntity.ok(new ResponseApi<>(HttpStatus.OK, "Exam updated successfully", updatedExam, true));
    }

    // 5. Delete Exam
    @Override
    public ResponseEntity<ResponseApi<Void>> deleteExam(int id) {
        Exam exam = examRepository.findById(id).orElseThrow(() -> new ExamNotFoundException("Exam not found"));

        examRepository.delete(exam);

        return ResponseEntity.ok(new ResponseApi<>(HttpStatus.OK, "Exam deleted successfully", null, true));
    }
}
