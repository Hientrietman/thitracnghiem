import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Card, Empty, Spin} from "antd";
import {getAssignedExamPapers} from "../../../store/slices/userSlice";
import ExamPaperViewer from "../ExamPaperViewer/ExamPaperViewer"; // Import ExamPaperViewer
import styles from "./AssignedExamPaper.module.css";

const AssignedExamPaper = ({page = 0, size = 10}) => {
    const dispatch = useDispatch();
    const {examPapers, isLoading, error} = useSelector((state) => state.users);
    const [selectedExamPaperId, setSelectedExamPaperId] = useState(null); // State lưu ID của exam paper được chọn

    useEffect(() => {
        dispatch(getAssignedExamPapers({page, size}));
    }, [dispatch, page, size]);

    if (selectedExamPaperId) {
        // Hiển thị ExamPaperViewer nếu có selectedExamPaperId
        return (
            <ExamPaperViewer
                examPaperId={selectedExamPaperId} // Truyền examPaperId
                onBack={() => setSelectedExamPaperId(null)} // Hàm quay lại danh sách
            />
        );
    }

    if (isLoading) {
        return (
            <div className={styles.loadingContainer}>
                <Spin size="large" tip="Loading exam papers..."/>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.errorContainer}>
                <Empty
                    description={
                        <span className={styles.errorText}>
                            Error loading exam papers: {error}
                        </span>
                    }
                />
            </div>
        );
    }

    if (!examPapers?.content?.length) {
        return (
            <div className={styles.emptyContainer}>
                <Empty description="No assigned exam papers"/>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {examPapers.content.map((exam) => (
                <Card
                    key={exam.id}
                    className={styles.card}
                    hoverable
                    onClick={() => setSelectedExamPaperId(exam.examPaperId)} // Lưu examPaperId khi click
                >
                    <div className={styles.cardContent}>
                        <h3 className={styles.subjectTitle}>{exam.subjectName}</h3>
                        <div className={styles.examDetail}>
                            <span className={styles.iconLabel}>
                                <i className="anticon anticon-clock-circle"/>
                                <strong>Time:</strong> {new Date(exam.sessionStartTime).toLocaleString()}
                            </span>
                            <span className={styles.iconLabel}>
                                <i className="anticon anticon-environment"/>
                                <strong>Location:</strong> {exam.locationName}
                            </span>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
};

export default AssignedExamPaper;
