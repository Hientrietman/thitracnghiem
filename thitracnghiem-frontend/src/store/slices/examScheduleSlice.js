import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import examScheduleService from "../../service/examScheduleService";

export const fetchExamSchedules = createAsyncThunk(
    "examSchedules/fetchExamSchedules",
    async ({page, size}, {rejectWithValue}) => {
        try {
            return await examScheduleService.getAllExamSchedules(page, size);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const createExamSchedule = createAsyncThunk(
    "examSchedules/createExamSchedule",
    async (examScheduleData, {rejectWithValue}) => {
        try {
            return await examScheduleService.addExamSchedule(examScheduleData);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchExamScheduleById = createAsyncThunk(
    "examSchedules/fetchExamScheduleById",
    async (examScheduleData, {rejectWithValue}) => {
        try {
            return await examScheduleService.getExamScheduleById(examScheduleData);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);
export const searchExamSchedules = createAsyncThunk(
    "examSchedules/searchExamSchedules",
    async (searchParams, {rejectWithValue}) => {
        try {
            const {page = 0, size = 10, ...filters} = searchParams;
            return await examScheduleService.searchExamSchedules({
                page,
                size,
                ...filters
            });
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const removeExamSchedule = createAsyncThunk(
    "examSchedules/removeExamSchedule",
    async (examScheduleData, {rejectWithValue}) => {
        try {
            return await examScheduleService.deleteExamSchedule(examScheduleData);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);
export const fetchExamScheduleUsers = createAsyncThunk(
    "examSchedules/fetchExamScheduleUsers",
    async (examScheduleId, {rejectWithValue}) => {
        try {
            return await examScheduleService.getUsersByExamScheduleId(examScheduleId);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Fetch danh sách giám thị theo lịch thi
export const fetchExamScheduleSupervisory = createAsyncThunk(
    "examSchedules/fetchExamScheduleSupervisory",
    async (examScheduleId, {rejectWithValue}) => {
        try {
            return await examScheduleService.getSupervisoryByExamScheduleId(examScheduleId);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);
export const addParticipants = createAsyncThunk(
    "examSchedules/addParticipants",
    async ({examScheduleId, userIds}, {rejectWithValue}) => {
        try {
            return await examScheduleService.addParticipants(examScheduleId, userIds);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);
const examScheduleSlice = createSlice({
    name: "examSchedules",
    initialState: {
        examSchedules: [],
        selectedExamSchedule: null,
        totalPages: 0,
        totalElements: 0,
        currentPage: 0,
        pageSize: 10,
        examScheduleUsers: [],
        examScheduleSupervisory: [],
        isLoading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch Exam Schedules
            .addCase(fetchExamSchedules.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchExamSchedules.fulfilled, (state, action) => {
                state.isLoading = false;
                state.examSchedules = action.payload.examSchedules;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
            })
            .addCase(fetchExamSchedules.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // Create Exam Schedule

            // Thêm xử lý khi tạo Exam Schedule
            .addCase(createExamSchedule.fulfilled, (state, action) => {
                state.isLoading = false;
                state.examSchedules = [...state.examSchedules, action.payload];
                state.error = null; // Xóa lỗi nếu có
            })
            .addCase(createExamSchedule.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload; // Lưu lỗi nếu thất bại
            })

            // Fetch Exam Schedule By ID
            .addCase(fetchExamScheduleById.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.selectedExamSchedule = null;
            })
            .addCase(fetchExamScheduleById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selectedExamSchedule = action.payload;
            })
            .addCase(fetchExamScheduleById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(searchExamSchedules.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(searchExamSchedules.fulfilled, (state, action) => {
                state.isLoading = false;
                state.examSchedules = action.payload.examSchedules;
                state.totalPages = action.payload.totalPages;
                state.totalElements = action.payload.totalElements; // Add this line
                state.currentPage = action.payload.currentPage;
            })
            .addCase(searchExamSchedules.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(fetchExamScheduleUsers.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchExamScheduleUsers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.examScheduleUsers = action.payload;
            })
            .addCase(fetchExamScheduleUsers.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // Fetch exam schedule supervisory
            .addCase(fetchExamScheduleSupervisory.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchExamScheduleSupervisory.fulfilled, (state, action) => {
                state.isLoading = false;
                state.examScheduleSupervisory = action.payload;
            })
            .addCase(fetchExamScheduleSupervisory.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            //Add participants
            .addCase(addParticipants.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(addParticipants.fulfilled, (state, action) => {
                state.isLoading = false;
                // Optional: Cập nhật state nếu cần
            })
            .addCase(addParticipants.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Remove Exam Schedule
            .addCase(removeExamSchedule.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(removeExamSchedule.fulfilled, (state, action) => {
                state.isLoading = false;
                state.examSchedules = state.examSchedules.filter(
                    schedule =>
                        !(schedule.examPaperId === action.payload.examPaperId &&
                            schedule.studentUsername === action.payload.studentUsername &&
                            schedule.supervisoryUsername === action.payload.supervisoryUsername)
                );
            })
            .addCase(removeExamSchedule.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export default examScheduleSlice.reducer;