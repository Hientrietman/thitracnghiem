import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import subjectService from "../../service/subjectService.js";

// Tạo các action để lấy, thêm, sửa, xoá môn học
export const fetchSubjects = createAsyncThunk("subjects/fetchSubjects", async () => {
    return await subjectService.getAllSubjects();
});

export const createSubject = createAsyncThunk("subjects/createSubject", async (subjectData) => {
    return await subjectService.addSubject(subjectData);
});

export const modifySubject = createAsyncThunk("subjects/modifySubject", async ({subjectId, subjectData}) => {
    return await subjectService.updateSubject(subjectId, subjectData);
});

export const removeSubject = createAsyncThunk("subjects/removeSubject", async (subjectId) => {
    return await subjectService.deleteSubject(subjectId);
});

const subjectSlice = createSlice({
    name: "subjects",
    initialState: {
        subjects: [],
        isLoading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSubjects.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchSubjects.fulfilled, (state, action) => {
                state.isLoading = false;
                state.subjects = action.payload;
            })
            .addCase(fetchSubjects.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })
            .addCase(createSubject.fulfilled, (state, action) => {
                state.subjects.push(action.payload);
            })
            .addCase(modifySubject.fulfilled, (state, action) => {
                const index = state.subjects.findIndex((subject) => subject.subjectId === action.payload.subjectId);
                if (index !== -1) {
                    state.subjects[index] = action.payload;
                }
            })
            .addCase(removeSubject.fulfilled, (state, action) => {
                state.subjects = state.subjects.filter((subject) => subject.subjectId !== action.payload);
            });
    },
});

export default subjectSlice.reducer;
