package com.prelude.thitracnghiem_backend.services.implementation;


import com.prelude.thitracnghiem_backend.dtos.req.QuestionPoolRequest;
import com.prelude.thitracnghiem_backend.dtos.res.PaginatedResponse;
import com.prelude.thitracnghiem_backend.dtos.res.QuestionPoolResponse;
import com.prelude.thitracnghiem_backend.dtos.res.ResponseApi;
import com.prelude.thitracnghiem_backend.exceptions.CustomError.DeletePoolNotAllowedException;
import com.prelude.thitracnghiem_backend.exceptions.CustomError.QuestionPoolNotFound;
import com.prelude.thitracnghiem_backend.models.Question;
import com.prelude.thitracnghiem_backend.models.QuestionPool;
import com.prelude.thitracnghiem_backend.repositories.QuestionPoolRepository;
import com.prelude.thitracnghiem_backend.services.interfaces.IQuestionPoolService;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuestionPoolService implements IQuestionPoolService {
    private final QuestionPoolRepository questionPoolRepository;
    private final RedisTemplate<String, Object> redisTemplate;

    @Override
    public ResponseApi<QuestionPoolResponse> getQuestionPool(int poolId) {
        // Kiểm tra xem dữ liệu đã có trong cache chưa
        String cacheKey = "questionPool:" + poolId;
        QuestionPoolResponse cachedResponse = (QuestionPoolResponse) redisTemplate.opsForValue().get(cacheKey);

        if (cachedResponse != null) {
            // Nếu có trong cache, trả về ngay
            return new ResponseApi<>(HttpStatus.OK, "Question pool retrieved from cache", cachedResponse, true);
        }

        // Nếu không có trong cache, lấy dữ liệu từ database
        QuestionPool pool = questionPoolRepository.findById(poolId).orElseThrow(
                () -> new QuestionPoolNotFound("Question pool not found"));

        // Tạo danh sách text của các câu hỏi
        List<String> questionTexts = pool.getQuestions().stream()
                .map(Question::getQuestionText)
                .collect(Collectors.toList());

        // Chuyển đổi thành QuestionPoolRes
        QuestionPoolResponse response = new QuestionPoolResponse();
        response.setQuestionPoolId(pool.getQuestionPoolId());
        response.setPoolName(pool.getPoolName());
        response.setDescription(pool.getDescription());
        response.setQuestions(questionTexts);

        // Lưu vào cache để sử dụng lần sau
        redisTemplate.opsForValue().set(cacheKey, response);

        return new ResponseApi<>(HttpStatus.OK, "Question pool retrieved successfully", response, true);
    }

    @Override
    public ResponseApi<PaginatedResponse<QuestionPoolResponse>> getAllQuestionPools(int page, int size) {
        // Tạo key cache từ page và size
        String cacheKey = "questionPools:" + page + ":" + size;

        // Kiểm tra xem dữ liệu đã có trong cache chưa
        PaginatedResponse<QuestionPoolResponse> cachedResponse = (PaginatedResponse<QuestionPoolResponse>) redisTemplate.opsForValue().get(cacheKey);

        if (cachedResponse != null) {
            // Nếu có trong cache, trả về ngay
            return new ResponseApi<>(HttpStatus.OK, "Question pools retrieved from cache", cachedResponse, true);
        }

        // Nếu không có trong cache, lấy dữ liệu từ database
        Pageable pageable = PageRequest.of(page, size);
        Page<QuestionPool> questionPools = questionPoolRepository.findAll(pageable);

        // Chuyển đổi sang DTO
        List<QuestionPoolResponse> questionPoolResponses = questionPools.getContent().stream()
                .map(pool -> {
                    List<String> questionTexts = pool.getQuestions().stream()
                            .map(Question::getQuestionText)
                            .collect(Collectors.toList());
                    QuestionPoolResponse response = new QuestionPoolResponse();
                    response.setQuestionPoolId(pool.getQuestionPoolId());
                    response.setPoolName(pool.getPoolName());
                    response.setDescription(pool.getDescription());
                    response.setQuestions(questionTexts);
                    return response;
                })
                .collect(Collectors.toList());

        // Tạo PaginatedResponse
        PaginatedResponse<QuestionPoolResponse> paginatedResponse = new PaginatedResponse<>();
        paginatedResponse.setTotalElements(questionPools.getTotalElements());
        paginatedResponse.setTotalPages(questionPools.getTotalPages());
        paginatedResponse.setPageNumber(questionPools.getNumber());
        paginatedResponse.setPageSize(questionPools.getSize());
        paginatedResponse.setContent(questionPoolResponses);

        // Lưu vào cache để sử dụng lần sau
        redisTemplate.opsForValue().set(cacheKey, paginatedResponse);

        // Trả về kết quả
        return new ResponseApi<>(HttpStatus.OK, "Question pools retrieved successfully", paginatedResponse, true);
    }

    @Override
    public ResponseApi<QuestionPool> createQuestionPool(QuestionPoolRequest request) {
        QuestionPool pool = new QuestionPool();
        pool.setPoolName(request.getPoolName());
        pool.setDescription(request.getDescription());

        QuestionPool savedPool = questionPoolRepository.save(pool);

        // Xóa tất cả cache liên quan đến questionPools khi có thay đổi dữ liệu
        // Giả sử có 10 câu hỏi mỗi trang, bạn sẽ xóa cache của tất cả các trang
        int totalPages = (int) Math.ceil((double) questionPoolRepository.count() / 10);
        for (int i = 0; i < totalPages; i++) {
            redisTemplate.delete("questionPools:" + i + ":10");
        }

        return new ResponseApi<>(HttpStatus.CREATED, "Question pool created successfully", savedPool, true);
    }

    @Override
    public ResponseApi<QuestionPoolResponse> updateQuestionPool(int poolId, QuestionPoolRequest request) {
        QuestionPool pool = questionPoolRepository.findById(poolId).orElseThrow(
                () -> new QuestionPoolNotFound("Question pool not found"));
        pool.setPoolName(request.getPoolName());
        pool.setDescription(request.getDescription());

        // Lưu thay đổi
        QuestionPool updatedPool = questionPoolRepository.save(pool);

        // Chuyển đổi thành QuestionPoolRes
        QuestionPoolResponse response = new QuestionPoolResponse();
        response.setQuestionPoolId(updatedPool.getQuestionPoolId());
        response.setPoolName(updatedPool.getPoolName());
        response.setDescription(updatedPool.getDescription());

        // trả về danh sách câu hỏi trong pool dưới dạng text
        List<String> questionTexts = updatedPool.getQuestions().stream()
                .map(Question::getQuestionText)
                .collect(Collectors.toList());
        response.setQuestions(questionTexts);

        // Cập nhật cache cho pool mới sau khi sửa
        String cacheKey = "questionPool:" + poolId;
        redisTemplate.opsForValue().set(cacheKey, response);

        // Xóa tất cả cache của các trang khi có sự thay đổi
        int totalPages = (int) Math.ceil((double) questionPoolRepository.count() / 10);
        for (int i = 0; i < totalPages; i++) {
            redisTemplate.delete("questionPools:" + i + ":10");
        }

        return new ResponseApi<>(HttpStatus.OK, "Question pool updated successfully", response, true);
    }

    @Override
    public ResponseApi<Void> deleteQuestionPool(int poolId) {
        // Kiểm tra xem ngân hàng đề có tồn tại hay không
        QuestionPool pool = questionPoolRepository.findById(poolId)
                .orElseThrow(() -> new QuestionPoolNotFound("Question pool not found"));

        // Kiểm tra xem ngân hàng đề có câu hỏi nào hay không
        if (!pool.getQuestions().isEmpty()) {
            throw new DeletePoolNotAllowedException("Cannot delete question pool as it contains questions");
        }

        // Xóa cache của question pool cụ thể
        redisTemplate.delete("questionPool:" + poolId);

        // Xóa tất cả cache của các trang khi có sự thay đổi
        int totalPages = (int) Math.ceil((double) questionPoolRepository.count() / 10);
        for (int i = 0; i < totalPages; i++) {
            redisTemplate.delete("questionPools:" + i + ":10");
        }

        // Thực hiện xóa nếu không có câu hỏi
        questionPoolRepository.deleteById(poolId);
        return new ResponseApi<>(HttpStatus.OK, "Question pool deleted successfully", null, true);
    }
}
