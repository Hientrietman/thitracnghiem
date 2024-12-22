package com.prelude.thitracnghiem_backend.dtos.req;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class QuestionPoolRequest {
    private String poolName;
    private String description;
}