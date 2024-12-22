package com.prelude.thitracnghiem_backend.controllers;

import com.prelude.thitracnghiem_backend.dtos.req.ExamRequest;
import com.prelude.thitracnghiem_backend.dtos.res.ResponseApi;
import com.prelude.thitracnghiem_backend.models.Exam;
import com.prelude.thitracnghiem_backend.services.implementation.ExamService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/exams")
public class ExamController {

    private final ExamService examService;

    // Lấy tất cả các Exam với phân trang
    @GetMapping("/")
    public ResponseEntity<ResponseApi<Page<Exam>>> getAllExams(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return examService.getAllExams(page, size);
    }

    // Lấy thông tin chi tiết của một Exam theo ID
    @GetMapping("/{id}")
    public ResponseEntity<ResponseApi<Exam>> getExamById(@PathVariable int id) {
        return examService.getExamById(id);
    }



    @PostMapping("/")
    public ResponseEntity<ResponseApi<Exam>> createExam(@RequestBody ExamRequest examRequest) {
        return examService.createExam(examRequest);
    }

    // Cập nhật thông tin của một Exam
    @PutMapping("/{id}")
    public ResponseEntity<ResponseApi<Exam>> updateExam(
            @PathVariable int id,
            @RequestBody ExamRequest request) {
        return examService.updateExam(id, request);
    }

    // Xóa một Exam theo ID
    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseApi<Void>> deleteExam(@PathVariable int id) {
        return examService.deleteExam(id);
    }
}
