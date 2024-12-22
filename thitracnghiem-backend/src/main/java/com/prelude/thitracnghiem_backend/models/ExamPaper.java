package com.prelude.thitracnghiem_backend.models;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
@Data
@NoArgsConstructor
@Entity
public class ExamPaper {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer examPaperId;

    private String title;
    private String description;
    private Integer duration;
    private Integer maxScore;
    private Integer passingScore;
    private Boolean canAwardCertificate;

    @OneToMany(mappedBy = "examPaper")
    private List<ExamPaperQuestion> examPaperQuestions;
    @OneToMany(mappedBy = "examPaper")
    @JsonIgnore
    private List<ExamExamPaper> examExamPaperRelations;
    @OneToMany(mappedBy = "examPaper")
    @JsonIgnore
    private List<ExamSchedule> examSchedules;
}
