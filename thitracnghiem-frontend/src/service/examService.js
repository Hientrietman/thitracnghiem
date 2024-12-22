import ExamModel from "../model/ExamModel";
import examrepo from "../api/examrepo.js";

const examService = {
    getAllExams: async (page = 0, size = 10) => {
        const data = await examrepo.getAll(page, size);
        return {
            totalPages: data.totalPages,
            exams: data.content.map((item) => ExamModel.fromApiResponse(item)),
        };
    },
    addExam: async (examData) => {
        const newExam = await examrepo.add(examData);
        return ExamModel.fromApiResponse(newExam);
    },
    updateExam: async (id, examData) => {
        const updatedExam = await examrepo.update(id, examData);
        return ExamModel.fromApiResponse(updatedExam);
    },
    deleteExam: async (id) => {
        return await examrepo.delete(id);
    },
};

export default examService;
