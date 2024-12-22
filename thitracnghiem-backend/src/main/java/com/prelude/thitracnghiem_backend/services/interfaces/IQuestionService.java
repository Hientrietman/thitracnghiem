package com.prelude.thitracnghiem_backend.services.interfaces;

import com.prelude.thitracnghiem_backend.dtos.req.QuestionRequest;
import com.prelude.thitracnghiem_backend.dtos.res.PaginatedResponse;
import com.prelude.thitracnghiem_backend.dtos.res.QuestionDTO;
import com.prelude.thitracnghiem_backend.dtos.res.ResponseApi;
import com.prelude.thitracnghiem_backend.models.Question;
import org.springframework.data.domain.Page;
import java.util.List;

public interface IQuestionService {
    ResponseApi<PaginatedResponse<QuestionDTO>>  getQuestionsByPoolId(int questionPoolId, int page, int size);

    ResponseApi<Question> getQuestionById(int questionId);

    ResponseApi<Question> createQuestion(int poolId, QuestionRequest request);
    ResponseApi<Question> updateQuestion(int poolId, int questionId, QuestionRequest request);
    ResponseApi<Void> deleteQuestion(int poolId, int questionId);
}