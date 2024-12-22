import {useState, useEffect} from "react";
import {Navigate, Route, Routes} from "react-router-dom";
import {useSelector} from "react-redux";
import Homepage from "./page/Homepage/Homepage.jsx";
import AdminDasboard from "./page/Admin/Dashboard/AdminDasboard.jsx";
import PageNotFound from "./page/Pagenotfound.jsx";
import Questionpool from "./features/Admin/questionpool/Questionpool.jsx";
import Question from "./features/Admin/question/Question.jsx";
import User from "./features/Admin/users/User.jsx";
import Location from "./features/SHARED-ADMIN-COMMITTEE/location/Location.jsx";
import Subject from "./features/SHARED-ADMIN-COMMITTEE/subject/Subject.jsx";
import Session from "./features/SHARED-ADMIN-COMMITTEE/session/Session.jsx";
import Userinfo from "./features/Admin/users/Userinfo.jsx";
import Testing from "./page/Testing.jsx";
import ExamCommitteeDashboard from "./page/ExamComittee/Dashboard/ExamCommitteeDashboard.jsx";
import Exam from "./features/Admin/exam/Exam.jsx";
import ExamPaper from "./features/Exam-Committee/exam-paper/ExamPaper.jsx";
import Answer from "./features/Admin/answer/Answer.jsx";
import AddAndRemoveQuestions from "./features/Exam-Committee/exam-paper/AddAndRemoveQuestions.jsx";
import ExamSchedule from "./features/Exam-Committee/exam-schedule/ExamSchedule.jsx";
import Student from "./page/Student/Student.jsx";
import ExamPaperViewer from "./features/User/ExamPaperViewer/ExamPaperViewer.jsx";
import AssignedExamPaper from "./features/User/AssignedExamPaper/AssignedExamPaper.jsx";

function Approutes() {
    const {isLogin, role} = useSelector((state) => state.login);

    const ProtectedRoute = ({children, allowedRoles}) => {
        if (!isLogin) {
            return <Navigate to="/" replace/>;
        }

        if (!allowedRoles.includes(role)) {
            return <Navigate to="/" replace/>;
        }

        return children;
    };

    return (
        <Routes>
            <Route path="/" element={<Homepage/>}/>
            <Route path="/testing" element={<Testing/>}/>

            <Route
                path="/committee/dashboard/"
                element={
                    <ProtectedRoute allowedRoles={["EXAM_COMMITTEE"]}>
                        <ExamCommitteeDashboard/>
                    </ProtectedRoute>
                }
            >
                <Route path="locations" element={<Location/>}/>
                <Route path="subjects" element={<Subject/>}/>
                <Route path="sessions" element={<Session/>}/>
                <Route path="exam" element={<Exam/>}/>
                <Route path="exam-paper" element={<ExamPaper/>}/>
                <Route path="questions" element={<AddAndRemoveQuestions/>}/>
                <Route path="exam-schedule" element={<ExamSchedule/>}/>
                <Route path="info" element={<Userinfo/>}/>
            </Route>

            <Route
                path="/admin/dashboard/"
                element={
                    <ProtectedRoute allowedRoles={["ADMIN"]}>
                        <AdminDasboard/>
                    </ProtectedRoute>
                }
            >
                <Route path="questionpools" element={<Questionpool/>}/>
                <Route path="questions" element={<Question/>}/>
                <Route path="answers" element={<Answer/>}/>
                <Route path="users" element={<User/>}/>
                <Route path="locations" element={<Location/>}/>
                <Route path="subjects" element={<Subject/>}/>
                <Route path="sessions" element={<Session/>}/>
                <Route path="info" element={<Userinfo/>}/>
            </Route>

            <Route
                path="/student/dashboard/"
                element={
                    <ProtectedRoute allowedRoles={["USER"]}>
                        <Student/>
                    </ProtectedRoute>
                }
            >
                <Route path="assigned-exam-paper" element={<AssignedExamPaper/>}></Route>
            </Route>

            <Route path="*" element={<PageNotFound/>}/>
        </Routes>
    );
}


export default Approutes;