package com.prelude.thitracnghiem_backend.exceptions;



import com.prelude.thitracnghiem_backend.dtos.res.ErrorMessage;
import com.prelude.thitracnghiem_backend.exceptions.CustomError.*;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.LocalDateTime;

@ControllerAdvice
public class GlobalErrorHandler {
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorMessage> handleException(Exception ex, HttpServletRequest request) {
        ErrorMessage errorMessage = new ErrorMessage();
        // Set status to INTERNAL_SERVER_ERROR or any other HttpStatus as needed
        errorMessage.setStatus(HttpStatus.INTERNAL_SERVER_ERROR);
        errorMessage.setMessage(ex.getMessage());
        errorMessage.setTimestamp(LocalDateTime.now());
        errorMessage.setPath(request.getRequestURI());
        // Return response with the error details
        return new ResponseEntity<>(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    @ExceptionHandler(EmailTakenException.class)
    public ResponseEntity<ErrorMessage> handleTakenEmailException(EmailTakenException ex, HttpServletRequest request) {
        // Tạo đối tượng phản hồi cho ngoại lệ
        ErrorMessage response = new ErrorMessage(
                HttpStatus.BAD_REQUEST,
                ex.getMessage(),
                LocalDateTime.now(),
                request.getRequestURI()
        );
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }
    @ExceptionHandler(InvalidEmailFormationException.class)
    public ResponseEntity<ErrorMessage> handleInvalidEmailException(InvalidEmailFormationException ex, HttpServletRequest request) {
        ErrorMessage response = new ErrorMessage(
                HttpStatus.BAD_REQUEST,
                ex.getMessage(),
                LocalDateTime.now(),
                request.getRequestURI()
        );
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(EmaiilNotFoundException.class)
    public ResponseEntity<ErrorMessage> handleEmailNotFoundException(EmaiilNotFoundException ex, HttpServletRequest request) {
        // Tạo đối tượng phản hồi cho ngoại lệ
        ErrorMessage response = new ErrorMessage(
                HttpStatus.NOT_FOUND,
                ex.getMessage(),
                LocalDateTime.now(),
                request.getRequestURI()
        );
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }
    @ExceptionHandler(InvalidVerificationCodeException.class)
    public ResponseEntity<ErrorMessage> handleInvalidEmailException(InvalidVerificationCodeException ex, HttpServletRequest request) {
        ErrorMessage response = new ErrorMessage(
                HttpStatus.BAD_REQUEST,
                ex.getMessage(),
                LocalDateTime.now(),
                request.getRequestURI()
        );
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }
    @ExceptionHandler(CodeSentAlreadyException.class)
    public ResponseEntity<ErrorMessage> handleCodeSentAlreadyException(CodeSentAlreadyException ex, HttpServletRequest request) {
        ErrorMessage response = new ErrorMessage(
                HttpStatus.BAD_REQUEST,
                ex.getMessage(),
                LocalDateTime.now(),
                request.getRequestURI()
        );
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }
    @ExceptionHandler(UserIdNotFoundException.class)
    public ResponseEntity<ErrorMessage> handleUserIdNotFoundException(UserIdNotFoundException ex, HttpServletRequest request) {
        ErrorMessage response = new ErrorMessage(
                HttpStatus.NOT_FOUND,
                ex.getMessage(),
                LocalDateTime.now(),
                request.getRequestURI()
        );
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }
    @ExceptionHandler(RoleNotFoundException.class)
    public ResponseEntity<ErrorMessage> handleRoleNotFoundException(RoleNotFoundException ex, HttpServletRequest request) {
        ErrorMessage response = new ErrorMessage(
                HttpStatus.NOT_FOUND,
                ex.getMessage(),
                LocalDateTime.now(),
                request.getRequestURI()
        );
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorMessage> handleBadCredentialsException(BadCredentialsException ex, HttpServletRequest request) {
        ErrorMessage response = new ErrorMessage(
                HttpStatus.UNAUTHORIZED,
                "Invalid email or password",
                LocalDateTime.now(),
                request.getRequestURI()
        );
        return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
    }
    @ExceptionHandler(DeletePoolNotAllowedException.class)
    public ResponseEntity<ErrorMessage> handleDeletePoolNotAllowedException(DeletePoolNotAllowedException ex, HttpServletRequest request) {
        ErrorMessage response = new ErrorMessage(
                HttpStatus.BAD_REQUEST,
                ex.getMessage(),
                LocalDateTime.now(),
                request.getRequestURI()
        );
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }
    @ExceptionHandler(QuestionUpdateNotAllowed.class)
    public ResponseEntity<ErrorMessage> handleQuestionUpdateNotAllowed(QuestionUpdateNotAllowed ex, HttpServletRequest request) {
        ErrorMessage response = new ErrorMessage(
                HttpStatus.BAD_REQUEST,
                ex.getMessage(),
                LocalDateTime.now(),
                request.getRequestURI()
        );
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }
    @ExceptionHandler(ExamPaperNotFoundException.class)
    public ResponseEntity<ErrorMessage> handleExamPaperNotFound(ExamPaperNotFoundException ex, HttpServletRequest request) {
        ErrorMessage response = new ErrorMessage(
                HttpStatus.NOT_FOUND,
                ex.getMessage(),
                LocalDateTime.now(),
                request.getRequestURI()
        );
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }
    @ExceptionHandler(ExamNotFoundException.class)
    public ResponseEntity<ErrorMessage> handleExamNotFound(ExamNotFoundException ex, HttpServletRequest request) {
        ErrorMessage response = new ErrorMessage(
                HttpStatus.NOT_FOUND,
                ex.getMessage(),
                LocalDateTime.now(),
                request.getRequestURI()
        );
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }
    @ExceptionHandler(LocationNotFoundException.class)
    public ResponseEntity<ErrorMessage> handleLocationNotFound(LocationNotFoundException ex, HttpServletRequest request) {
        ErrorMessage response = new ErrorMessage(
                HttpStatus.NOT_FOUND,
                ex.getMessage(),
                LocalDateTime.now(),
                request.getRequestURI()
        );
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(SessionNotFoundException.class)
    public ResponseEntity<ErrorMessage> handleSessionNotFound(SessionNotFoundException ex, HttpServletRequest request) {
        ErrorMessage response = new ErrorMessage(
                HttpStatus.NOT_FOUND,
                ex.getMessage(),
                LocalDateTime.now(),
                request.getRequestURI()
        );
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }
    @ExceptionHandler(ExamScheduleNotFoundException.class)
    public ResponseEntity<ErrorMessage> handleExamScheduleNotFoundException(ExamScheduleNotFoundException ex, HttpServletRequest request) {
        ErrorMessage response = new ErrorMessage(
                HttpStatus.NOT_FOUND,
                ex.getMessage(),
                LocalDateTime.now(),
                request.getRequestURI()
        );
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorMessage> handleAccessDeniedException(AccessDeniedException ex,HttpServletRequest request) {
        ErrorMessage response = new ErrorMessage(
                HttpStatus.NOT_FOUND,
                ex.getMessage(),
                LocalDateTime.now(),
                request.getRequestURI()
        );
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorMessage> handleIllegalArgumentException(IllegalArgumentException ex, HttpServletRequest request) {
        ErrorMessage response = new ErrorMessage(
                HttpStatus.BAD_REQUEST,  // Trạng thái HTTP cho lỗi yêu cầu không hợp lệ
                ex.getMessage(),         // Thông điệp lỗi từ ngoại lệ
                LocalDateTime.now(),     // Thời gian hiện tại
                request.getRequestURI()  // Đường dẫn yêu cầu
        );
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);  // Trả về ResponseEntity
    }



}

