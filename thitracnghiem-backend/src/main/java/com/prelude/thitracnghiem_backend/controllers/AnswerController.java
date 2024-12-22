package com.prelude.thitracnghiem_backend.controllers;

import com.prelude.thitracnghiem_backend.dtos.req.AnswerRequest;
import com.prelude.thitracnghiem_backend.dtos.res.ResponseApi;
import com.prelude.thitracnghiem_backend.models.Answer;
import com.prelude.thitracnghiem_backend.services.interfaces.IAnswerService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/answers")
@RequiredArgsConstructor
public class AnswerController {

    private final IAnswerService answerService;

    // Get all answers by question ID with pagination
    @GetMapping("/questions/{questionId}")
    public ResponseEntity<ResponseApi<Page<Answer>>> getAnswersByQuestionId(
            @PathVariable int questionId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        ResponseApi<Page<Answer>> response = answerService.getAllAnswersByQuestionId(questionId, page, size);
        return new ResponseEntity<>(response, response.getStatus());
    }

    // Create a new answer for a question
    @PostMapping("/questions/{questionId}")
    public ResponseEntity<ResponseApi<Answer>> createAnswer(
            @PathVariable int questionId,
            @RequestBody AnswerRequest request) {
        ResponseApi<Answer> response = answerService.createAnswer(questionId, request);
        return new ResponseEntity<>(response, response.getStatus());
    }

    // Update an existing answer for a question
    @PutMapping("/questions/{questionId}/{answerId}")
    public ResponseEntity<ResponseApi<Answer>> updateAnswer(
            @PathVariable int questionId,
            @PathVariable int answerId,
            @RequestBody AnswerRequest request) {
        ResponseApi<Answer> response = answerService.updateAnswer(questionId, answerId, request);
        return new ResponseEntity<>(response, response.getStatus());
    }

    // Delete an answer for a question
    @DeleteMapping("/questions/{questionId}/{answerId}")
    public ResponseEntity<ResponseApi<Void>> deleteAnswer(
            @PathVariable int questionId,
            @PathVariable int answerId) {
        ResponseApi<Void> response = answerService.deleteAnswer(questionId, answerId);
        return new ResponseEntity<>(response, response.getStatus());
    }
}
