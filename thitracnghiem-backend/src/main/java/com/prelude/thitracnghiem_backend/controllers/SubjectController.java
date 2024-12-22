package com.prelude.thitracnghiem_backend.controllers;

import com.prelude.thitracnghiem_backend.dtos.req.SubjectRequest; // Make sure to create this DTO
import com.prelude.thitracnghiem_backend.dtos.res.ResponseApi;
import com.prelude.thitracnghiem_backend.models.Subject;
import com.prelude.thitracnghiem_backend.services.implementation.SubjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/subjects")
@RequiredArgsConstructor
public class SubjectController {
    private final SubjectService subjectService;

    @GetMapping("/all")
    public ResponseEntity<ResponseApi<List<Subject>>> getSubjects() {
        ResponseApi<List<Subject>> response = subjectService.getAllSubjects();
        return new ResponseEntity<>(response, response.getStatus());
    }

    @GetMapping("/{subjectId}")
    public ResponseEntity<ResponseApi<Subject>> getSubject(@PathVariable int subjectId) {
        ResponseApi<Subject> response = subjectService.getSubject(subjectId);
        return new ResponseEntity<>(response, response.getStatus());
    }

    @PostMapping("/")
    public ResponseEntity<ResponseApi<Subject>> createSubject(@RequestBody SubjectRequest request) {
        ResponseApi<Subject> response = subjectService.createSubject(request);
        return new ResponseEntity<>(response, response.getStatus());
    }

    @PutMapping("/{subjectId}")
    public ResponseEntity<ResponseApi<Subject>> updateSubject(
            @PathVariable int subjectId,
            @RequestBody SubjectRequest request) {
        ResponseApi<Subject> response = subjectService.updateSubject(subjectId, request);
        return new ResponseEntity<>(response, response.getStatus());
    }

    @DeleteMapping("/{subjectId}")
    public ResponseEntity<ResponseApi<Void>> deleteSubject(@PathVariable int subjectId) {
        ResponseApi<Void> response = subjectService.deleteSubject(subjectId);
        return new ResponseEntity<>(response, response.getStatus());
    }
}
