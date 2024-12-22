package com.prelude.thitracnghiem_backend.dtos.req;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;
@Data
@NoArgsConstructor
public class EvaluateExamRequest {
    private Map<Integer, List<Integer>> answers;
    private int examPaperId;
    private int userId;
}
