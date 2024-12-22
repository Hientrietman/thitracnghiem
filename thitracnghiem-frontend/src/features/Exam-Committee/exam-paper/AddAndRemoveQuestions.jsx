import React, {useState, useEffect} from 'react';
import {Input, Form, Button, Table, Modal, message} from 'antd';
import {useDispatch, useSelector} from 'react-redux';
import {
    addQuestionsToExamPaper,
    fetchExamPaperById,
    removeQuestionsFromExamPaper
} from '../../../store/slices/examPaperSlice.js';
import {fetchQuestionById} from '../../Admin/question/questionslice.js';
import style from './AddAndRemoveQuestions.module.css';
import QuestionText from "../../../components/TextEditor/QuestionText.jsx";
import axios from "axios";
import axiosClient from "../../../api/axiosClient.js";

function AddAndRemoveQuestions() {
    const dispatch = useDispatch();
    const {examPaperDetails, isLoading, error} = useSelector((state) => state.examPapers);
    const {questionDetails, questionError} = useSelector((state) => state.questions);

    const [examPaperId, setExamPaperId] = useState("");  // Lưu ID bài thi
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [questionId, setQuestionId] = useState("");
    const [pointValue, setPointValue] = useState("");
    const [questionsToAdd, setQuestionsToAdd] = useState([]);

    const handleExamPaperIdChange = (e) => setExamPaperId(e.target.value);
    const handleQuestionIdChange = (e) => setQuestionId(e.target.value);
    const handlePointValueChange = (e) => setPointValue(e.target.value);

    const fetchExamPaper = () => {
        if (examPaperId) {
            dispatch(fetchExamPaperById(examPaperId));
        } else {
            message.warning("Vui lòng nhập Exam Paper ID!");
        }
    };

    const fetchQuestion = () => {
        if (questionId) {
            const questionIdInt = parseInt(questionId, 10);
            if (isNaN(questionIdInt)) {
                message.warning("Question ID phải là một số hợp lệ!");
                return;
            }

            // Tìm pool ID từ dữ liệu JSON
            const poolId = examPaperDetails?.examPaperQuestions?.[0]?.poolId || 17;

            console.log("Fetching question with:", {poolId, questionId: questionIdInt});
            dispatch(fetchQuestionById({poolId, questionId: questionIdInt}));
        } else {
            message.warning("Vui lòng nhập Question ID!");
        }
    };

    const handleAddQuestion = () => {
        if (questionDetails && pointValue) {
            setQuestionsToAdd([...questionsToAdd, {question: questionDetails, pointValue}]);
            setQuestionId("");
            setPointValue("");
        } else {
            message.warning("Hãy điền đủ thông tin câu hỏi và giá trị điểm!");
        }
    };
    const handleDeleteQuestion = async (questionId) => {
        try {
            const finalExamPaperId = examPaperId || examPaperDetails?.examPaperId;

            if (!finalExamPaperId) {
                message.warning("Exam Paper ID không hợp lệ!");
                return;
            }

            // Dispatch xóa câu hỏi
            await dispatch(
                removeQuestionsFromExamPaper({
                    examPaperId: finalExamPaperId,
                    questionIds: [questionId],
                })
            ).unwrap();

            // Thông báo thành công
            message.success("Câu hỏi đã được xóa!");

            // Cập nhật lại thông tin bài thi
            dispatch(fetchExamPaperById(finalExamPaperId));
        } catch (error) {
            message.error(`Lỗi khi xóa câu hỏi: ${error.message}`);
        }
    };

    const handleSubmitQuestions = async () => {
        if (questionsToAdd.length > 0) {
            try {
                const questionsData = questionsToAdd.map(item => ({
                    questionId: item.question.questionId,
                    pointValue: parseFloat(item.pointValue)
                }));

                // Kiểm tra nếu không có examPaperId từ modal, dùng từ state
                const finalExamPaperId = examPaperId || examPaperDetails?.examPaperId;

                if (!finalExamPaperId) {
                    message.warning("Exam Paper ID không hợp lệ!");
                    return;
                }

                // Dispatch thêm câu hỏi vào bài thi
                await dispatch(addQuestionsToExamPaper({
                    examPaperId: finalExamPaperId,
                    questions: questionsData
                })).unwrap();

                // Clear câu hỏi đã thêm
                setQuestionsToAdd([]);

                // Đóng modal
                setIsModalVisible(false);

                // Cập nhật lại thông tin bài thi
                dispatch(fetchExamPaperById(finalExamPaperId));

                // Thông báo thành công
                message.success("Câu hỏi đã được thêm thành công!");
            } catch (error) {
                message.error(`Lỗi khi thêm câu hỏi: ${error.message}`);
            }
        } else {
            message.warning("Danh sách câu hỏi rỗng!");
        }
    };

    const examPaperColumns = [
        {
            title: 'Thông Tin',
            dataIndex: 'key',
            key: 'key',
        },
        {
            title: 'Giá Trị',
            dataIndex: 'value',
            key: 'value',
        },
    ];

    const questionColumns = [
        {
            title: 'Question ID',
            dataIndex: ['question', 'questionId'],
            key: 'questionId',
        },
        {
            title: 'Question Text',
            dataIndex: ['question', 'questionText'],
            key: 'questionText',
            render: (text) => <QuestionText text={text}/>,
        },
        {
            title: 'Difficulty',
            dataIndex: ['question', 'difficulty'],
            key: 'difficulty',
        },
        {
            title: 'Point Value',
            dataIndex: 'pointValue',
            key: 'pointValue',
        },
        {
            title: 'Media URL',
            dataIndex: ['question', 'mediaFiles'],
            key: 'mediaFiles',
            render: (mediaFiles) => {
                if (mediaFiles && mediaFiles.length > 0) {
                    return (
                        <ul>
                            {mediaFiles.map((media, index) => (
                                <li key={index}>
                                    <a href={media.filePath} target="_blank" rel="noopener noreferrer">
                                        {media.fileName}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    );
                }
                return <span>Không có media</span>;
            },
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Button
                    type="danger"
                    onClick={() => handleDeleteQuestion(record.question.questionId)}
                >
                    Xóa
                </Button>
            ),
        },
    ];


    const examPaperData = examPaperDetails
        ? [
            {key: 'Tiêu Đề', value: examPaperDetails.title},
            {key: 'Mô Tả', value: examPaperDetails.description},
            {key: 'Thời Gian Làm Bài (phút)', value: examPaperDetails.duration},
            {key: 'Điểm Tối Đa', value: examPaperDetails.maxScore},
            {key: 'Điểm Đậu', value: examPaperDetails.passingScore},
            {key: 'Cấp Chứng Nhận', value: examPaperDetails.canAwardCertificate ? 'Có' : 'Không'},
        ]
        : [];

    return (
        <div className={style.container}>
            <div className={style.examPaperContainer}>
                <h1>Thêm và xoá câu hỏi cho bộ đề</h1>

                <Form className={style.inputContainer} layout="vertical">
                    <Form.Item name="examPaperId">
                        <Input
                            className={style.examPaperInput}
                            placeholder="Nhập Exam Paper ID"
                            value={examPaperId}
                            onChange={handleExamPaperIdChange}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" onClick={fetchExamPaper} loading={isLoading}>
                            Lấy Thông Tin Bộ Đề
                        </Button>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" onClick={() => setIsModalVisible(true)}>
                            Thêm Câu Hỏi
                        </Button>
                    </Form.Item>
                </Form>

                {examPaperDetails && (
                    <>
                        <h2>Thông Tin Bộ Đề</h2>
                        <Table
                            dataSource={examPaperData}
                            columns={examPaperColumns}
                            pagination={false}
                            rowKey={(record) => record.key}
                        />

                        <h2>Danh Sách Câu Hỏi</h2>
                        <Table
                            dataSource={examPaperDetails.examPaperQuestions}
                            columns={questionColumns}
                            rowKey={(record) => record.questionId}
                            pagination={false}
                        />
                    </>
                )}

                <Modal
                    title="Thêm Câu Hỏi"
                    width={850}
                    visible={isModalVisible}
                    onCancel={() => setIsModalVisible(false)}
                    onOk={handleSubmitQuestions}
                >
                    <Form layout="vertical">
                        <Form.Item label="Exam Paper ID">
                            <Input
                                value={examPaperId}
                                onChange={handleExamPaperIdChange}
                                placeholder="Nhập Exam Paper ID nếu cần"
                            />
                        </Form.Item>

                        <Form.Item label="Question ID">
                            <Input
                                value={questionId}
                                onChange={handleQuestionIdChange}
                                onBlur={fetchQuestion}
                                placeholder="Nhập Question ID"
                            />
                        </Form.Item>
                        <Form.Item label="Question Text">
                            {questionDetails?.questionText ? (
                                <QuestionText text={questionDetails.questionText}/>
                            ) : (
                                <span>Không tìm thấy câu hỏi</span>
                            )}
                        </Form.Item>
                        <Form.Item label="Point Value">
                            <Input
                                type="number"
                                value={pointValue}
                                onChange={handlePointValueChange}
                                placeholder="Nhập Giá Trị Điểm"
                            />
                        </Form.Item>
                        <Button type="primary" onClick={handleAddQuestion}>
                            Thêm Vào Danh Sách
                        </Button>
                    </Form>
                    <h3>Danh Sách Câu Hỏi Tạm Thời</h3>
                    <Table
                        dataSource={questionsToAdd}
                        columns={questionColumns}
                        pagination={false}
                        rowKey={(record) => record.question?.questionId}
                    />
                </Modal>
            </div>
        </div>
    );
}

export default AddAndRemoveQuestions;
