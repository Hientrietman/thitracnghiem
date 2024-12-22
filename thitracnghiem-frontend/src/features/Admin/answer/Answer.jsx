import React, {useState, useEffect} from "react";
import {Table, Input, Button, Spin, Alert, Space, Modal, Form, message, Select, Pagination} from "antd";
import {SearchOutlined, EditOutlined, DeleteOutlined} from "@ant-design/icons";
import {useDispatch, useSelector} from "react-redux";
import {fetchAnswers, createAnswer, updateAnswer, removeAnswer} from "../../../store/slices/answerSlice.js"; // Import các action từ Redux slice
import styles from "./Answer.module.css";

const {Option} = Select;

function Answer() {
    const dispatch = useDispatch();
    const [currentPage, setCurrentPage] = useState(1);
    const [questionId, setQuestionId] = useState("");
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [currentAnswer, setCurrentAnswer] = useState(null);
    const pageSize = 10;

    const answers = useSelector((state) => state.answers.answers);
    const isLoading = useSelector((state) => state.answers.isLoading);
    const error = useSelector((state) => state.answers.error);
    const totalElements = useSelector((state) => state.answers.totalPages);
    const [form] = Form.useForm();

    useEffect(() => {
        if (questionId) {
            dispatch(
                fetchAnswers({
                    questionId,
                    page: currentPage - 1,
                    size: pageSize,
                })
            );
        }
    }, [dispatch, questionId, currentPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        dispatch(
            fetchAnswers({
                questionId,
                page: page - 1,
                size: pageSize,
            })
        );
    };

    const handleClick = () => {
        dispatch(
            fetchAnswers({
                questionId,
                page: currentPage - 1,
                size: pageSize,
            })
        );
    };

    const handleOpenAddModal = () => {
        setIsAddModalVisible(true);
    };

    const handleAddAnswer = async () => {
        try {
            const values = await form.validateFields();

            const payload = {
                answerText: values.answerText,
                correct: values.correct, // Changed from 'correct' to 'isCorrect'
            };

            await dispatch(createAnswer({
                questionId,
                answerData: payload
            })).unwrap();

            dispatch(fetchAnswers({
                questionId,
                page: currentPage - 1,
                size: pageSize,
            }));
            message.success("Thêm đáp án thành công!");
            setIsAddModalVisible(false);
            form.resetFields();
        } catch (err) {
            message.error(`API Error: ${err.message || "Đã xảy ra lỗi"}`);
        }
    };

    const handleDelete = (answerId) => {
        Modal.confirm({
            title: "Xoá đáp án",
            content: "Bạn có chắc chắn muốn xoá đáp án này?",
            onOk: () => {
                dispatch(removeAnswer({questionId, answerId}))
                    .unwrap()
                    .then(() => {
                        message.success("Xoá đáp án thành công!");
                        dispatch(
                            fetchAnswers({
                                questionId,
                                page: currentPage - 1,
                                size: pageSize,
                            })
                        );
                    })
                    .catch((err) => {
                        message.error(`API Error: ${err.message || "Đã xảy ra lỗi"}`);
                    });
            },
        });
    };

    const columns = [
        {title: "Mã đáp án", dataIndex: "answerId", key: "answerId"},
        {title: "Đáp án", dataIndex: "answerText", key: "answerText"},
        {
            title: "Đúng/Sai",
            dataIndex: "correct",
            key: "correct",
            render: (correct) => (correct ? "Đúng" : "Sai"),
        },
        {
            title: "Hành động",
            key: "action",
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        icon={<EditOutlined/>}
                        onClick={() => {
                            setCurrentAnswer(record);
                            setIsEditModalVisible(true);
                        }}
                        type="link"
                    >
                        Sửa
                    </Button>
                    <Button
                        icon={<DeleteOutlined/>}
                        onClick={() => handleDelete(record.answerId)}
                        type="link"
                        danger
                    >
                        Xoá
                    </Button>
                </Space>
            ),
        },
    ];
    const normalizedAnswers = (answers || []).map((answer) => ({
        answerId: answer.answerId,
        answerText: answer.answerText,
        correct: answer.correct,
    }));


    return (
        <div className={styles.container}>
            <div className={styles.textandinput}>
                <div className={styles.textandinput}>
                    <h1>Danh sách đáp án theo ID câu hỏi:</h1>
                    <Input
                        className={styles.input}
                        value={questionId}
                        onChange={(e) => setQuestionId(e.target.value)}
                    />
                    <Button onClick={handleClick}>
                        <SearchOutlined/>
                    </Button>
                </div>
            </div>
            <Button
                onClick={handleOpenAddModal}
                type="primary"
                style={{width: "fit-content", marginBottom: 16}}
            >
                Thêm đáp án
            </Button>
            {isLoading && <Spin/>}
            {error && (
                <Alert
                    message={error.message || "Đã xảy ra lỗi"}
                    description={error.details || "Vui lòng thử lại sau."}
                    type="error"
                />
            )}


            {!isLoading && !error && (
                <>
                    <Table
                        dataSource={normalizedAnswers}
                        columns={columns}
                        rowKey="answerId"
                        pagination={false}
                    />
                    <Pagination
                        current={currentPage}
                        total={totalElements}
                        pageSize={pageSize}
                        onChange={handlePageChange}
                        showSizeChanger={false}
                    />
                </>
            )}

            {/* Modal Thêm Đáp Án */}
            <Modal
                title="Thêm đáp án"
                visible={isAddModalVisible}
                onCancel={() => {
                    setIsAddModalVisible(false);
                    form.resetFields();
                }}
                onOk={handleAddAnswer}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="Đáp án"
                        name="answerText"
                        rules={[{required: true, message: "Vui lòng nhập đáp án!"}]}
                    >
                        <Input placeholder="Nhập nội dung đáp án"/>
                    </Form.Item>
                    <Form.Item
                        label="Đúng/Sai"
                        name="correct"  // This can remain the same
                        rules={[{required: true, message: "Vui lòng chọn đúng hoặc sai!"}]}
                    >
                        <Select placeholder="Đáp án này đúng hay sai?">
                            <Option value={true}>Đúng</Option>
                            <Option value={false}>Sai</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default Answer;
