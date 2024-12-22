import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import examSubmissionService from "../../service/examSubmissionService";

export const submitExam = createAsyncThunk(
    "examSubmission/submitExam",
    async ({examPaper, user, userAnswers}, {rejectWithValue}) => {
        try {
            return await examSubmissionService.submitExam(
                examPaper,
                user,
                userAnswers
            );
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const examSubmissionSlice = createSlice({
    name: "examSubmission",
    initialState: {
        isSubmitting: false,
        success: false,
        error: null,
        results: null,
        message: null,
    },
    reducers: {
        resetExamSubmissionState: (state) => {
            state.isSubmitting = false;
            state.success = false;
            state.error = null;
            state.results = null;
            state.message = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(submitExam.pending, (state) => {
                state.isSubmitting = true;
                state.error = null;
                state.success = false;
            })
            .addCase(submitExam.fulfilled, (state, action) => {
                state.isSubmitting = false;
                state.success = action.payload.success;
                state.results = action.payload.data;
                state.message = action.payload.message;
            })
            .addCase(submitExam.rejected, (state, action) => {
                state.isSubmitting = false;
                state.error = action.payload;
                state.success = false;
            });
    },
});

export const {resetExamSubmissionState} = examSubmissionSlice.actions;
export default examSubmissionSlice.reducer;
