package com.prelude.thitracnghiem_backend.services.implementation;

import com.prelude.thitracnghiem_backend.dtos.req.SubjectRequest; // Make sure to create this DTO
import com.prelude.thitracnghiem_backend.dtos.res.ResponseApi;
import com.prelude.thitracnghiem_backend.exceptions.CustomError.SubjectNotFoundException;
import com.prelude.thitracnghiem_backend.models.Subject;
import com.prelude.thitracnghiem_backend.repositories.SubjectRepository;
import com.prelude.thitracnghiem_backend.services.interfaces.ISubjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SubjectService implements ISubjectService {
    private final SubjectRepository subjectRepository;

    @Override
    public ResponseApi<List<Subject>> getAllSubjects() {
        List<Subject> subjects = subjectRepository.findAll();
        return new ResponseApi<>(HttpStatus.OK, "Subjects fetched successfully", subjects, true);
    }

    @Override
    public ResponseApi<Subject> getSubject(int subjectId) {
        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new SubjectNotFoundException("Subject not found", subjectId));
        return new ResponseApi<>(HttpStatus.OK, "Subject retrieved successfully", subject, true);
    }

    @Override
    public ResponseApi<Subject> createSubject(SubjectRequest request) {
        Subject subject = new Subject();
        subject.setSubjectName(request.getSubjectName());
        subject.setDescription(request.getDescription());

        Subject savedSubject = subjectRepository.save(subject);
        return new ResponseApi<>(HttpStatus.CREATED, "Subject created successfully", savedSubject, true);
    }

    @Override
    public ResponseApi<Subject> updateSubject(int subjectId, SubjectRequest request) {
        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new SubjectNotFoundException("Subject not found", subjectId));

        subject.setSubjectName(request.getSubjectName());
        subject.setDescription(request.getDescription());

        Subject updatedSubject = subjectRepository.save(subject);
        return new ResponseApi<>(HttpStatus.OK, "Subject updated successfully", updatedSubject, true);
    }

    @Override
    public ResponseApi<Void> deleteSubject(int subjectId) {
        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new SubjectNotFoundException("Subject not found", subjectId));

        subjectRepository.delete(subject);
        return new ResponseApi<>(HttpStatus.OK, "Subject deleted successfully", null, true);
    }
}
