package com.prelude.thitracnghiem_backend.controllers;


import com.prelude.thitracnghiem_backend.dtos.req.AddQuestionsToExamPaperRequest;
import com.prelude.thitracnghiem_backend.dtos.req.ExamPaperRequest;
import com.prelude.thitracnghiem_backend.dtos.req.ExamPaperUpdateRequest;
import com.prelude.thitracnghiem_backend.dtos.req.RemoveQuestionsFromExamPaperRequest;
import com.prelude.thitracnghiem_backend.dtos.res.ResponseApi;
import com.prelude.thitracnghiem_backend.models.ExamPaper;
import com.prelude.thitracnghiem_backend.models.ExamPaperQuestion;
import com.prelude.thitracnghiem_backend.services.implementation.ExamPaperService;
import com.prelude.thitracnghiem_backend.services.interfaces.IExamPaperService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/exam-papers")
@RequiredArgsConstructor
public class ExamPaperController {

   private final ExamPaperService examPaperService;
    @GetMapping
    public ResponseEntity<ResponseApi<Page<ExamPaper>>> getAllExamPapers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(examPaperService.getAllExamPapers(pageable));
    }
    @GetMapping("/{id}")
    public ResponseEntity<ResponseApi<ExamPaper>> getExamPaperById(@PathVariable int id) {
        return ResponseEntity.ok(examPaperService.getExamPaperById(id));
    }

    @PostMapping
    public ResponseEntity<ResponseApi<ExamPaper>> createExamPaper(@RequestBody ExamPaperRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(examPaperService.createExamPaper(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResponseApi<ExamPaper>> updateExamPaper(
            @PathVariable int id, @RequestBody ExamPaperUpdateRequest request) {
        return ResponseEntity.ok(examPaperService.updateExamPaper(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseApi<Void>> deleteExamPaper(@PathVariable int id) {
        examPaperService.deleteExamPaper(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
    @PostMapping("/add-questions")
    public ResponseEntity<ResponseApi<List<ExamPaperQuestion>>> addQuestionsToExamPaper(
            @RequestBody AddQuestionsToExamPaperRequest request) {
        return ResponseEntity.ok(examPaperService.addQuestionsToExamPaper(request));
    }
    @DeleteMapping("/remove-questions")
    public ResponseEntity<ResponseApi<List<String>>> deleteQuestionsFromExamPaper(
            @RequestBody RemoveQuestionsFromExamPaperRequest request) {
        ResponseApi<List<String>> response = examPaperService.deleteQuestionsFromExamPaper(request);
        return ResponseEntity.status(response.getStatus()).body(response);
    }
}
