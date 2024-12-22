import AnswerModel from "../model/AnswerModel";
import answerRepo from "../api/answerRepo";

const answerService = {
    getAllAnswers: async (questionId, page = 0, size = 10) => {
        try {
            const data = await answerRepo.getAll(questionId, page, size);
            return {
                totalPages: data.totalPages,
                currentPage: data.number,
                answers: data.content.map((item) => AnswerModel.fromApiResponse(item)),
            };
        } catch (error) {
            throw {
                status: error.response?.status || 'ERROR',
                message: error.response?.data?.message || 'Đã xảy ra lỗi',
                details: error.response?.data
            };
        }
    },
    addAnswer: async (questionId, answerData) => {
        try {
            const newAnswer = await answerRepo.add(questionId, answerData);
            return AnswerModel.fromApiResponse(newAnswer);
        } catch (error) {
            throw new Error(error.message || "Failed to add answer");
        }
    },
    updateAnswer: async (questionId, answerId, answerData) => {
        try {
            const updatedAnswer = await answerRepo.update(questionId, answerId, answerData);
            return AnswerModel.fromApiResponse(updatedAnswer);
        } catch (error) {
            throw new Error(error.message || "Failed to update answer");
        }
    },
    deleteAnswer: async (questionId, answerId) => {
        try {
            return await answerRepo.delete(questionId, answerId);
        } catch (error) {
            throw new Error(error.message || "Failed to delete answer");
        }
    },
};

export default answerService;
