package com.prelude.thitracnghiem_backend.services.interfaces;

import com.prelude.thitracnghiem_backend.dtos.req.AnswerRequest;
import com.prelude.thitracnghiem_backend.dtos.res.ResponseApi;
import com.prelude.thitracnghiem_backend.models.Answer;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;

public interface IAnswerService {
    @Transactional
    ResponseApi<Page<Answer>> getAllAnswersByQuestionId(int questionId, int page, int size);

    ResponseApi<Answer> createAnswer(int questionId, AnswerRequest request);
    ResponseApi<Answer> updateAnswer(int questionId, int answerId, AnswerRequest request);
    ResponseApi<Void> deleteAnswer(int questionId, int answerId);
}
