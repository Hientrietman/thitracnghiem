package com.prelude.thitracnghiem_backend.repositories;

import com.prelude.thitracnghiem_backend.models.ApplicationUser;
import com.prelude.thitracnghiem_backend.models.ExamSchedule;
import com.prelude.thitracnghiem_backend.models.ExamScheduleParticipant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ExamScheduleParticipantRepository extends JpaRepository<ExamScheduleParticipant, Integer> {
    Optional<ExamScheduleParticipant> findByExamScheduleAndUser(ExamSchedule examSchedule, ApplicationUser user);

    @Query("SELECT esp FROM ExamScheduleParticipant esp " +
            "JOIN FETCH esp.user " +
            "WHERE esp.examSchedule.id = :examScheduleId AND esp.role = 'USER'")
    Page<ExamScheduleParticipant> findStudentsByExamScheduleId(
            @Param("examScheduleId") int examScheduleId,
            Pageable pageable
    );

    @Query("SELECT esp FROM ExamScheduleParticipant esp " +
            "JOIN FETCH esp.user " +
            "WHERE esp.examSchedule.id = :examScheduleId AND esp.role = 'SUPERVISORY'")
    Page<ExamScheduleParticipant> findSupervisoryByExamScheduleId(
            @Param("examScheduleId") int examScheduleId,
            Pageable pageable
    );
}