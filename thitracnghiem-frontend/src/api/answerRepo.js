import axiosClient from "./axiosClient";

const answerRepo = {
    getAll: async (questionId, page, size) => {
        const response = await axiosClient.get(
            `/api/v1/admin/answers/questions/${questionId}?page=${page}&size=${size}`
        );
        if (response.data.success) {
            return response.data.data;
        } else {
            throw new Error(response.data.message || "Error fetching answers");
        }
    },
    add: async (questionId, answerData) => {
        const response = await axiosClient.post(
            `/api/v1/admin/answers/questions/${questionId}`,
            answerData
        );
        if (response.data.success) {
            return response.data.data;
        } else {
            throw new Error(response.data.message || "Error adding answer");
        }
    },
    update: async (questionId, answerId, answerData) => {
        const response = await axiosClient.put(
            `/api/v1/admin/answers/questions/${questionId}/${answerId}`,
            answerData
        );
        if (response.data.success) {
            return response.data.data;
        } else {
            throw new Error(response.data.message || "Error updating answer");
        }
    },
    delete: async (questionId, answerId) => {
        const response = await axiosClient.delete(
            `/api/v1/admin/answers/questions/${questionId}/${answerId}`
        );
        if (response.data.success) {
            return answerId;
        } else {
            throw new Error(response.data.message || "Error deleting answer");
        }
    },
};

export default answerRepo;
