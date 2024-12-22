package com.prelude.thitracnghiem_backend.dtos.res;

import com.prelude.thitracnghiem_backend.dtos.req.AnswerRequest;
import com.prelude.thitracnghiem_backend.models.EnumTypes.QuestionTypeEnum;
import com.prelude.thitracnghiem_backend.models.Question;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
public class QuestionDTO {

    private int questionId;
    private String questionText;
    private QuestionTypeEnum questionType;
    private int difficulty;
    private List<AnswerRequest> questionAnswers;
    private List<MediaDTO> mediaFiles;

    public static QuestionDTO convertToDTO(Question question) {
        QuestionDTO dto = new QuestionDTO();
        dto.setQuestionId(question.getQuestionId());
        dto.setQuestionText(question.getQuestionText());
        dto.setQuestionType(question.getQuestionType());
        dto.setDifficulty(question.getDifficulty());

        // Chuyển các câu trả lời (chỉ lấy answerText và correct)
        List<AnswerRequest> answers = question.getQuestionAnswers().stream()
                .map(answer -> new AnswerRequest(answer.getAnswer().getAnswerText(), answer.getAnswer().isCorrect()))
                .collect(Collectors.toList());
        dto.setQuestionAnswers(answers);

        // Chuyển các tệp media (chỉ lấy fileName và filePath)
        List<MediaDTO> media = question.getMediaFiles().stream()
                .map(mediaFile -> new MediaDTO(mediaFile.getFileName(), mediaFile.getFilePath()))
                .collect(Collectors.toList());
        dto.setMediaFiles(media);

        return dto;
    }
    // Các constructor, getter và setter
}