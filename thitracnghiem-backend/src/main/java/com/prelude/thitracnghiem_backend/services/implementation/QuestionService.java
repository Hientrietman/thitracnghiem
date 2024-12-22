
// QuestionServiceImpl.java
package com.prelude.thitracnghiem_backend.services.implementation;

import com.prelude.thitracnghiem_backend.configurations.RedisConfiguartion;
import com.prelude.thitracnghiem_backend.dtos.req.AnswerRequest;
import com.prelude.thitracnghiem_backend.dtos.req.QuestionRequest;
import com.prelude.thitracnghiem_backend.dtos.res.PaginatedResponse;
import com.prelude.thitracnghiem_backend.dtos.res.QuestionDTO;
import com.prelude.thitracnghiem_backend.dtos.res.ResponseApi;
import com.prelude.thitracnghiem_backend.exceptions.CustomError.QuestionNotFoundException;
import com.prelude.thitracnghiem_backend.exceptions.CustomError.QuestionPoolNotFound;
import com.prelude.thitracnghiem_backend.models.*;
import com.prelude.thitracnghiem_backend.models.EnumTypes.QuestionTypeEnum;
import com.prelude.thitracnghiem_backend.repositories.*;
import com.prelude.thitracnghiem_backend.services.interfaces.IQuestionService;
import io.lettuce.core.RedisClient;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.io.File;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuestionService implements IQuestionService {
    private final QuestionRepository questionRepository;
    private final QuestionPoolRepository questionPoolRepository;
    private final AnswerRepository answerRepository;
    private final QuestionAnswerRepository questionAnswerRepository;
    private final MediaRepository mediaRepository;
    private final RedisTemplate<String, Object> redisTemplate;

    @Transactional
    @Override
    public ResponseApi<PaginatedResponse<QuestionDTO>> getQuestionsByPoolId(int questionPoolId, int page, int size) {
        String cacheKey = "questions:" + questionPoolId + ":" + page + ":" + size;
        PaginatedResponse<QuestionDTO> cachedResponse = (PaginatedResponse<QuestionDTO>) redisTemplate.opsForValue().get(cacheKey);

        if (cachedResponse != null) {
            return new ResponseApi<>(HttpStatus.OK, "Questions retrieved successfully from cache", cachedResponse, true);
        }

        Optional<QuestionPool> questionPool = questionPoolRepository.findById(questionPoolId);
        if (questionPool.isEmpty()) {
            throw new QuestionPoolNotFound("Question pool not found");
        }

        Page<Question> questionsPage = questionRepository.findByPool(questionPool.get(), PageRequest.of(page, size));

        PaginatedResponse<QuestionDTO> paginatedResponse = new PaginatedResponse<>();
        paginatedResponse.setTotalElements(questionsPage.getTotalElements());
        paginatedResponse.setTotalPages(questionsPage.getTotalPages());
        paginatedResponse.setPageNumber(questionsPage.getNumber());
        paginatedResponse.setPageSize(questionsPage.getSize());

        List<QuestionDTO> questionDTOs = questionsPage.getContent().stream()
                .map(QuestionDTO::convertToDTO)
                .collect(Collectors.toList());

        paginatedResponse.setContent(questionDTOs);

        // Save cache with a 10-minute TTL
        redisTemplate.opsForValue().set(cacheKey, paginatedResponse, 10, TimeUnit.MINUTES);

        return new ResponseApi<>(HttpStatus.OK, "Questions retrieved successfully", paginatedResponse, true);
    }

    @Override
    public ResponseApi<Question> getQuestionById(int questionId) {
        String cacheKey = "question:" + questionId;
        Question cachedQuestion = (Question) redisTemplate.opsForValue().get(cacheKey);

        if (cachedQuestion != null) {
            return new ResponseApi<>(HttpStatus.OK, "Question retrieved from cache", cachedQuestion, true);
        }

        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new QuestionNotFoundException("Question not found"));

        question.getQuestionAnswers().size();
        question.getQuestionAnswers().forEach(qa -> qa.getAnswer().getAnswerText());

        // Save question to cache with TTL
        redisTemplate.opsForValue().set(cacheKey, question, 10, TimeUnit.MINUTES);

        return new ResponseApi<>(HttpStatus.OK, "Question retrieved successfully", question, true);
    }

    @Override
    @Transactional
    public ResponseApi<Question> createQuestion(int poolId, QuestionRequest request) {
        QuestionPool pool = questionPoolRepository.findById(poolId)
                .orElseThrow(() -> new QuestionPoolNotFound("Pool not found"));

        Question question = new Question();
        question.setQuestionType(QuestionTypeEnum.valueOf(request.getQuestionType()));
        question.setQuestionText(request.getQuestionText());
        question.setDifficulty(request.getDifficulty());
        question.setPool(pool);

        Question savedQuestion = questionRepository.save(question);

        if (request.getAnswers() != null && !request.getAnswers().isEmpty()) {
            for (AnswerRequest answerDTO : request.getAnswers()) {
                Answer answer = new Answer();
                answer.setAnswerText(answerDTO.getAnswerText());
                answer.setCorrect(answerDTO.isCorrect());
                answer = answerRepository.save(answer);

                QuestionAnswer questionAnswer = new QuestionAnswer(savedQuestion.getQuestionId(), answer.getAnswerId());
                questionAnswerRepository.save(questionAnswer);
            }
        }


        // Reload and cache the full question
        Question reloadedQuestion = questionRepository.findById(savedQuestion.getQuestionId())
                .orElseThrow(() -> new QuestionNotFoundException("Question not found after creation"));

        // Xóa cache của tất cả các trang câu hỏi trong pool
        int totalPages = (int) Math.ceil((double) questionRepository.count() / 10); // Giả sử 10 câu hỏi mỗi trang
        for (int i = 0; i < totalPages; i++) {
            String cacheKeyForPage = "questions:" + poolId + ":" + i + ":10";
            redisTemplate.delete(cacheKeyForPage);
        }

        return new ResponseApi<>(HttpStatus.CREATED, "Question created successfully", reloadedQuestion, true);
    }


    @Transactional
    @Override
    public ResponseApi<Question> updateQuestion(int poolId, int questionId, QuestionRequest request) {
        QuestionPool pool = questionPoolRepository.findById(poolId)
                .orElseThrow(() -> new QuestionPoolNotFound("Question pool not found"));

        Question existingQuestion = questionRepository.findById(questionId)
                .orElseThrow(() -> new QuestionNotFoundException("Question not found"));

        // Xóa tất cả các answer cũ
        questionAnswerRepository.deleteByQuestionId(questionId);

        // Cập nhật câu hỏi
        existingQuestion.setQuestionText(request.getQuestionText());
        existingQuestion.setDifficulty(request.getDifficulty());

        existingQuestion = questionRepository.save(existingQuestion);

        if (request.getAnswers() != null && !request.getAnswers().isEmpty()) {
            for (AnswerRequest answerReq : request.getAnswers()) {
                Answer answer = new Answer();
                answer.setAnswerText(answerReq.getAnswerText());
                answer.setCorrect(answerReq.isCorrect());
                answer = answerRepository.save(answer);

                QuestionAnswer questionAnswer = new QuestionAnswer(existingQuestion.getQuestionId(), answer.getAnswerId());
                questionAnswerRepository.save(questionAnswer);
            }
        }

        // Cập nhật cache sau khi sửa câu hỏi
        clearQuestionCache(existingQuestion.getQuestionId());
        clearQuestionPoolCache(poolId);

        return new ResponseApi<>(HttpStatus.OK, "Question updated successfully", existingQuestion, true);
    }

    @Transactional
    @Override
    public ResponseApi<Void> deleteQuestion(int poolId, int questionId) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new QuestionNotFoundException("Question not found"));

        if (question.getPool().getQuestionPoolId() != poolId) {
            throw new QuestionNotFoundException("Question does not belong to specified pool");
        }

        // Xóa các media files liên quan
        Set<Media> mediaFiles = question.getMediaFiles();
        for (Media media : mediaFiles) {
            File file = new File(media.getFilePath());
            if (file.exists()) {
                if (!file.delete()) {
                    System.err.println("Failed to delete file: " + media.getFilePath());
                }
            }
        }

        // Xóa dữ liệu media trong cơ sở dữ liệu
        mediaRepository.deleteAll(mediaFiles);

        // Xóa câu hỏi khỏi cơ sở dữ liệu
        questionRepository.delete(question);

        // Xóa cache câu hỏi vừa xóa
        clearQuestionCache(questionId);

        // Xóa cache của ngân hàng câu hỏi (nếu cần thiết)
        clearQuestionPoolCache(poolId);

        // Xóa cache của tất cả các trang câu hỏi trong ngân hàng đề
        int totalPages = (int) Math.ceil((double) questionRepository.count() / 10); // Giả sử 10 câu hỏi mỗi trang
        for (int i = 0; i < totalPages; i++) {
            String cacheKeyForPage = "questions:" + poolId + ":" + i + ":10";
            redisTemplate.delete(cacheKeyForPage);
        }

        return new ResponseApi<>(HttpStatus.OK, "Question and associated files deleted successfully", null, true);
    }


    private void clearQuestionCache(int questionId) {
        String cacheKey = "question:" + questionId;
        redisTemplate.delete(cacheKey);
    }

    private void clearQuestionPoolCache(int poolId) {
        String cacheKey = "questions:" + poolId + ":all";
        redisTemplate.delete(cacheKey);
    }

}
