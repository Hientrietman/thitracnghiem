import UserModel from "../model/UserModel";
import userRepo from "../api/userRepo";

const userService = {
    getAllUsers: async () => {
        const data = await userRepo.getAll(); // Gọi API lấy danh sách user
        return data.map((item) => UserModel.fromApiResponse(item)); // Chuyển đổi từng user
    },
    getUserProfile: async () => {
        const data = await userRepo.getProfile();
        return UserModel.fromApiResponse(data);
    },
    updateUserProfile: async (user) => {
        const data = await userRepo.updateProfile(user);
        return UserModel.fromApiResponse(data);
    },
    updateUserRole: async (userId, roleId) => {
        const data = await userRepo.updateRole(userId, roleId);
        return UserModel.fromApiResponse(data);
    },
    getAssignedExamPaper: async (page, size) => {
     
        return await userRepo.getAssignedExamPaper(page, size);
    },

};

export default userService;
