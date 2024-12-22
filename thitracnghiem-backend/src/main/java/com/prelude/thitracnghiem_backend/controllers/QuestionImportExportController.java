package com.prelude.thitracnghiem_backend.controllers;

import com.prelude.thitracnghiem_backend.models.Question;
import com.prelude.thitracnghiem_backend.services.implementation.QuestionExcelImportExportService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/questions/excels")
@RequiredArgsConstructor
public class QuestionImportExportController {
    private final QuestionExcelImportExportService importExportService;

    @PostMapping("/export")
    public ResponseEntity<Resource> exportQuestions(@RequestBody List<Integer> questionIds) {
        Resource excelFile = importExportService.exportQuestionsToExcel(questionIds);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=questions_export.xlsx")
                .body(excelFile);
    }

    @PostMapping("/import")
    public ResponseEntity<?> importQuestions(
            @RequestParam("file") MultipartFile file,
            @RequestParam("poolId") int poolId
    ) {
        try {
            List<Question> questions = importExportService.importQuestions(file, poolId);
            return ResponseEntity.ok("Imported " + questions.size() + " questions successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Failed to import questions: " + e.getMessage());
        }
    }
}