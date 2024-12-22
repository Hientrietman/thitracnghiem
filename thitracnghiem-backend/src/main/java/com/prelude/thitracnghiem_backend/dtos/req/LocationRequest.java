package com.prelude.thitracnghiem_backend.dtos.req;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class LocationRequest {
    private String locationName;
    private String address;
    private String capacity;
    private String description;
}
