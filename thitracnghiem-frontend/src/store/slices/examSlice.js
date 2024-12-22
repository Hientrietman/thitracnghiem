import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import examService from "../../service/examService";

export const fetchExams = createAsyncThunk(
    "exams/fetchExams",
    async ({page, size}) => {
        return await examService.getAllExams(page, size);
    }
);

export const createExam = createAsyncThunk(
    "exams/createExam",
    async (examData, {rejectWithValue}) => {
        try {
            return await examService.addExam(examData);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateExam = createAsyncThunk(
    "exams/updateExam",
    async ({examId, examData}, {rejectWithValue}) => {
        try {
            return await examService.updateExam(examId, examData);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const removeExam = createAsyncThunk(
    "exams/removeExam",
    async (examId, {rejectWithValue}) => {
        try {
            return await examService.deleteExam(examId);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const examSlice = createSlice({
    name: "exams",
    initialState: {
        exams: [],
        totalPages: 0,
        currentPage: 0,
        pageSize: 10,
        isLoading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch Exams
            .addCase(fetchExams.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchExams.fulfilled, (state, action) => {
                state.isLoading = false;
                state.exams = action.payload.exams;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
            })
            .addCase(fetchExams.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })

            // Create Exam
            .addCase(createExam.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createExam.fulfilled, (state, action) => {
                state.isLoading = false;
                state.exams.push(action.payload);
            })
            .addCase(createExam.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // Update Exam
            .addCase(updateExam.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateExam.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.exams.findIndex(exam => exam.examId === action.payload.examId);
                if (index !== -1) {
                    state.exams[index] = action.payload;
                }
            })
            .addCase(updateExam.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // Remove Exam
            .addCase(removeExam.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(removeExam.fulfilled, (state, action) => {
                state.isLoading = false;
                state.exams = state.exams.filter(exam => exam.examId !== action.meta.arg);
            })
            .addCase(removeExam.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export default examSlice.reducer;