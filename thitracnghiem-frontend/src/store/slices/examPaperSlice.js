import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import examPaperService from "../../service/examPaperService";

export const fetchExamPapers = createAsyncThunk(
    "examPapers/fetchExamPapers",
    async ({page, size}) => {
        return await examPaperService.getAllExamPapers(page, size);
    }
);
export const fetchExamPaperById = createAsyncThunk(
    "examPapers/fetchExamPaperById",
    async (examPaperId, {rejectWithValue}) => {
        try {
            return await examPaperService.getExamPaperById(examPaperId);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);
export const createExamPaper = createAsyncThunk(
    "examPapers/createExamPaper",
    async (examPaperData, {rejectWithValue}) => {
        try {
            return await examPaperService.addExamPaper(examPaperData);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateExamPaper = createAsyncThunk(
    "examPapers/updateExamPaper",
    async ({examPaperId, examPaperData}, {rejectWithValue}) => {
        try {
            return await examPaperService.updateExamPaper(examPaperId, examPaperData);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const removeExamPaper = createAsyncThunk(
    "examPapers/removeExamPaper",
    async (examPaperId, {rejectWithValue}) => {
        try {
            return await examPaperService.deleteExamPaper(examPaperId);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);
export const addQuestionsToExamPaper = createAsyncThunk(
    "examPapers/addQuestionsToExamPaper",
    async ({examPaperId, questions}, {rejectWithValue}) => {
        try {
            return await examPaperService.addQuestionsToExamPaper(examPaperId, questions);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const removeQuestionsFromExamPaper = createAsyncThunk(
    "examPapers/removeQuestionsFromExamPaper",
    async ({examPaperId, questionIds}, {rejectWithValue}) => {
        try {
            return await examPaperService.removeQuestionsFromExamPaper(examPaperId, questionIds);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const examPaperSlice = createSlice({
    name: "examPapers",
    initialState: {
        examPapers: [],
        totalPages: 0,
        currentPage: 0,
        pageSize: 10,
        isLoading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch Exam Papers
            .addCase(fetchExamPapers.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchExamPapers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.examPapers = action.payload.examPapers;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
            })
            .addCase(fetchExamPapers.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })

            // Create Exam Paper
            .addCase(createExamPaper.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createExamPaper.fulfilled, (state, action) => {
                state.isLoading = false;
                state.examPapers.push(action.payload);
            })
            .addCase(createExamPaper.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // Update Exam Paper
            .addCase(updateExamPaper.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateExamPaper.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.examPapers.findIndex(
                    (examPaper) => examPaper.examPaperId === action.payload.examPaperId
                );
                if (index !== -1) {
                    state.examPapers[index] = action.payload;
                }
            })
            .addCase(updateExamPaper.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // Remove Exam Paper
            .addCase(removeExamPaper.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(removeExamPaper.fulfilled, (state, action) => {
                state.isLoading = false;
                state.examPapers = state.examPapers.filter(
                    (examPaper) => examPaper.examPaperId !== action.meta.arg
                );
            })
            .addCase(removeExamPaper.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Add Questions to Exam Paper
            .addCase(addQuestionsToExamPaper.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(addQuestionsToExamPaper.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.examPapers.findIndex(
                    (examPaper) => examPaper.examPaperId === action.meta.arg.examPaperId
                );
                if (index !== -1) {
                    // Assuming you want to update the examPaperQuestions
                    // This might need adjustment based on your exact data structure
                    state.examPapers[index].examPaperQuestions = [
                        ...(state.examPapers[index].examPaperQuestions || []),
                        ...action.payload
                    ];
                }
            })
            .addCase(addQuestionsToExamPaper.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // Remove Questions from Exam Paper
            .addCase(removeQuestionsFromExamPaper.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(removeQuestionsFromExamPaper.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.examPapers.findIndex(
                    (examPaper) => examPaper.examPaperId === action.meta.arg.examPaperId
                );
                if (index !== -1) {
                    // Filter out removed questions
                    state.examPapers[index].examPaperQuestions =
                        state.examPapers[index].examPaperQuestions.filter(
                            question => !action.meta.arg.questionIds.includes(question.questionId)
                        );
                }
            })
            .addCase(removeQuestionsFromExamPaper.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(fetchExamPaperById.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchExamPaperById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.examPaperDetails = action.payload;  // Lưu thông tin exam paper vào state
            })
            .addCase(fetchExamPaperById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export default examPaperSlice.reducer;
