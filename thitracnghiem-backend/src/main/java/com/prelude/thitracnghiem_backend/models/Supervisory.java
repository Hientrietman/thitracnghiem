package com.prelude.thitracnghiem_backend.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@Table(name = "supervisory")
public class Supervisory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int supervisoryId;

    private int experience;
    private String expertise;

    @ManyToOne
    @JoinColumn(name = "exam_committee_id")
    private ApplicationUser examCommittee;

    // Getters and setters
}
