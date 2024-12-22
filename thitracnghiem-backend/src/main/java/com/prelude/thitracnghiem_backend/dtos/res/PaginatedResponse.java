package com.prelude.thitracnghiem_backend.dtos.res;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
@Data
@NoArgsConstructor
public class PaginatedResponse<T> {
    private long totalElements;
    private int totalPages;
    private int pageNumber;
    private int pageSize;
    private List<T> content;

}
