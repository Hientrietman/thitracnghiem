import axiosClient from "./axiosClient";

const examrepo = {
    getAll: async (page, size) => {
        const response = await axiosClient.get(`/api/v1/exams/?page=${page}&size=${size}`);
        return response.data.data;
    },
    add: async (examData) => {
        const response = await axiosClient.post("/api/v1/exams/", examData);
        return response.data.data;
    },
    update: async (id, examData) => {
        const response = await axiosClient.put(`/api/v1/exams/${id}`, examData);
        return response.data.data;
    },
    delete: async (id) => {
        await axiosClient.delete(`/api/v1/exams/${id}`);
        return id;
    },
};

export default examrepo;
