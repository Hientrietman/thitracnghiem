package com.prelude.thitracnghiem_backend.services.implementation;


import com.prelude.thitracnghiem_backend.dtos.req.AddQuestionsToExamPaperRequest;
import com.prelude.thitracnghiem_backend.dtos.req.ExamPaperRequest;
import com.prelude.thitracnghiem_backend.dtos.req.ExamPaperUpdateRequest;
import com.prelude.thitracnghiem_backend.dtos.req.RemoveQuestionsFromExamPaperRequest;
import com.prelude.thitracnghiem_backend.dtos.res.ResponseApi;
import com.prelude.thitracnghiem_backend.exceptions.CustomError.ExamNotFoundException;
import com.prelude.thitracnghiem_backend.exceptions.CustomError.ExamPaperNotFoundException;
import com.prelude.thitracnghiem_backend.exceptions.CustomError.QuestionNotFoundException;
import com.prelude.thitracnghiem_backend.models.*;
import com.prelude.thitracnghiem_backend.models.CompositeKeys.ExamExamPaperId;
import com.prelude.thitracnghiem_backend.models.CompositeKeys.ExamPaperQuestionId;
import com.prelude.thitracnghiem_backend.repositories.*;
import com.prelude.thitracnghiem_backend.services.interfaces.IExamPaperService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExamPaperService implements IExamPaperService {


    private final ExamPaperRepository examPaperRepository;
    private final ExamRepository examRepository;
    private final ExamExamPaperRepository examExamPaperRepository;
    private final QuestionRepository questionRepository;
    private final ExamPaperQuestionRepository examPaperQuestionRepository;

    public ResponseApi<Page<ExamPaper>> getAllExamPapers(Pageable pageable) {
        Page<ExamPaper> examPapers = examPaperRepository.findAll(pageable);
        return new ResponseApi<>(HttpStatus.OK, "Lấy danh sách Exam Papers thành công", examPapers, true);
    }
    public ResponseApi<ExamPaper> getExamPaperById(int id) {
        Optional<ExamPaper> examPaperOptional = examPaperRepository.findById(id);

        if (examPaperOptional.isEmpty()) {
            throw new ExamPaperNotFoundException("Exam paper not found with ID: " + id);
        }

        ExamPaper examPaper = examPaperOptional.get();

        List<ExamPaperQuestion> sortedQuestions = examPaperRepository
                .findExamPaperQuestionsWithAllDetailsSorted(id);

        examPaper.setExamPaperQuestions(sortedQuestions);

        return new ResponseApi<>(HttpStatus.OK, "Exam paper retrieved successfully", examPaper, true);
    }


    @Override
    public ResponseApi<ExamPaper> createExamPaper(ExamPaperRequest request) {
        // Tìm `Exam` theo ID
        Exam exam = examRepository.findById(request.getExamId())
                .orElseThrow(() -> new ExamNotFoundException("Exam not found with ID: " + request.getExamId()));

        // Tạo `ExamPaper` mới và thiết lập các thuộc tính
        ExamPaper examPaper = new ExamPaper();
        examPaper.setTitle(request.getTitle());
        examPaper.setDescription(request.getDescription());
        examPaper.setDuration(request.getDuration());
        examPaper.setMaxScore(request.getMaxScore());
        examPaper.setPassingScore(request.getPassingScore());
        examPaper.setCanAwardCertificate(request.isCanAwardCertificate());

        // Thiết lập `exam` cho `examPaper` (đảm bảo không bị lỗi not-null)

        // Lưu `ExamPaper` vào cơ sở dữ liệu
        examPaper = examPaperRepository.save(examPaper);

        // Tạo một bản ghi trong bảng trung gian để liên kết `Exam` và `ExamPaper`
        ExamExamPaper examExamPaper = new ExamExamPaper();
        examExamPaper.setExam(exam);
        examExamPaper.setExamPaper(examPaper);
        examExamPaperRepository.save(examExamPaper); // Lưu vào bảng trung gian

        return new ResponseApi<>(HttpStatus.CREATED, "Exam paper created successfully", examPaper, true);
    }
    @Override
    public ResponseApi<ExamPaper> updateExamPaper(int examPaperId, ExamPaperUpdateRequest request) {
        // Tìm ExamPaper theo ID
        ExamPaper examPaper = examPaperRepository.findById(examPaperId)
                .orElseThrow(() -> new ExamPaperNotFoundException("ExamPaper not found with ID: " + examPaperId));

        // Cập nhật các thuộc tính của ExamPaper từ request
        examPaper.setTitle(request.getTitle());
        examPaper.setDescription(request.getDescription());
        examPaper.setDuration(request.getDuration());
        examPaper.setMaxScore(request.getMaxScore());
        examPaper.setPassingScore(request.getPassingScore());
        examPaper.setCanAwardCertificate(request.isCanAwardCertificate());

        // Lưu ExamPaper đã cập nhật vào cơ sở dữ liệu
        examPaperRepository.save(examPaper);

        return new ResponseApi<>(HttpStatus.OK, "Exam paper updated successfully", examPaper, true);
    }
    @Override
    @Transactional
    public ResponseApi<List<ExamPaperQuestion>> addQuestionsToExamPaper(AddQuestionsToExamPaperRequest request) {
        // Kiểm tra tồn tại của ExamPaper
        ExamPaper examPaper = examPaperRepository.findById(request.getExamPaperId())
                .orElseThrow(() -> new ExamPaperNotFoundException("ExamPaper không tồn tại với ID: " + request.getExamPaperId()));

        List<ExamPaperQuestion> addedQuestions = request.getQuestions().stream().map(questionWithPoint -> {
            Question question = questionRepository.findById(questionWithPoint.getQuestionId())
                    .orElseThrow(() -> new QuestionNotFoundException("Question không tồn tại với ID: " + questionWithPoint.getQuestionId()));

            ExamPaperQuestion examPaperQuestion = new ExamPaperQuestion();
            examPaperQuestion.setExamPaper(examPaper);
            examPaperQuestion.setQuestion(question);
            examPaperQuestion.setPointValue(questionWithPoint.getPointValue()); // Thiết lập pointValue

            return examPaperQuestionRepository.save(examPaperQuestion);
        }).collect(Collectors.toList());

        return new ResponseApi<>(HttpStatus.OK, "Các câu hỏi đã được thêm vào ExamPaper thành công", addedQuestions, true);
    }
    @Override
    public ResponseApi<Void> deleteExamPaper(int examPaperId) {
        // Tìm ExamPaper theo ID
        ExamPaper examPaper = examPaperRepository.findById(examPaperId)
                .orElseThrow(() -> new ExamPaperNotFoundException("ExamPaper not found with ID: " + examPaperId));

        // Xóa tất cả các mối quan hệ giữa Exam và ExamPaper trong bảng ExamExamPaper
        List<ExamExamPaper> relations = examExamPaperRepository.findByExamPaperId(examPaperId);
        for (ExamExamPaper relation : relations) {
            examExamPaperRepository.delete(relation);
        }

        // Sau khi xóa các mối quan hệ, xóa ExamPaper
        examPaperRepository.delete(examPaper);

        return new ResponseApi<>(HttpStatus.OK, "Exam paper deleted successfully", null, true);
    }
    public ResponseApi<List<String>> deleteQuestionsFromExamPaper(RemoveQuestionsFromExamPaperRequest request) {
        List<String> deletedQuestions = new ArrayList<>();

        for (Integer questionId : request.getQuestionIds()) {
            ExamPaperQuestionId id = new ExamPaperQuestionId(request.getExamPaperId(), questionId);
            if (examPaperQuestionRepository.existsById(id)) {
                examPaperQuestionRepository.deleteById(id);
                deletedQuestions.add("Question ID " + questionId + " đã được xóa");
            } else {
                deletedQuestions.add("Question ID " + questionId + " không tồn tại");
            }
        }

        return new ResponseApi<>(HttpStatus.OK, "Xóa câu hỏi khỏi ExamPaper hoàn tất", deletedQuestions, true);
    }
}

