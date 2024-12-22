import QuestionPoolModel from "../model/QuestionPoolModel";
import questionPoolRepo from "../api/questionPoolRepo";

const questionPoolService = {
    getAllQuestionPools: async () => {
        // Gọi repo để lấy dữ liệu từ API
        const data = await questionPoolRepo.getAll();
        // Trả về mảng questionPools đã được map thành model
        return data.content.map((item) => QuestionPoolModel.fromApiResponse(item));
    },
    addQuestionPool: async (questionPoolData) => {
        const newQuestionPool = await questionPoolRepo.add(questionPoolData);
        return QuestionPoolModel.fromApiResponse(newQuestionPool);
    },
    updateQuestionPool: async (id, questionPoolData) => {
        const updatedQuestionPool = await questionPoolRepo.update(id, questionPoolData);
        return QuestionPoolModel.fromApiResponse(updatedQuestionPool);
    },
    deleteQuestionPool: async (id) => {
        return await questionPoolRepo.delete(id);
    },
};

export default questionPoolService;
