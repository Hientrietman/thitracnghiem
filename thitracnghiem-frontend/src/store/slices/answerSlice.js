import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import answerService from "../../service/answerService";

export const fetchAnswers = createAsyncThunk(
    "answers/fetchAnswers",
    async ({questionId, page, size}, {rejectWithValue}) => {
        try {
            return await answerService.getAllAnswers(questionId, page, size);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const createAnswer = createAsyncThunk(
    "answers/createAnswer",
    async ({questionId, answerData}, {rejectWithValue}) => {
        try {
            return await answerService.addAnswer(questionId, answerData);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateAnswer = createAsyncThunk(
    "answers/updateAnswer",
    async ({questionId, answerId, answerData}, {rejectWithValue}) => {
        try {
            return await answerService.updateAnswer(questionId, answerId, answerData);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const removeAnswer = createAsyncThunk(
    "answers/removeAnswer",
    async ({questionId, answerId}, {rejectWithValue}) => {
        try {
            return await answerService.deleteAnswer(questionId, answerId);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const answerSlice = createSlice({
    name: "answers",
    initialState: {
        answers: [],
        totalPages: 0,
        currentPage: 0,
        pageSize: 10,
        isLoading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch Answers
            .addCase(fetchAnswers.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchAnswers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.answers = action.payload.answers;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
            })
            .addCase(fetchAnswers.rejected, (state, action) => {
                state.isLoading = false;
                state.error = {
                    status: action.payload?.status || 'ERROR',
                    message: action.payload?.message || 'Đã xảy ra lỗi',
                    details: action.payload
                };
            })

            // Handle other cases similarly
            .addCase(createAnswer.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createAnswer.fulfilled, (state, action) => {
                state.isLoading = false;
                state.answers.push(action.payload);
            })
            .addCase(createAnswer.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export default answerSlice.reducer;
