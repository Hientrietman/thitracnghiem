package com.prelude.thitracnghiem_backend.models;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "locations")
@Data
public class Location {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer locationId;

    private String locationName;

    private String address;
    private String capacity;

    private String description;

}
