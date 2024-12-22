package com.prelude.thitracnghiem_backend.controllers;

import com.prelude.thitracnghiem_backend.dtos.req.ExamScheduleAddParticipantsRequest;
import com.prelude.thitracnghiem_backend.dtos.req.ExamScheduleRequest;
import com.prelude.thitracnghiem_backend.dtos.res.ExamScheduleResponse;
import com.prelude.thitracnghiem_backend.dtos.res.ResponseApi;
import com.prelude.thitracnghiem_backend.dtos.res.UserAndRoleResponse;
import com.prelude.thitracnghiem_backend.models.ExamSchedule;
import com.prelude.thitracnghiem_backend.services.implementation.ExamScheduleService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;

@RestController
@RequestMapping("api/v1/exam-schedules")
@RequiredArgsConstructor
public class ExamScheduleController {
    private final ExamScheduleService examScheduleService;

    @PostMapping
    public ResponseEntity<ResponseApi<ExamSchedule>> addExamSchedule(@RequestBody ExamScheduleRequest request) {
        ExamSchedule examSchedule = examScheduleService.addExamSchedule(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ResponseApi<>(HttpStatus.CREATED, "Exam schedule added successfully", examSchedule, true));
    }
    @GetMapping("/{id}")
    public ResponseEntity<ResponseApi<ExamScheduleResponse>> getExamScheduleById(@PathVariable int id) {
        ResponseApi<ExamScheduleResponse> response = examScheduleService.getExamScheduleById(id);
        return ResponseEntity.ok(response);
    }
    @GetMapping
    public ResponseEntity<ResponseApi<Page<ExamScheduleResponse>>> getExamSchedules(
            @RequestParam int page, @RequestParam int size) {
        ResponseApi<Page<ExamScheduleResponse>> response = examScheduleService.getAllExamSchedules(PageRequest.of(page, size));
        return new ResponseEntity<>(response, response.getStatus());
    }

    @GetMapping("/search")
    public ResponseEntity<ResponseApi<Page<ExamScheduleResponse>>> getExamSchedulesWithFilters(
            @RequestParam(required = false) Integer examPaperId,
            @RequestParam(required = false) String examPaperTitle,
            @RequestParam(required = false) Integer subjectId,
            @RequestParam(required = false) String subjectName,
            @RequestParam(required = false) Integer sessionId,
            @RequestParam(required = false) String sessionName,
            @RequestParam(required = false) Integer locationId,
            @RequestParam(required = false) String locationName,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);

        ResponseApi<Page<ExamScheduleResponse>> response = examScheduleService.getExamSchedulesWithFilters(
                examPaperId, examPaperTitle,
                subjectId, subjectName,
                sessionId, sessionName,
                locationId, locationName, pageable);

        return new ResponseEntity<>(response, response.getStatus());
    }
    @PostMapping("/add-user")
    public ResponseEntity<ResponseApi<String>> addUserToExamSchedule(@RequestBody ExamScheduleAddParticipantsRequest request) {
        ResponseApi<String> response = examScheduleService.addUserToExamSchedule(request);
        return new ResponseEntity<>(response,response.getStatus());
    }
    @GetMapping("/{id}/users")
    public ResponseEntity<ResponseApi<Page<UserAndRoleResponse>>> getStudentsByExamScheduleId(
            @PathVariable int id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        ResponseApi<Page<UserAndRoleResponse>> response =
                examScheduleService.getStudentsByExamScheduleId(id, pageable);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}/supervisory")
    public ResponseEntity<ResponseApi<Page<UserAndRoleResponse>>> getSupervisoryByExamScheduleId(
            @PathVariable int id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        ResponseApi<Page<UserAndRoleResponse>> response =
                examScheduleService.getSupervisoryByExamScheduleId(id, pageable);

        return ResponseEntity.ok(response);
    }
}
