package com.prelude.thitracnghiem_backend.services.implementation;


import com.prelude.thitracnghiem_backend.dtos.req.AnswerRequest;
import com.prelude.thitracnghiem_backend.dtos.res.ResponseApi;
import com.prelude.thitracnghiem_backend.models.Answer;
import com.prelude.thitracnghiem_backend.models.EnumTypes.QuestionTypeEnum;
import com.prelude.thitracnghiem_backend.models.Question;
import com.prelude.thitracnghiem_backend.models.QuestionAnswer;
import com.prelude.thitracnghiem_backend.repositories.AnswerRepository;
import com.prelude.thitracnghiem_backend.repositories.QuestionRepository;
import com.prelude.thitracnghiem_backend.services.interfaces.IAnswerService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AnswerService implements IAnswerService {
    private final AnswerRepository answerRepository;
    private final QuestionRepository questionRepository;
    @Override
    @Transactional
    public ResponseApi<Page<Answer>> getAllAnswersByQuestionId(int questionId, int page, int size) {
        Optional<Question> question = questionRepository.findById(questionId);
        if (question.isEmpty()) {
            return new ResponseApi<>(HttpStatus.NOT_FOUND, "Question not found", null, false);
        }

        Pageable pageable = PageRequest.of(page, size);

        // Lấy danh sách Answer thuộc về Question
        List<QuestionAnswer> questionAnswers = question.get().getQuestionAnswers().stream()
                .toList();
        List<Answer> answers = questionAnswers.stream()
                .map(QuestionAnswer::getAnswer)
                .toList();

        // Tạo một trang phân trang
        int start = Math.min((int) pageable.getOffset(), answers.size());
        int end = Math.min((start + pageable.getPageSize()), answers.size());
        Page<Answer> answerPage = new PageImpl<>(answers.subList(start, end), pageable, answers.size());

        return new ResponseApi<>(HttpStatus.OK, "Answers retrieved successfully", answerPage, true);
    }

    @Override
    @Transactional
    public ResponseApi<Answer> createAnswer(int questionId, AnswerRequest request) {
        Optional<Question> question = questionRepository.findById(questionId);
        if (question.isEmpty()) {
            return new ResponseApi<>(HttpStatus.NOT_FOUND, "Question not found", null, false);
        }

        QuestionTypeEnum questionType = question.get().getQuestionType();

        // Kiểm tra loại câu hỏi SINGLE_CHOICE
        if (questionType == QuestionTypeEnum.SINGLE_CHOICE) {
            // Kiểm tra xem có đáp án nào đã được đánh dấu là đúng chưa
            boolean hasTrueAnswer = question.get().getQuestionAnswers().stream()
                    .anyMatch(qa -> qa.getAnswer().isCorrect());
            if (hasTrueAnswer && request.isCorrect()) {
                return new ResponseApi<>(HttpStatus.BAD_REQUEST, "Only one correct answer is allowed for SINGLE_CHOICE", null, false);
            }
        }

        // Kiểm tra loại câu hỏi TRUE_FALSE
        if (questionType == QuestionTypeEnum.TRUE_FALSE) {
            // Kiểm tra xem câu hỏi đã có một đáp án đúng chưa
            long correctAnswersCount = question.get().getQuestionAnswers().stream()
                    .filter(qa -> qa.getAnswer().isCorrect()).count();

            if (correctAnswersCount >= 1 && request.isCorrect()) {
                return new ResponseApi<>(HttpStatus.BAD_REQUEST, "Only one correct answer is allowed for TRUE_FALSE", null, false);
            }
        }

        // Tạo mới đáp án
        Answer answer = new Answer();
        answer.setAnswerText(request.getAnswerText());
        answer.setCorrect(request.isCorrect());
        Answer savedAnswer = answerRepository.save(answer);

        // Thêm mối quan hệ giữa Question và Answer
        QuestionAnswer questionAnswer = new QuestionAnswer(questionId, savedAnswer.getAnswerId());
        question.get().getQuestionAnswers().add(questionAnswer);
        questionRepository.save(question.get());

        return new ResponseApi<>(HttpStatus.CREATED, "Answer created successfully", savedAnswer, true);
    }


    @Override
    @Transactional
    public ResponseApi<Answer> updateAnswer(int questionId, int answerId, AnswerRequest request) {
        // Kiểm tra xem đáp án có tồn tại không
        Optional<Answer> existingAnswer = answerRepository.findById(answerId);
        if (existingAnswer.isEmpty()) {
            return new ResponseApi<>(HttpStatus.NOT_FOUND, "Answer not found", null, false);
        }

        // Kiểm tra xem đáp án có thuộc về câu hỏi được chỉ định không
        Optional<Question> question = questionRepository.findById(questionId);
        if (question.isEmpty() || question.get().getQuestionAnswers().stream()
                .noneMatch(qa -> qa.getAnswerId() == answerId)) {
            return new ResponseApi<>(HttpStatus.BAD_REQUEST, "Answer does not belong to the specified question", null, false);
        }

        // Kiểm tra loại câu hỏi
        QuestionTypeEnum questionType = question.get().getQuestionType();

        if (questionType == QuestionTypeEnum.SINGLE_CHOICE) {
            // Đảm bảo chỉ có 1 đáp án đúng
            boolean hasOtherTrueAnswer = question.get().getQuestionAnswers().stream()
                    .filter(qa -> qa.getAnswerId() != answerId) // Loại bỏ đáp án hiện tại
                    .anyMatch(qa -> qa.getAnswer().isCorrect());
            if (hasOtherTrueAnswer && request.isCorrect()) {
                return new ResponseApi<>(HttpStatus.BAD_REQUEST, "Only one correct answer is allowed for SINGLE_CHOICE", null, false);
            }
        }

        if (questionType == QuestionTypeEnum.TRUE_FALSE) {
            // Đảm bảo chỉ có 1 đáp án đúng
            long correctAnswersCount = question.get().getQuestionAnswers().stream()
                    .filter(qa -> qa.getAnswerId() != answerId) // Loại bỏ đáp án hiện tại
                    .filter(qa -> qa.getAnswer().isCorrect()).count();
            if (correctAnswersCount >= 1 && request.isCorrect()) {
                return new ResponseApi<>(HttpStatus.BAD_REQUEST, "Only one correct answer is allowed for TRUE_FALSE", null, false);
            }
        }

        // Cập nhật đáp án
        Answer answer = existingAnswer.get();
        answer.setAnswerText(request.getAnswerText());
        answer.setCorrect(request.isCorrect());

        Answer updatedAnswer = answerRepository.save(answer);
        return new ResponseApi<>(HttpStatus.OK, "Answer updated successfully", updatedAnswer, true);
    }
    @Override
    @Transactional
    public ResponseApi<Void> deleteAnswer(int questionId, int answerId) {
        // Kiểm tra Answer có tồn tại không
        Optional<Answer> answer = answerRepository.findById(answerId);
        if (answer.isEmpty()) {
            return new ResponseApi<>(HttpStatus.NOT_FOUND, "Answer not found", null, false);
        }

        // Kiểm tra Answer có thuộc về Question không
        Optional<Question> question = questionRepository.findById(questionId);
        if (question.isEmpty() || question.get().getQuestionAnswers().stream()
                .noneMatch(qa -> qa.getAnswerId() == answerId)) {
            return new ResponseApi<>(HttpStatus.BAD_REQUEST, "Answer does not belong to specified question", null, false);
        }

        // Thực hiện xóa trong bảng `question_answer` trước
        answerRepository.deleteQuestionAnswerRelation(questionId, answerId);

        // Sau đó xóa trong bảng `answer`
        answerRepository.deleteById(answerId);

        return new ResponseApi<>(HttpStatus.OK, "Answer deleted successfully", null, true);
    }

}