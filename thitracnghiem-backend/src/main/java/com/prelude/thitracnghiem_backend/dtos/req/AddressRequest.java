package com.prelude.thitracnghiem_backend.dtos.req;

import lombok.Data;

@Data
public class AddressRequest {
    private String addressLine1;
    private String addressLine2;
    private String ward;
    private String district;
    private String city;
    private int userId; // Tham chiếu đến ApplicationUser
    // Getters và Setters
}