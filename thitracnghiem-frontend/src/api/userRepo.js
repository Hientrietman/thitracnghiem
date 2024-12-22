import axiosClient from "./axiosClient.js";

const userRepo = {
    getAll: async () => {
        const response = await axiosClient.get("/api/v1/admin/users");
        return response.data.data.content; // Lấy danh sách user từ trường content
    },
    getProfile: async () => {
        const response = await axiosClient.get("/api/v1/user/profile");
        return response.data.data;
    },
    updateProfile: async (user) => {
        const response = await axiosClient.put("/api/v1/user/profile", user);
        return response.data.data;
    },
    updateRole: async (userId, roleId) => {
        const response = await axiosClient.put(`/api/v1/admin/users/${userId}/role`, {roleId});
        return response.data.data;
    },
    getAssignedExamPaper: async (page, size) => {
        try {
            const response = await axiosClient.get(`/api/v1/user/my-exams?page=${page}&size=${size}`);
            return {
                data: response.data.data,
                success: response.data.success,
                message: response.data.message,
            }
        } catch (err) {
            return {
                status: err.response?.status,
                message: err.response.message || "Không lấy được danh sách đề thi",
                success: false,

            }
        }
    }
};

export default userRepo;
