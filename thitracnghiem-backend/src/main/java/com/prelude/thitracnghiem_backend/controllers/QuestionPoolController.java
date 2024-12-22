package com.prelude.thitracnghiem_backend.controllers;

import com.prelude.thitracnghiem_backend.dtos.req.QuestionPoolRequest;
import com.prelude.thitracnghiem_backend.dtos.res.PaginatedResponse;
import com.prelude.thitracnghiem_backend.dtos.res.QuestionPoolResponse;
import com.prelude.thitracnghiem_backend.dtos.res.ResponseApi;
import com.prelude.thitracnghiem_backend.models.QuestionPool;
import com.prelude.thitracnghiem_backend.services.implementation.QuestionPoolService;
import com.prelude.thitracnghiem_backend.services.interfaces.IQuestionPoolService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/admin/question-pools")
@RequiredArgsConstructor
public class QuestionPoolController {
    private final IQuestionPoolService questionPoolService;

    @GetMapping("/all")
    public ResponseEntity<ResponseApi<?>> getQuestionPools(
            @RequestParam(defaultValue = "0") int page, // Giá trị mặc định cho page là 0
            @RequestParam(defaultValue = "10") int size // Giá trị mặc định cho size là 10
    ) {
        ResponseApi<PaginatedResponse<QuestionPoolResponse>> response = questionPoolService.getAllQuestionPools(page, size);
        return new ResponseEntity<>(response, response.getStatus());
    }
    @GetMapping("/{poolId}")
    public ResponseEntity<ResponseApi<QuestionPoolResponse>> getQuestionPool(
            @PathVariable int poolId
    ) {
        ResponseApi<QuestionPoolResponse> response = questionPoolService.getQuestionPool(poolId);
        return new ResponseEntity<>(response, response.getStatus());
    }
    @PostMapping("/create")
    public ResponseEntity<ResponseApi<QuestionPool>> createQuestionPool(
            @RequestBody QuestionPoolRequest request
    ) {
        ResponseApi<QuestionPool> response = questionPoolService.createQuestionPool(request);
        return new ResponseEntity<>(response, response.getStatus());
    }
    @PutMapping("/{poolId}")
    public ResponseEntity<ResponseApi<QuestionPoolResponse>> updateQuestionPool(
            @PathVariable int poolId,
            @RequestBody QuestionPoolRequest request
    ) {
        ResponseApi<QuestionPoolResponse> response = questionPoolService.updateQuestionPool(poolId, request);
        return new ResponseEntity<>(response, response.getStatus());
    }
    @DeleteMapping("/{poolId}")
    public ResponseEntity<ResponseApi<Void>> deleteQuestionPool(
            @PathVariable int poolId
    ) {
        ResponseApi<Void> response = questionPoolService.deleteQuestionPool(poolId);
        return new ResponseEntity<>(response, response.getStatus());
    }

}
