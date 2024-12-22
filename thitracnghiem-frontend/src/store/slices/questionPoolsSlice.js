import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

// Thunk để gọi API lấy question pools
export const fetchQuestionPools = createAsyncThunk(
    "questionPools/fetchQuestionPools",
    async (pagination, {rejectWithValue}) => {
        const token = localStorage.getItem("token");
        const {current, pageSize} = pagination;

        try {
            const response = await axios.get(
                `${BASE_URL}/api/v1/admin/question-pools/all`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    params: {
                        page: current - 1,
                        size: pageSize,
                    },
                }
            );
            return response.data.data; // Dữ liệu trả về chứa content, totalElements
        } catch (error) {
            const errorMessage =
                error.response?.data?.message || error.message || "Lỗi khi lấy dữ liệu";
            return rejectWithValue(errorMessage);
        }
    }
);

// Thunk để xóa question pool
export const deleteQuestionPool = createAsyncThunk(
    "questionPools/deleteQuestionPool",
    async (id, {rejectWithValue}) => {
        const token = localStorage.getItem("token");

        try {
            const response = await axios.delete(
                `${BASE_URL}/api/v1/admin/question-pools/${id}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            // Kiểm tra response status
            if (response.status !== 200) {
                throw new Error("Lỗi khi xóa ngân hàng câu hỏi");
            }
            return id;
        } catch (error) {
            const errorMessage =
                error.response?.data?.message ||
                error.message ||
                "Lỗi khi xóa ngân hàng câu hỏi";
            return rejectWithValue(errorMessage);
        }
    }
);

// Thunk để tạo mới question pool
export const createQuestionPool = createAsyncThunk(
    "questionPools/createQuestionPool",
    async (data, {rejectWithValue}) => {
        const token = localStorage.getItem("token");

        try {
            const response = await axios.post(
                `${BASE_URL}/api/v1/admin/question-pools/create`,
                {
                    poolName: data.poolName,
                    description: data.description,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.data.success) {
                return response.data.data; // Trả về thông tin của question pool mới
            } else {
                return rejectWithValue("Lỗi khi tạo ngân hàng câu hỏi");
            }
        } catch (error) {
            const errorMessage =
                error.response?.data?.message ||
                error.message ||
                "Lỗi khi tạo ngân hàng câu hỏi";
            return rejectWithValue(errorMessage);
        }
    }
);

// Thunk để cập nhật question pool
export const updateQuestionPool = createAsyncThunk(
    "questionPools/updateQuestionPool",
    async (updatedPool, {rejectWithValue}) => {
        const token = localStorage.getItem("token");
        const {id, poolName, description} = updatedPool;

        try {
            const response = await axios.put(
                `${BASE_URL}/api/v1/admin/question-pools/${id}`,
                {
                    poolName,
                    description,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data.data; // Trả về dữ liệu sửa đổi
        } catch (error) {
            const errorMessage =
                error.response?.data?.message ||
                error.message ||
                "Lỗi khi sửa ngân hàng câu hỏi";
            return rejectWithValue(errorMessage);
        }
    }
);

// Slice quản lý câu hỏi pools
const questionPoolsSlice = createSlice({
    name: "questionPools",
    initialState: {
        data: [],
        loading: false,
        error: null,
        pagination: {
            current: 1,
            pageSize: 10,
            total: 0,
        },
    },
    reducers: {
        setPagination: (state, action) => {
            state.pagination = {...state.pagination, ...action.payload};
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchQuestionPools.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchQuestionPools.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload?.content || [];
                state.pagination.total = action.payload?.totalElements || 0;
            })
            .addCase(fetchQuestionPools.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteQuestionPool.fulfilled, (state, action) => {
                state.data = state.data.filter(
                    (pool) => pool.questionPoolId !== action.payload
                );
                state.pagination.total -= 1;
            })
            .addCase(deleteQuestionPool.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(createQuestionPool.fulfilled, (state, action) => {
                state.data.push(action.payload);
                state.pagination.total += 1;
            })
            .addCase(createQuestionPool.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(updateQuestionPool.fulfilled, (state, action) => {
                const updatedPool = action.payload;
                const index = state.data.findIndex(
                    (pool) => pool.questionPoolId === updatedPool.questionPoolId
                );
                if (index !== -1) {
                    state.data[index] = updatedPool;
                }
            })
            .addCase(updateQuestionPool.rejected, (state, action) => {
                state.error = action.payload;
            });
    },
});

export const {setPagination} = questionPoolsSlice.actions;
export const questionPoolsReducer = questionPoolsSlice.reducer;

