import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import userService from "../../service/userService";

// Thunk lấy danh sách user
export const getUsers = createAsyncThunk("users/getUsers", async () => {
    return await userService.getAllUsers();
});

// Thunk lấy thông tin user qua token
export const getUser = createAsyncThunk("users/getUser", async () => {
    return await userService.getUserProfile();
});

// Thunk cập nhật thông tin user
export const updateUser = createAsyncThunk("users/updateUser", async (user) => {
    return await userService.updateUserProfile(user);
});
// Thunk lấy danh sách đề thi
export const getAssignedExamPapers = createAsyncThunk(
    "users/getAssignedExamPapers",
    async ({page, size}, {rejectWithValue}) => {
        try {
            const response = await userService.getAssignedExamPaper(page, size);
            if (response.success) {
                return response.data; // Trả về dữ liệu nếu thành công
            } else {
                return rejectWithValue(response.message); // Xử lý lỗi từ server
            }
        } catch (error) {
            return rejectWithValue(error.message); // Xử lý lỗi khác
        }
    }
);

// Thunk cập nhật vai trò của user
export const updateUserRole = createAsyncThunk(
    "users/updateUserRole",
    async ({userId, roleId}, {rejectWithValue}) => {
        try {
            return await userService.updateUserRole(userId, roleId);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const userSlice = createSlice({
    name: "users",
    initialState: {
        users: [], // Mảng user
        user: null, // Thông tin user hiện tại
        examPapers: [],
        isLoading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getUsers.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getUsers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.users = action.payload;
            })
            .addCase(getUsers.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })
            .addCase(getUser.fulfilled, (state, action) => {
                state.user = action.payload; // Lưu thông tin user
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.user = action.payload; // Cập nhật lại thông tin user
            })
            .addCase(updateUserRole.fulfilled, (state, action) => {
                const updatedUser = action.payload;
                const index = state.users.findIndex((u) => u.userId === updatedUser.userId);
                if (index !== -1) {
                    state.users[index] = updatedUser; // Cập nhật role user
                }
            })
            .addCase(getAssignedExamPapers.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getAssignedExamPapers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.examPapers = action.payload; // Lưu danh sách đề thi
                state.success = action.payload;

            })
            .addCase(getAssignedExamPapers.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload; // Lưu lỗi nếu có
            });
    },
});

export default userSlice.reducer;
