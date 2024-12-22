import {configureStore} from "@reduxjs/toolkit";

import questionReducer from "../features/Admin/question/questionslice"; // Sử dụng default import
import loginReducer from "../features/Admin/auth/loginSlice"; // import đúng reducer của login
import usersReducer from "./slices/userSlice.js";
import locationReducer from "./slices/locationSlice.js";
import sessionReducer from "./slices/sessionSlice.js";
import subjectsReducer from "./slices/subjectSlice.js";
import {questionPoolsReducer} from "./slices/questionPoolsSlice.js";
import examReducer from "./slices/examSlice.js";
import examPaperReducer from "./slices/examPaperSlice.js";
import answerReducer from "./slices/answerSlice.js";
import examScheduleReducer from "./slices/examScheduleSlice.js";
import examSubmissionReducer from "./slices/examSubmissionSlice.js";

const store = configureStore({
    reducer: {
        login: loginReducer, // Sử dụng reducer của loginSlice
        questionPools: questionPoolsReducer,
        questions: questionReducer, // Đảm bảo sử dụng đúng tên của reducer
        answers: answerReducer,
        users: usersReducer,
        locations: locationReducer,
        sessions: sessionReducer,
        subjects: subjectsReducer,
        exams: examReducer,
        examPapers: examPaperReducer,
        examSchedules: examScheduleReducer,
        examSubmission: examSubmissionReducer,

    },
});

export default store;
