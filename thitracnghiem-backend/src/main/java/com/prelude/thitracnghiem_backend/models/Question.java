    package com.prelude.thitracnghiem_backend.models;

    import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
    import com.prelude.thitracnghiem_backend.models.EnumTypes.QuestionTypeEnum;
    import jakarta.persistence.*;
    import lombok.Getter;
    import lombok.Setter;

    import java.util.HashSet;
    import java.util.LinkedHashSet;
    import java.util.Set;

    @Entity
    @Getter
    @Setter
    @Table(name = "questions")
    public class Question {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private int questionId;

        @ManyToOne
        @JoinColumn(name = "pool_id", nullable = false)
        @JsonIgnoreProperties({"questions"}) // Prevent infinite recursion with QuestionPool
        private QuestionPool pool;

        @Column(name = "question_text", nullable = false, columnDefinition = "TEXT")
        private String questionText; // Lưu chuỗi LaTeX từ FE


        @Enumerated(EnumType.STRING)
        @Column(name = "question_type", nullable = false)
        private QuestionTypeEnum questionType;

        @Column(name = "difficulty", nullable = false)
        private int difficulty;

        @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
        @JsonIgnoreProperties({"question"})
        private Set<QuestionAnswer> questionAnswers = new LinkedHashSet<>();

        @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
        @OrderBy("mediaId ASC")
        @JsonIgnoreProperties({"question"})
        private Set<Media> mediaFiles = new LinkedHashSet<>();

    }