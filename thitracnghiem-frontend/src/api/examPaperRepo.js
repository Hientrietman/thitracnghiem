import axiosClient from "./axiosClient";

const examPaperRepo = {
    getAll: async (page, size) => {
        const response = await axiosClient.get(`/api/v1/exam-papers?page=${page}&size=${size}`);
        return response.data.data;
    },
    getById: async (id) => {
        const response = await axiosClient.get(`/api/v1/exam-papers/${id}`);
        return response.data.data;
    },
    add: async (examPaperData) => {
        const response = await axiosClient.post("/api/v1/exam-papers", examPaperData);
        return response.data.data;
    },
    update: async (id, examPaperData) => {
        const response = await axiosClient.put(`/api/v1/exam-papers/${id}`, examPaperData);
        return response.data.data;
    },
    delete: async (id) => {
        await axiosClient.delete(`/api/v1/exam-papers/${id}`);
        return id;
    },
    addQuestions: async (examPaperId, questions) => {
        const payload = {
            examPaperId,
            questions,
        }
        const response = await axiosClient.post(`/api/v1/exam-papers/add-questions`, payload);
        return response.data.data;
    },
    removeQuestions: async (examPaperId, questionIds) => {
        const payload = {
            examPaperId,
            questionIds,
        };
        const response = await axiosClient.delete(`/api/v1/exam-papers/remove-questions`, {
            data: payload, // Chú ý: dùng `data` để gửi body trong DELETE request
        });
        return response.data.data;
    },

};

export default examPaperRepo;
