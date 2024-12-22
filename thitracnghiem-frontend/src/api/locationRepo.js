import axiosClient from "./axiosClient";

const locationRepo = {
    getAll: async () => {
        const response = await axiosClient.get("/api/v1/locations/all");
        return response.data.data;
    },
    add: async (locationData) => {
        const response = await axiosClient.post("/api/v1/locations/", locationData);
        return response.data.data;
    },
    update: async (id, locationData) => {
        const response = await axiosClient.put(
            `/api/v1/locations/${id}`,
            locationData
        );
        return response.data.data;
    },
    delete: async (id) => {
        await axiosClient.delete(`/api/v1/locations/${id}`);
        return id;
    },
};

export default locationRepo;
