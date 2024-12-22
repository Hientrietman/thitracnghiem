import axiosClient from "../api/axiosClient";

const subjectRepo = {
    getAll: async () => {
        const response = await axiosClient.get("/api/v1/subjects/all");
        return response.data.data;
    },
    add: async (subjectData) => {
        const response = await axiosClient.post("/api/v1/subjects/", subjectData);
        return response.data.data;
    },
    update: async (id, subjectData) => {
        const response = await axiosClient.put(`/api/v1/subjects/${id}`, subjectData);
        return response.data.data;
    },
    delete: async (id) => {
        await axiosClient.delete(`/api/v1/subjects/${id}`);
        return id;
    },
};

export default subjectRepo;
