import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";

// Khai báo BASE_URL
const BASE_URL = import.meta.env.VITE_BASE_URL;

// Thunk lấy tất cả câu hỏi của poolId
export const fetchQuestionsByPoolId = createAsyncThunk(
    "questions/fetchQuestionsByPoolId",
    async ({poolId, page = 0, size = 10}, {rejectWithValue}) => {
        const token = localStorage.getItem("token");
        try {
            const response = await axios.get(
                `${BASE_URL}/api/v1/admin/question-pools/${poolId}/questions/`,
                {
                    params: {page, size},
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data.data;
        } catch (error) {
            console.error("API Error:", error.response);
            const errorMessage =
                error.response?.data?.message ||
                error.message || // thêm lỗi mặc định từ axios nếu có
                "Lỗi không xác định";
            return rejectWithValue(errorMessage);
        }
    }
);

// Thunk thêm mới câu hỏi
export const addQuestion = createAsyncThunk(
    "questions/addQuestion",
    async (question, {rejectWithValue}) => {
        const token = localStorage.getItem("token");
        const poolid = question.poolId;
        try {
            const response = await axios.post(
                `${BASE_URL}/api/v1/admin/question-pools/${poolid}/questions`,
                question,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data.data;
        } catch (error) {
            console.error("API Error:", error.response);
            const errorMessage =
                error.response?.data?.message || "Lỗi khi thêm câu hỏi";
            return rejectWithValue(errorMessage);
        }
    }
);
// Thunk lấy một câu hỏi theo ID
export const fetchQuestionById = createAsyncThunk(
    "questions/fetchQuestionById",
    async ({poolId, questionId}, {rejectWithValue}) => {
        const token = localStorage.getItem("token");
        try {
            const response = await axios.get(
                `${BASE_URL}/api/v1/admin/question-pools/${poolId}/questions/${questionId}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data.data; // Dữ liệu của câu hỏi
        } catch (error) {
            console.error("API Error:", error.response);
            const errorMessage =
                error.response?.data?.message || "Lỗi khi lấy thông tin câu hỏi";
            return rejectWithValue(errorMessage);
        }
    }
);

// Thunk xóa câu hỏi
export const deleteQuestion = createAsyncThunk(
    "questions/deleteQuestion",
    async ({poolId, questionId}, {rejectWithValue}) => {
        const token = localStorage.getItem("token");
        try {
            const response = await axios.delete(
                `${BASE_URL}/api/v1/admin/question-pools/${poolId}/questions/${questionId}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data.data;
        } catch (error) {
            console.error("API Error:", error.response);
            return rejectWithValue(
                error.response?.data?.message || "Lỗi khi xóa câu hỏi"
            );
        }
    }
);
// Action để import câu hỏi từ file Excel

// Slice quản lý câu hỏi
const questionSlice = createSlice({
    name: "questions",
    initialState: {
        isLoading: false,
        error: null,
        data: [],
        questionDetails: null, // Thêm trường này để lưu chi tiết câu hỏi
        currentPage: 0,
        totalPages: 0,
        totalElements: 0,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchQuestionsByPoolId.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(fetchQuestionsByPoolId.fulfilled, (state, action) => {
            console.log("Data returned from API:", action.payload);
            state.data = Array.isArray(action.payload?.content)
                ? action.payload.content
                : []; // Đảm bảo dữ liệu là mảng
            state.currentPage = action.payload?.pageable?.pageNumber || 0;
            state.totalPages = action.payload?.totalPages || 0;
            state.totalElements = action.payload?.totalElements || 0;
            state.error = null;
            state.isLoading = false;
        });

        builder.addCase(fetchQuestionsByPoolId.rejected, (state, action) => {
            state.error = action.payload || "Không thể lấy dữ liệu";
            state.isLoading = false;
        })
        builder.addCase(fetchQuestionById.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });

        builder.addCase(fetchQuestionById.fulfilled, (state, action) => {
            console.log("Fetched question:", action.payload);

            // Cập nhật questionDetails
            state.questionDetails = action.payload;

            // Cập nhật data như trước
            state.data = state.data.map((question) =>
                question.questionId === action.payload.questionId
                    ? action.payload
                    : question
            );

            if (!state.data.some((q) => q.questionId === action.payload.questionId)) {
                state.data.push(action.payload);
            }

            state.error = null;
            state.isLoading = false;
        });

        builder.addCase(fetchQuestionById.rejected, (state, action) => {
            state.error = action.payload || "Không thể lấy thông tin câu hỏi";
            state.questionDetails = null;
            state.isLoading = false;
        });
    },
});

export default questionSlice.reducer;
