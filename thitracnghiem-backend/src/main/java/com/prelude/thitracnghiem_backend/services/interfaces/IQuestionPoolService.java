package com.prelude.thitracnghiem_backend.services.interfaces;

import com.prelude.thitracnghiem_backend.dtos.req.QuestionPoolRequest;
import com.prelude.thitracnghiem_backend.dtos.res.PaginatedResponse;
import com.prelude.thitracnghiem_backend.dtos.res.QuestionPoolResponse;
import com.prelude.thitracnghiem_backend.dtos.res.ResponseApi;
import com.prelude.thitracnghiem_backend.models.QuestionPool;
import org.springframework.data.domain.Page;

public interface IQuestionPoolService {

    ResponseApi<QuestionPoolResponse> getQuestionPool(int poolId);

    ResponseApi<PaginatedResponse<QuestionPoolResponse>> getAllQuestionPools(int page, int size);    ResponseApi<QuestionPool> createQuestionPool(QuestionPoolRequest request);
    ResponseApi<QuestionPoolResponse> updateQuestionPool(int poolId, QuestionPoolRequest request);
    ResponseApi<Void> deleteQuestionPool(int poolId);

}
