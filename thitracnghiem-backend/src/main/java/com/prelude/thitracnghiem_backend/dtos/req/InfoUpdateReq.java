package com.prelude.thitracnghiem_backend.dtos.req;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
@Data
public class InfoUpdateReq {
    @JsonProperty("userName")
    private String userName;
    private String realName;
    private String phoneNumber;
}
