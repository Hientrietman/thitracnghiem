package com.prelude.thitracnghiem_backend.services.implementation;

import com.prelude.thitracnghiem_backend.dtos.req.QuestionRequest;
import com.prelude.thitracnghiem_backend.dtos.res.ResponseApi;
import com.prelude.thitracnghiem_backend.models.EnumTypes.QuestionTypeEnum;
import com.prelude.thitracnghiem_backend.models.Question;
import com.prelude.thitracnghiem_backend.models.QuestionAnswer;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class QuestionExcelImportExportService {
    private final QuestionService questionService;
    public Resource exportQuestionsToExcel(List<Integer> questionIds) {
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Questions");

            // Create header row
            Row headerRow = sheet.createRow(0);
            String[] headers = {"Question ID", "Question Text", "Question Type", "Difficulty", "Answers"};
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
            }

            // Fetch and populate question data
            int rowNum = 1;
            for (Integer questionId : questionIds) {
                ResponseApi<Question> questionResponse = questionService.getQuestionById(questionId);
                Question question = questionResponse.getData();

                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(question.getQuestionId());
                row.createCell(1).setCellValue(question.getQuestionText());
                row.createCell(2).setCellValue(question.getQuestionType().toString());
                row.createCell(3).setCellValue(question.getDifficulty());

                // Collect answers
                StringBuilder answersText = new StringBuilder();
                for (QuestionAnswer qa : question.getQuestionAnswers()) {
                    answersText.append(qa.getAnswer().getAnswerText())
                            .append(" (")
                            .append(qa.getAnswer().isCorrect() ? "Correct" : "Incorrect")
                            .append("), ");
                }
                row.createCell(4).setCellValue(answersText.toString());
            }

            // Auto-size columns
            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            // Write to ByteArrayOutputStream
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            workbook.write(outputStream);

            // Convert to Resource
            return new ByteArrayResource(outputStream.toByteArray());
        } catch (IOException e) {
            throw new RuntimeException("Failed to export questions to Excel", e);
        }
    }

    public List<Question> importQuestions(MultipartFile file, int poolId) throws IOException {
        List<Question> importedQuestions = new ArrayList<>();

        try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);

            // Skip header row
            for (int rowNum = 1; rowNum <= sheet.getLastRowNum(); rowNum++) {
                Row row = sheet.getRow(rowNum);

                // Skip empty rows
                if (row == null) continue;

                // Prepare question request
                QuestionRequest questionRequest = new QuestionRequest();

                // Get question text
                Cell questionTextCell = row.getCell(1);
                if (questionTextCell == null || questionTextCell.getStringCellValue().isEmpty()) continue;
                questionRequest.setQuestionText(questionTextCell.getStringCellValue());

                // Get question type
                Cell questionTypeCell = row.getCell(2);
                if (questionTypeCell != null) {
                    questionRequest.setQuestionType(questionTypeCell.getStringCellValue());
                } else {
                    questionRequest.setQuestionType(QuestionTypeEnum.SINGLE_CHOICE.name());
                }

                // Get difficulty
                Cell difficultyCell = row.getCell(3);
                int difficulty = difficultyCell != null ? (int) difficultyCell.getNumericCellValue() : 1;
                questionRequest.setDifficulty(difficulty);

                // Create question
                ResponseApi<Question> response = questionService.createQuestion(poolId, questionRequest);
                importedQuestions.add(response.getData());
            }
        }

        return importedQuestions;
    }
}