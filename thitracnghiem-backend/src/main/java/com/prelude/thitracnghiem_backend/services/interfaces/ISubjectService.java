package com.prelude.thitracnghiem_backend.services.interfaces;

import com.prelude.thitracnghiem_backend.dtos.req.SubjectRequest;
import com.prelude.thitracnghiem_backend.dtos.res.ResponseApi;
import com.prelude.thitracnghiem_backend.models.Subject;

import java.util.List;

public interface ISubjectService {
    ResponseApi<List<Subject>> getAllSubjects();

    ResponseApi<Subject> getSubject(int subjectId);

    ResponseApi<Subject> createSubject(SubjectRequest request);

    ResponseApi<Subject> updateSubject(int subjectId, SubjectRequest request);

    ResponseApi<Void> deleteSubject(int subjectId);
}
