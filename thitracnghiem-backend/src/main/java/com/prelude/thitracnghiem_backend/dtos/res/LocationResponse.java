package com.prelude.thitracnghiem_backend.dtos.res;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class LocationResponse {
    private Integer locationId;
    private String locationName;
    private String address;
    private String capacity;
    private String description;
}
