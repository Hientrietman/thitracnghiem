package com.prelude.thitracnghiem_backend.services.implementation;

import com.prelude.thitracnghiem_backend.dtos.req.ExamScheduleAddParticipantsRequest;
import com.prelude.thitracnghiem_backend.dtos.req.ExamScheduleRequest;
import com.prelude.thitracnghiem_backend.dtos.res.ExamScheduleResponse;
import com.prelude.thitracnghiem_backend.dtos.res.ResponseApi;
import com.prelude.thitracnghiem_backend.dtos.res.UserAndRoleResponse;
import com.prelude.thitracnghiem_backend.dtos.res.UserDetailDTO;
import com.prelude.thitracnghiem_backend.exceptions.CustomError.ExamScheduleNotFoundException;
import com.prelude.thitracnghiem_backend.models.*;
import com.prelude.thitracnghiem_backend.repositories.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ExamScheduleService {
    private final ExamScheduleRepository examScheduleRepository;
    private final ExamPaperRepository examPaperRepository;
    private final SubjectRepository subjectRepository;
    private final SessionRepository sessionRepository;
    private final LocationRepository locationRepository;
    private final ExamScheduleParticipantRepository examScheduleParticipantRepository;
    private final UserRepository applicationUserRepository;
    public ExamSchedule addExamSchedule(ExamScheduleRequest request) {
        ExamPaper examPaper = examPaperRepository.findById(request.getExamPaperId())
                .orElseThrow(() -> new RuntimeException("ExamPaper not found"));

        Subject subject = subjectRepository.findById(request.getSubjectId())
                .orElseThrow(() -> new RuntimeException("Subject not found"));

        Session session = sessionRepository.findById(request.getSessionId())
                .orElseThrow(() -> new RuntimeException("Session not found"));

        Location location = locationRepository.findById(request.getLocationId())
                .orElseThrow(() -> new RuntimeException("Location not found"));

        Optional<ExamSchedule> existingExamSchedule = examScheduleRepository.findByExamPaperAndSubjectAndSessionAndLocation(
                examPaper, subject, session, location
        );

        if (existingExamSchedule.isPresent()) {
            throw new RuntimeException("An exam schedule with the same details already exists");
        }

        ExamSchedule examSchedule = ExamSchedule.builder()
                .examPaper(examPaper)
                .subject(subject)
                .session(session)
                .location(location)
                .build();

        return examScheduleRepository.save(examSchedule);
    }
    public ResponseApi<ExamScheduleResponse> getExamScheduleById(int id) {
        ExamSchedule examSchedule = examScheduleRepository.findById(id)
                .orElseThrow(() -> new ExamScheduleNotFoundException("ExamSchedule not found"));

        ExamScheduleResponse response = new ExamScheduleResponse(
                examSchedule.getId(),
                examSchedule.getExamPaper().getExamPaperId(),
                examSchedule.getSubject().getSubjectName(),
                examSchedule.getSession().getStartTime(),
                examSchedule.getLocation().getLocationName()
        );

        return new ResponseApi<>(HttpStatus.OK, "Exam schedule retrieved successfully", response, true);
    }

    public ResponseApi<Page<ExamScheduleResponse>> getAllExamSchedules(Pageable pageable) {
        Page<ExamSchedule> examSchedules = examScheduleRepository.findAll(pageable);

        Page<ExamScheduleResponse> examScheduleResponses = examSchedules.map(examSchedule ->
                new ExamScheduleResponse(
                        examSchedule.getId(),
                        examSchedule.getExamPaper().getExamPaperId(),
                        examSchedule.getSubject().getSubjectName(),
                        examSchedule.getSession().getStartTime(),
                        examSchedule.getLocation().getLocationName()
                )
        );

        return new ResponseApi<>(HttpStatus.OK, "Lấy danh sách lịch thi thành công", examScheduleResponses, true);
    }
    public ResponseApi<Page<ExamScheduleResponse>> getExamSchedulesWithFilters(
            Integer examPaperId, String examPaperTitle,
            Integer subjectId, String subjectName,
            Integer sessionId, String sessionName,
            Integer locationId, String locationName, Pageable pageable) {

        Page<ExamSchedule> examSchedules = examScheduleRepository.findAllWithFilters(
                examPaperId, examPaperTitle,
                subjectId, subjectName,
                sessionId, sessionName,
                locationId, locationName, pageable);

        Page<ExamScheduleResponse> examScheduleResponses = examSchedules.map(examSchedule ->
                new ExamScheduleResponse(
                        examSchedule.getId(),
                        examSchedule.getExamPaper().getExamPaperId(),
                        examSchedule.getSubject().getSubjectName(),
                        examSchedule.getSession().getStartTime(), // Vẫn giữ startTime trong response
                        examSchedule.getLocation().getLocationName()
                )
        );

        return new ResponseApi<>(HttpStatus.OK, "Lấy danh sách lịch thi thành công", examScheduleResponses, true);
    }
    @Transactional
    public ResponseApi<Page<UserAndRoleResponse>> getStudentsByExamScheduleId(int examScheduleId, Pageable pageable) {
        // Validate exam schedule exists
        examScheduleRepository.findById(examScheduleId)
                .orElseThrow(() -> new ExamScheduleNotFoundException("ExamSchedule not found"));

        // Fetch students for the exam schedule
        Page<ExamScheduleParticipant> students = examScheduleParticipantRepository
                .findStudentsByExamScheduleId(examScheduleId, pageable);

        if (students.isEmpty()) {
            return new ResponseApi<>(
                    HttpStatus.NO_CONTENT,
                    "No students found for the given exam schedule",
                    null,
                    false
            );
        }

        // Convert to Page<UserAndRoleResponse>
        Page<UserAndRoleResponse> userAndRoleResponses = students.map(participant ->
                new UserAndRoleResponse(
                        participant.getUser(),
                        participant.getRole()
                )
        );

        return new ResponseApi<>(
                HttpStatus.OK,
                "Students retrieved successfully",
                userAndRoleResponses,
                true
        );
    }

    @Transactional
    public ResponseApi<Page<UserAndRoleResponse>> getSupervisoryByExamScheduleId(int examScheduleId, Pageable pageable) {
        // Validate exam schedule exists
        examScheduleRepository.findById(examScheduleId)
                .orElseThrow(() -> new ExamScheduleNotFoundException("ExamSchedule not found"));

        // Fetch supervisory for the exam schedule
        Page<ExamScheduleParticipant> supervisory = examScheduleParticipantRepository
                .findSupervisoryByExamScheduleId(examScheduleId, pageable);

        if (supervisory.isEmpty()) {
            return new ResponseApi<>(
                    HttpStatus.NO_CONTENT,
                    "No supervisory found for the given exam schedule",
                    null,
                    false
            );
        }

        // Convert to Page<UserAndRoleResponse>
        Page<UserAndRoleResponse> userAndRoleResponses = supervisory.map(participant ->
                new UserAndRoleResponse(
                        participant.getUser(),
                        participant.getRole()
                )
        );

        return new ResponseApi<>(
                HttpStatus.OK,
                "Supervisory retrieved successfully",
                userAndRoleResponses,
                true
        );
    }

    public ResponseApi<String> addUserToExamSchedule(ExamScheduleAddParticipantsRequest request) {
        // Lấy thông tin ExamSchedule từ ID
        ExamSchedule examSchedule = examScheduleRepository.findById(request.getExamScheduleId())
                .orElseThrow(() -> new RuntimeException("ExamSchedule not found"));
        // Lặp qua các userIds và thêm từng user vào ExamSchedule nếu hợp lệ
        for (Integer userId : request.getUserIds()) {
            ApplicationUser user = applicationUserRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User with ID " + userId + " not found"));

            // Kiểm tra vai trò của người dùng, phải là "USER" hoặc "SUPERVISORY"
            if (!hasRole(user, "USER") && !hasRole(user, "SUPERVISORY")) {
                return new ResponseApi<>(HttpStatus.BAD_REQUEST, "User with ID " + userId + " must have role 'USER' or 'SUPERVISORY'", null, false);
            }

            // Kiểm tra xem user đã được thêm vào lịch thi này chưa
            Optional<ExamScheduleParticipant> existingParticipant = examScheduleParticipantRepository.findByExamScheduleAndUser(examSchedule, user);
            if (existingParticipant.isPresent()) {
                return new ResponseApi<>(HttpStatus.BAD_REQUEST, "User " + userId + " is already added to this exam schedule", null, false);
            }

            // Tạo và lưu ExamScheduleParticipant
            ExamScheduleParticipant examScheduleParticipant = ExamScheduleParticipant.builder()
                    .examSchedule(examSchedule)
                    .user(user)
                    .role(hasRole(user, "USER") ? "USER" : "SUPERVISORY")  // Tự động xác định vai trò
                    .build();

            examScheduleParticipantRepository.save(examScheduleParticipant);
        }

        return new ResponseApi<>(HttpStatus.OK, "Users added to exam schedule successfully", "SUCCESS", true);
    }

    @Transactional
    public ResponseApi<Page<ExamScheduleResponse>> getUserExamPapers(
            Authentication authentication,
            Pageable pageable) {
        // Get the current authenticated user's email
        String userEmail = authentication.getName();

        // Find the user by email
        ApplicationUser user = applicationUserRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Fetch exam schedules where the user is a participant
        Page<ExamSchedule> userExamSchedules = examScheduleRepository
                .findExamSchedulesByParticipantUserId(user.getUserId(), pageable);

        if (userExamSchedules.isEmpty()) {
            return new ResponseApi<>(
                    HttpStatus.NO_CONTENT,
                    "No exam schedules found for the user",
                    null,
                    false
            );
        }

        // Convert to ExamScheduleResponse
        Page<ExamScheduleResponse> examScheduleResponses = userExamSchedules.map(examSchedule ->
                new ExamScheduleResponse(
                        examSchedule.getId(),
                        examSchedule.getExamPaper().getExamPaperId(),
                        examSchedule.getSubject().getSubjectName(),
                        examSchedule.getSession().getStartTime(),
                        examSchedule.getLocation().getLocationName()
                )
        );

        return new ResponseApi<>(
                HttpStatus.OK,
                "User's exam schedules retrieved successfully",
                examScheduleResponses,
                true
        );
    }
    private boolean hasRole(ApplicationUser user, String roleName) {
        // Kiểm tra vai trò trong danh sách hasRolePermissions của người dùng
        return user.getHasRolePermissions().stream()
                .anyMatch(hrp -> hrp.getRole().getRoleName().equals(roleName));
    }

}
