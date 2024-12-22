package com.prelude.thitracnghiem_backend.repositories;

import com.prelude.thitracnghiem_backend.models.*;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.util.Optional;

@Repository
public interface ExamScheduleRepository extends JpaRepository<ExamSchedule, Integer> {
    Page<ExamSchedule> findAll(Pageable pageable);

    Optional<ExamSchedule> findByExamPaperAndSubjectAndSessionAndLocation(
            ExamPaper examPaper,
            Subject subject,
            Session session,
            Location location
    );

    @Query("SELECT es FROM ExamSchedule es " +
            "JOIN FETCH es.examPaper ep " +
            "JOIN FETCH es.subject s " +
            "JOIN FETCH es.session ss " +
            "JOIN FETCH es.location l " +
            "WHERE (:examPaperId IS NULL OR es.examPaper.examPaperId = :examPaperId) " +
            "AND (:examPaperTitle IS NULL OR ep.title LIKE %:examPaperTitle%) " +
            "AND (:subjectId IS NULL OR s.subjectId = :subjectId) " +
            "AND (:subjectName IS NULL OR s.subjectName LIKE %:subjectName%) " +
            "AND (:sessionId IS NULL OR ss.sessionId = :sessionId) " +
            "AND (:sessionName IS NULL OR ss.sessionName LIKE %:sessionName%) " +
            "AND (:locationId IS NULL OR l.locationId = :locationId) " +
            "AND (:locationName IS NULL OR l.locationName LIKE %:locationName%)")
    Page<ExamSchedule> findAllWithFilters(
            @Param("examPaperId") Integer examPaperId,
            @Param("examPaperTitle") String examPaperTitle,
            @Param("subjectId") Integer subjectId,
            @Param("subjectName") String subjectName,
            @Param("sessionId") Integer sessionId,
            @Param("sessionName") String sessionName,
            @Param("locationId") Integer locationId,
            @Param("locationName") String locationName,
            Pageable pageable);

    @Query("SELECT es FROM ExamSchedule es " +
            "JOIN ExamScheduleParticipant esp ON esp.examSchedule.id = es.id " +
            "WHERE esp.user.userId = :userId")
    Page<ExamSchedule> findExamSchedulesByParticipantUserId(@Param("userId") int userId, Pageable pageable);
}