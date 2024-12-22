import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Button} from "antd";
import {useNavigate} from "react-router-dom"; // Import useNavigate
import {fetchExamPaperById} from "../../../store/slices/examPaperSlice";
import {submitExam, resetExamSubmissionState} from "../../../store/slices/examSubmissionSlice";
import QuestionText from "../../../components/TextEditor/QuestionText.jsx";
import MediaViewer from "../../../components/MediaViewer/MediaViewer.jsx";
import AnswerOption from "../../Admin/answer/AnswerOption.jsx";
import ExamResultModal from "../ExamResults/ExamResultModal.jsx";
import styles from "./ExamPaperViewer.module.css";

const ExamPaperViewer = ({examPaperId, onBack}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate(); // Khởi tạo navigate
    const [userAnswers, setUserAnswers] = useState({});
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [showResultModal, setShowResultModal] = useState(false);

    const {examPaperDetails: examPaper} = useSelector((state) => state.examPapers);
    const {user} = useSelector((state) => state.login);
    const {isSubmitting, success, error, results} = useSelector((state) => state.examSubmission);

    useEffect(() => {
        // Reset state examSubmission khi component unmount
        return () => {
            dispatch(resetExamSubmissionState());
        };
    }, [dispatch]);

    useEffect(() => {
        if (examPaperId) {
            dispatch(fetchExamPaperById(examPaperId));
        }
    }, [dispatch, examPaperId]);

    useEffect(() => {
        if (examPaper) {
            setTimeRemaining(examPaper.duration * 60);
        }
    }, [examPaper]);

    useEffect(() => {
        if (timeRemaining > 0) {
            const timer = setInterval(() => {
                setTimeRemaining((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [timeRemaining]);

    useEffect(() => {
        if (success) {
            setShowResultModal(true);
        }
    }, [success]);

    const handleAnswerSelect = (questionId, answerId) => {
        setUserAnswers((prev) => {
            const currentQuestion = prev[questionId] || [];
            const questionType = examPaper.examPaperQuestions.find(
                (q) => q.questionId === questionId
            ).question.questionType;

            if (questionType === "MULTIPLE_CHOICE") {
                const newAnswers = currentQuestion.includes(answerId)
                    ? currentQuestion.filter((a) => a !== answerId)
                    : [...currentQuestion, answerId];
                return {...prev, [questionId]: newAnswers};
            } else {
                return {...prev, [questionId]: [answerId]};
            }
        });
    };

    const handleSubmitExam = () => {
        dispatch(
            submitExam({
                examPaper,
                user,
                userAnswers,
            })
        );
    };

    const handleCloseModal = () => {
        setShowResultModal(false);
        navigate("/student/dashboard/"); // Điều hướng về trang dashboard
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
    };

    if (!examPaper) return <div className={styles.loading}>Loading exam paper...</div>;

    return (
        <div className={styles.container}>
            <Button type="link" onClick={onBack}>
                Back to Exam List
            </Button>
            <ExamResultModal
                isOpen={showResultModal}
                onClose={handleCloseModal} // Gọi hàm điều hướng khi đóng modal
                results={results}
                maxPoints={examPaper.maxScore}
                passingScore={examPaper.passingScore}
            />

            <div className={styles.header}>
                <h1 className={styles.title}>{examPaper.title}</h1>
                <div className={styles.timer}>Time Remaining: {formatTime(timeRemaining)}</div>
            </div>

            <div className={styles.questionList}>
                {examPaper.examPaperQuestions.map((examQuestion, index) => {
                    const question = examQuestion.question;

                    return (
                        <div key={question.questionId} className={styles.questionCard}>
                            <div className={styles.questionHeader}>
                                <h3 className={styles.questionTitle}>
                                    Question {index + 1}
                                    <span className={styles.pointValue}>
                                        (Point Value: {examQuestion.pointValue})
                                    </span>
                                </h3>
                                <span className={styles.difficulty}>
                                    Difficulty: {question.difficulty}/5
                                </span>
                            </div>

                            <div className={styles.questionText}>
                                <QuestionText text={question.questionText}/>
                            </div>

                            {/* Media remains static here */}
                            {question.mediaFiles && (
                                <div className={styles.mediaContainer}>
                                    {question.mediaFiles.map((media) => (
                                        <MediaViewer key={media.mediaId} mediaFile={media}/>
                                    ))}
                                </div>
                            )}

                            <div className={styles.answerList}>
                                {question.questionAnswers.map((questionAnswer) => (
                                    <AnswerOption
                                        key={questionAnswer.answerId}
                                        answer={questionAnswer}
                                        questionType={question.questionType}
                                        selectedAnswers={userAnswers[question.questionId] || []}
                                        onAnswerSelect={(answerId) =>
                                            handleAnswerSelect(question.questionId, answerId)
                                        }
                                    />
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className={styles.submitButtonContainer}>
                <Button
                    type="primary"
                    onClick={handleSubmitExam}
                    disabled={timeRemaining === 0 || isSubmitting}
                    loading={isSubmitting}
                >
                    Submit Exam
                </Button>
                {error && <div className={styles.errorMessage}>{error}</div>}
            </div>
        </div>
    );
};

export default ExamPaperViewer;
