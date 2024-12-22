package com.prelude.thitracnghiem_backend.services.interfaces;

import com.prelude.thitracnghiem_backend.dtos.req.ExamScheduleRequest;
import com.prelude.thitracnghiem_backend.dtos.res.ExamScheduleResponse;
import com.prelude.thitracnghiem_backend.dtos.res.ResponseApi;

public interface IExamScheduleService {
    ResponseApi<ExamScheduleResponse> createExamSchedule(ExamScheduleRequest request);

    ResponseApi<ExamScheduleResponse> getExamScheduleById(int id);

    ResponseApi<ExamScheduleResponse> updateExamSchedule(int id, ExamScheduleRequest request);

    ResponseApi<Void> deleteExamSchedule(int id);
}
