// QuestionPool.java
package com.prelude.thitracnghiem_backend.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@Table(name = "question_pool")
public class QuestionPool {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int questionPoolId;

    private String poolName;

    private String description;

    @OneToMany(mappedBy = "pool", fetch = FetchType.LAZY)
    @JsonIgnoreProperties({"pool"}) // Prevent infinite recursion with Question
    private Set<Question> questions = new HashSet<>();
}
