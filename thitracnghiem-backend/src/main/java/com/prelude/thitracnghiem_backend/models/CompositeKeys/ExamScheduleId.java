    // ExamScheduleId.java
    package com.prelude.thitracnghiem_backend.models.CompositeKeys;

    import com.prelude.thitracnghiem_backend.models.*;
    import lombok.AllArgsConstructor;
    import lombok.Builder;
    import lombok.Data;
    import lombok.NoArgsConstructor;

    import java.io.Serializable;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public class ExamScheduleId implements Serializable {
        // The property names here must match the @Id field names in ExamSchedule
        private Subject subject;
        private Session session;
        private Location location;
        private ApplicationUser student;
        private ApplicationUser supervisory;
        private ExamPaper examPaper;
    }