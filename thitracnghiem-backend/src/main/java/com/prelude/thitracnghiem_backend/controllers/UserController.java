package com.prelude.thitracnghiem_backend.controllers;

import com.prelude.thitracnghiem_backend.dtos.req.EvaluateExamRequest;
import com.prelude.thitracnghiem_backend.dtos.req.InfoUpdateReq;
import com.prelude.thitracnghiem_backend.dtos.res.ExamScheduleResponse;
import com.prelude.thitracnghiem_backend.dtos.res.ResponseApi;
import com.prelude.thitracnghiem_backend.dtos.res.UserAndRoleResponse;
import com.prelude.thitracnghiem_backend.models.ExamPaper;
import com.prelude.thitracnghiem_backend.models.ExamSubmission;
import com.prelude.thitracnghiem_backend.services.implementation.ExamPaperService;
import com.prelude.thitracnghiem_backend.services.implementation.ExamScheduleService;
import com.prelude.thitracnghiem_backend.services.implementation.ExamSubmissionService;
import com.prelude.thitracnghiem_backend.services.implementation.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final ExamSubmissionService examSubmissionService;
    private final ExamScheduleService examScheduleService;
    /**
     * API lấy hồ sơ người dùng đã xác thực.
     * @return ResponseEntity chứa ResponseApi với thông tin người dùng và vai trò, kèm theo mã trạng thái HTTP.
     * - Trả về thông tin hồ sơ của người dùng đã đăng nhập từ token JWT.
     */
    @GetMapping("/profile")
    public ResponseEntity<ResponseApi<UserAndRoleResponse>> getUserProfile() {
        // Lấy thông tin hồ sơ người dùng đã xác thực
        ResponseApi<UserAndRoleResponse> response = userService.getAuthenticatedUserProfile();
        // Trả về phản hồi với mã trạng thái tương ứng
        return new ResponseEntity<>(response, response.getStatus());
    }

    /**
     * API cập nhật hồ sơ người dùng.
     * @param req Đối tượng InfoUpdateReq chứa thông tin cần cập nhật (email, tên thật, tên người dùng, số điện thoại).
     * @return ResponseEntity chứa ResponseApi với thông tin người dùng sau khi cập nhật, kèm theo mã trạng thái HTTP.
     * - Cho phép người dùng cập nhật thông tin cá nhân của họ.
     */
    @PutMapping("/profile")
    public ResponseEntity<ResponseApi<UserAndRoleResponse>> updateUserProfile(@RequestBody InfoUpdateReq req) {
        // Cập nhật hồ sơ người dùng dựa trên thông tin trong req
        ResponseApi<UserAndRoleResponse> response = userService.updateUserProfile(req);
        // Trả về phản hồi với mã trạng thái tương ứng
        return new ResponseEntity<>(response, response.getStatus());
    }
    @PostMapping("/evaluate")
    public ResponseEntity<ResponseApi<Integer>> evaluateExam(@RequestBody EvaluateExamRequest request) {
        int totalScore = examSubmissionService.evaluateExam(
                request.getAnswers(),
                request.getExamPaperId(),
                request.getUserId()
        );

        // Trả về ResponseApi với status và dữ liệu từ service
        return ResponseEntity.ok(new ResponseApi<>(HttpStatus.OK, "Exam evaluated successfully", totalScore, true));
    }
    @GetMapping("/my-exams")
    public ResponseEntity<ResponseApi<Page<ExamScheduleResponse>>> getUserExamPapers(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        ResponseApi<Page<ExamScheduleResponse>> response =
                examScheduleService.getUserExamPapers(authentication, pageable);

        return ResponseEntity.ok(response);
    }
}

