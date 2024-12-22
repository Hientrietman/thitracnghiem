package com.prelude.thitracnghiem_backend.controllers;

import com.prelude.thitracnghiem_backend.dtos.req.QuestionRequest;
import com.prelude.thitracnghiem_backend.dtos.res.PaginatedResponse;
import com.prelude.thitracnghiem_backend.dtos.res.QuestionDTO;
import com.prelude.thitracnghiem_backend.dtos.res.ResponseApi;
import com.prelude.thitracnghiem_backend.models.Question;
import com.prelude.thitracnghiem_backend.services.interfaces.IQuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/admin/question-pools/{questionPoolId}/questions")
@RequiredArgsConstructor
public class QuestionController {
    private final IQuestionService questionService;

    @GetMapping("/")
    public ResponseEntity<ResponseApi<PaginatedResponse<QuestionDTO>>> getQuestionsByPoolId(
            @PathVariable int questionPoolId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        ResponseApi<PaginatedResponse<QuestionDTO>>  response = questionService.getQuestionsByPoolId(questionPoolId, page, size);
        return new ResponseEntity<>(response, response.getStatus());
    }


    @GetMapping("/{questionId}")
    public ResponseEntity<ResponseApi<Question>> getQuestionById(
            @PathVariable int questionPoolId,
            @PathVariable int questionId
    ) {
        // Thêm kiểm tra câu hỏi có thuộc ngân hàng câu hỏi không (nếu cần thiết)
        ResponseApi<Question> response = questionService.getQuestionById(questionId);
        return new ResponseEntity<>(response, response.getStatus());
    }

    @PostMapping
    public ResponseEntity<ResponseApi<Question>> createQuestion(
            @PathVariable int questionPoolId,
            @RequestBody QuestionRequest request
    ) {
        ResponseApi<Question> response = questionService.createQuestion(questionPoolId, request);
        return new ResponseEntity<>(response, response.getStatus());
    }
    @PutMapping("/{questionId}")
    public ResponseEntity<ResponseApi<Question>> updateQuestion(
            @PathVariable int questionPoolId,
            @PathVariable int questionId,
            @RequestBody QuestionRequest request
    ) {
        ResponseApi<Question> response = questionService.updateQuestion(questionPoolId, questionId, request);
        return new ResponseEntity<>(response, response.getStatus());
    }
    @DeleteMapping("/{questionId}")
    public ResponseEntity<ResponseApi<Void>> deleteQuestion(
            @PathVariable int questionPoolId,
            @PathVariable int questionId
    ) {
        ResponseApi<Void> response = questionService.deleteQuestion(questionPoolId, questionId);
        return new ResponseEntity<>(response, response.getStatus());
    }

}