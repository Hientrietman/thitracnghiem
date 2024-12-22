package com.prelude.thitracnghiem_backend.dtos.res;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class QuestionPoolResponse {
    private int questionPoolId;
    private String poolName;
    private String description;
    private List<String> questions;
    // Constructor, Getters, Setter
}
