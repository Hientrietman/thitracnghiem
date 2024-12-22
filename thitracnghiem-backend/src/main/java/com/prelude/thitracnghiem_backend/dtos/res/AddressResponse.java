package com.prelude.thitracnghiem_backend.dtos.res;

import lombok.Data;

@Data
public class AddressResponse {
    private int addressId;
    private String addressLine1;
    private String addressLine2;
    private String ward;
    private String district;
    private String city;
    private int userId; // Tham chiếu đến ApplicationUser
    private String userName; // Thêm tên người dùng
    // Getters và Setters
}