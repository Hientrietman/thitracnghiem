import axiosClient from "../api/axiosClient";

const sessionRepo = {
    getAll: async () => {
        const response = await axiosClient.get("/api/v1/sessions/all");
        return response.data.data;
    },
    add: async (sessionData) => {
        const response = await axiosClient.post("/api/v1/sessions/", sessionData);
        return response.data.data;
    },
    update: async (id, sessionData) => {
        const response = await axiosClient.put(
            `/api/v1/sessions/${id}`,
            sessionData
        );
        return response.data.data;
    },
    delete: async (id) => {
        await axiosClient.delete(`/api/v1/sessions/${id}`);
        return id;
    },
};

export default sessionRepo;
