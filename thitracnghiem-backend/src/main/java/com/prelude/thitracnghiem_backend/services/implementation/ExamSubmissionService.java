package com.prelude.thitracnghiem_backend.services.implementation;

import com.prelude.thitracnghiem_backend.models.Answer;
import com.prelude.thitracnghiem_backend.models.CompositeKeys.ExamPaperQuestionId;
import com.prelude.thitracnghiem_backend.models.ExamPaperQuestion;
import com.prelude.thitracnghiem_backend.models.ExamSubmission;
import com.prelude.thitracnghiem_backend.models.Question;
import com.prelude.thitracnghiem_backend.repositories.AnswerRepository;
import com.prelude.thitracnghiem_backend.repositories.ExamPaperQuestionRepository;
import com.prelude.thitracnghiem_backend.repositories.ExamSubmissionRepository;
import com.prelude.thitracnghiem_backend.repositories.QuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ExamSubmissionService {

    private final QuestionRepository questionRepository;
    private final ExamPaperQuestionRepository examPaperQuestionRepository;
    private final AnswerRepository answerRepository;
    private final ExamSubmissionRepository examResultRepository;

    public int evaluateExam(Map<Integer, List<Integer>> answers, int examPaperId, int userId) {
        int totalScore = 0;

        for (Map.Entry<Integer, List<Integer>> entry : answers.entrySet()) {
            int questionId = entry.getKey();
            List<Integer> selectedAnswers = entry.getValue();

            // Lấy thông tin câu hỏi
            Question question = questionRepository.findById(questionId)
                    .orElseThrow(() -> new IllegalArgumentException("Invalid questionId: " + questionId));
            String questionText = question.getQuestionText();

            // Lấy điểm của câu hỏi
            ExamPaperQuestion examPaperQuestion = examPaperQuestionRepository.findById(
                            new ExamPaperQuestionId(examPaperId, questionId))
                    .orElseThrow(() -> new IllegalArgumentException(
                            "Invalid questionId or examPaperId: questionId=" + questionId + ", examPaperId=" + examPaperId));
            int questionScore = examPaperQuestion.getPointValue();

            // Lấy đáp án đúng
            List<Answer> correctAnswers = answerRepository.findCorrectAnswersByQuestionId(questionId);
            List<Integer> correctAnswerIds = correctAnswers.stream().map(Answer::getAnswerId).toList();
            List<String> correctAnswerTexts = correctAnswers.stream().map(Answer::getAnswerText).toList();

            // Lấy text của đáp án đã chọn
            List<Answer> selectedAnswerEntities = answerRepository.findAllById(selectedAnswers);
            List<String> selectedAnswerTexts = selectedAnswerEntities.stream().map(Answer::getAnswerText).toList();

            // Kiểm tra đúng/sai
            boolean isCorrect = new HashSet<>(selectedAnswers).equals(new HashSet<>(correctAnswerIds));
            if (isCorrect) {
                totalScore += questionScore; // Cộng điểm nếu đúng hoàn toàn
            }

            // Lưu kết quả
            ExamSubmission result = new ExamSubmission();
            result.setUserId(userId);
            result.setExamPaperId(examPaperId);
            result.setQuestionId(questionId);
            result.setQuestionText(questionText);
            result.setSelectedAnswers(selectedAnswers);
            result.setSelectedAnswerTexts(selectedAnswerTexts);
            result.setCorrectAnswers(correctAnswerIds);
            result.setCorrectAnswerTexts(correctAnswerTexts);
            result.setCorrect(isCorrect);

            examResultRepository.save(result);
        }

        return totalScore;
    }
}
