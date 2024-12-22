package com.prelude.thitracnghiem_backend.dtos.res;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class MediaDTO {
    private String fileName;
    private String filePath;

    public MediaDTO(String fileName, String filePath) {
        this.fileName = fileName;
        this.filePath = filePath;
    }

    // Các constructor, getter và setter
}