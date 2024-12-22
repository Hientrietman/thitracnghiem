package com.prelude.thitracnghiem_backend.dtos.req;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnswerRequest {
    private String answerText;

    @JsonProperty("correct") // Đảm bảo rằng Jackson biết ánh xạ đúng từ JSON
    private boolean correct;


}
