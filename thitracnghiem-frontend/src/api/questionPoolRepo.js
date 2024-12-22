import axiosClient from "./axiosClient";

const questionPoolRepo = {
    getAll: async () => {
        const response = await axiosClient.get("/api/v1/admin/question-pools/all");
        return response.data.data;  // Lấy đối tượng `data` trong response
    },
    add: async (questionPoolData) => {
        const response = await axiosClient.post("/api/v1/admin/question-pools/create", questionPoolData);
        return response.data.data;
    },
    update: async (id, questionPoolData) => {
        const response = await axiosClient.put(`/api/v1/admin/question-pools/${id}`, questionPoolData);
        return response.data.data;
    },
    delete: async (id) => {
        await axiosClient.delete(`/api/v1/admin/question-pools/${id}`);
        return id;
    },
};

export default questionPoolRepo;
