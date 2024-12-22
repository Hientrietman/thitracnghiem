import ExamPaperModel from "../model/ExamPaperModel";
import examPaperRepo from "../api/examPaperRepo.js";

const examPaperService = {
    getAllExamPapers: async (page = 0, size = 10) => {
        const data = await examPaperRepo.getAll(page, size);
        return {
            totalPages: data.totalPages,
            currentPage: data.number, // BE trả về số trang hiện tại ở trường "number"
            examPapers: data.content.map((item) => ExamPaperModel.fromApiResponse(item)),
        };
    },
    getExamPaperById: async (id) => {
        const data = await examPaperRepo.getById(id);
        return data;
    },

    addExamPaper: async (examPaperData) => {
        const newExamPaper = await examPaperRepo.add(examPaperData);
        return ExamPaperModel.fromApiResponse(newExamPaper);
    },
    updateExamPaper: async (id, examPaperData) => {
        const updatedExamPaper = await examPaperRepo.update(id, examPaperData);
        return ExamPaperModel.fromApiResponse(updatedExamPaper);
    },
    deleteExamPaper: async (id) => {
        return await examPaperRepo.delete(id);
    },
    addQuestionsToExamPaper: async (examPaperId, questions) => {
        const data = await examPaperRepo.addQuestions(examPaperId, questions);
        return data.map(item => ({
            questionId: item.question.questionId,
            pointValue: item.pointValue
        }));
    },
    removeQuestionsFromExamPaper: async (examPaperId, questionIds) => {
        return await examPaperRepo.removeQuestions(examPaperId, questionIds);
    },
};

export default examPaperService;
