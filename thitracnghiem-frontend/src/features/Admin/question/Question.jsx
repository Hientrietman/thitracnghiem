import React, {useState, useEffect} from "react";
import "katex/dist/katex.min.css";
import {useLocation} from "react-router-dom";
import {
    Pagination,
    Table,
    Input,
    Button,
    Spin,
    Alert,
    Space,
    Modal,
    Form,
    message,
    Upload,
    Select,
} from "antd";
import {
    SearchOutlined,
    EditOutlined,
    DeleteOutlined,
    UploadOutlined,
} from "@ant-design/icons";
import {useDispatch, useSelector} from "react-redux";
import {
    addQuestion,
    fetchQuestionsByPoolId,
    deleteQuestion,
} from "./questionslice.js"; // Đảm bảo import đúng
import styles from "./Question.module.css";
import QuestionText from "../../../components/TextEditor/QuestionText.jsx";
import KatexFormulaEditor from "../../../components/TextEditor/KatexFormulaEditor.jsx";
import axios from "axios";

import ExportQuestionModal from "./ExportQuestionModal .jsx";
import ImportQuestionModal from "./ImportQuestionModal.jsx";

const {Option} = Select;

function Question() {
    const dispatch = useDispatch();
    const location = useLocation();
    const poolId = location.state?.poolId;

    const [questionpoolid, setQuestionpoolid] = useState(poolId || 1);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    const questions = useSelector((state) => state.questions.data);
    const isLoading = useSelector((state) => state.questions.isLoading);
    const error = useSelector((state) => state.questions.error);
    const addQuestionError = useSelector(
        (state) => state.questions.addQuestionError
    );
    const totalElements = useSelector((state) => state.questions.totalElements);

    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isImportModalVisible, setIsImportModalVisible] = useState(false);
    const [isExportModalVisible, setIsExportModalVisible] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [fileList, setFileList] = useState([]);
    const [form] = Form.useForm();

    useEffect(() => {
        if (questionpoolid) {
            dispatch(
                fetchQuestionsByPoolId({
                    poolId: questionpoolid,
                    page: currentPage - 1,
                    size: pageSize,
                })
            );
        }
    }, [dispatch, questionpoolid, currentPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        dispatch(
            fetchQuestionsByPoolId({
                poolId: questionpoolid,
                page: page - 1,
                size: pageSize,
            })
        );
    };

    const handleClick = () => {
        dispatch(
            fetchQuestionsByPoolId({
                poolId: questionpoolid,
                page: currentPage - 1,
                size: pageSize,
            })
        );
    };

    const handleFileChange = (info) => {
        let newFileList = [...info.fileList];
        newFileList = newFileList.slice(-5);
        newFileList = newFileList.map(file => {
            if (file.response) {
                file.url = file.response.url;
            }
            return file;
        });

        setFileList(newFileList);
    };
    const handleDownload = (fileName) => {
        const token = localStorage.getItem("token");

        axios.get(`http://localhost:8080/api/files/download/${fileName}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            responseType: "blob", // Chỉ định kiểu dữ liệu trả về là file nhị phân
        })
            .then((response) => {
                const fileBlob = new Blob([response.data], {type: response.headers["content-type"]});
                const downloadLink = document.createElement("a");
                downloadLink.href = URL.createObjectURL(fileBlob);
                downloadLink.download = fileName;
                downloadLink.click();
            })
            .catch((err) => {
                message.error(`Không thể tải file: ${err.message || "Đã xảy ra lỗi"}`);
            });
    };

    const handleOpenAddModal = () => {
        setIsAddModalVisible(true);
    };

    const handleAddQuestion = async () => {
        try {
            const token = localStorage.getItem("token");
            const values = await form.validateFields();

            // Chuyển đổi difficulty từ chuỗi sang int
            const difficultyMap = {
                EASY: 1,
                MEDIUM: 2,
                HARD: 3
            };

            const difficulty = difficultyMap[values.difficulty];  // ánh xạ độ khó

            // Cấu trúc payload theo yêu cầu của backend
            const payload = {
                questionText: values.questionText,
                questionType: values.questionType,
                mediaUrl: values.mediaUrl || "", // optional, nếu có
                difficulty: difficulty // sử dụng int cho difficulty
            };

            // Gửi request tới backend với payload
            const questionResponse = await dispatch(
                addQuestion({...payload, poolId: questionpoolid})
            ).unwrap();

            // Tải file nếu có
            if (fileList.length > 0) {
                const formData = new FormData();
                fileList.forEach(file => {
                    formData.append('files', file.originFileObj);
                });

                await axios.post(`http://localhost:8080/api/files/upload/${questionResponse.questionId}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`
                    }
                });
            }

            dispatch(fetchQuestionsByPoolId({poolId: questionpoolid}));
            message.success("Thêm câu hỏi thành công!");
            setIsAddModalVisible(false);
            form.resetFields();
            setFileList([]);
        } catch (err) {
            console.error("API Error:", err);
            message.error(
                `API Error: ${err || err.data?.message || "Đã xảy ra lỗi"}`
            );
        }
    };


    const handleDelete = (questionId) => {
        Modal.confirm({
            title: "Xoá câu hỏi",
            content: "Bạn có chắc chắn muốn xoá câu hỏi này?",
            onOk: () => {
                dispatch(deleteQuestion({poolId: questionpoolid, questionId}))
                    .unwrap()
                    .then(() => {
                        message.success("Xoá câu hỏi thành công!");
                        dispatch(
                            fetchQuestionsByPoolId({
                                poolId: questionpoolid,
                                page: currentPage - 1,
                                size: pageSize,
                            })
                        );
                    })
                    .catch((err) => {
                        const errorMessage =
                            err.data?.message ||
                            err.message ||
                            "Đã xảy ra lỗi khi xoá câu hỏi";
                        message.error(`API Error: ${errorMessage}`);
                    });
            },
        });
    };

    const columns = [
        {title: "Mã câu hỏi", dataIndex: "questionId", key: "questionId"},
        {
            title: "Câu hỏi",
            dataIndex: "questionText",
            key: "questionText",
            render: (text) => <QuestionText text={text}/>,
        },
        {title: "Loại câu hỏi", dataIndex: "questionType", key: "questionType"},
        {title: "Độ khó", dataIndex: "difficulty", key: "difficulty"},
        {
            title: "Tệp đính kèm",
            dataIndex: "mediaFiles",
            key: "mediaFiles",
            render: (mediaFiles) => (
                <div>
                    {mediaFiles && mediaFiles.map((media) => (
                        <div key={media.id}>
                            <Button
                                type="link"
                                onClick={() => handleDownload(media.fileName)}
                                style={{color: "blue", textDecoration: "underline"}} // Màu xanh và gạch dưới
                            >
                                {media.fileName}
                            </Button>
                        </div>
                    ))}
                </div>
            ),
        },


        {
            title: "Hành động",
            key: "action",
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        icon={<EditOutlined/>}
                        onClick={() => {
                            setCurrentQuestion(record);
                            setIsEditModalVisible(true);
                        }}
                        type="link"
                    >
                        Sửa
                    </Button>
                    <Button
                        icon={<DeleteOutlined/>}
                        onClick={() => handleDelete(record.questionId)}
                        type="link"
                        danger
                    >
                        Xoá
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div className={styles.container}>
            <div className={styles.textandinput}>
                <h1>Danh sách câu hỏi của ngân hàng số:</h1>
                <Button onClick={() => setIsImportModalVisible(true)}>
                    Import Excel
                </Button>
                <Button onClick={() => setIsExportModalVisible(true)}>
                    Export Excel
                </Button>
                <Input
                    className={styles.input}
                    value={questionpoolid}
                    onChange={(e) => setQuestionpoolid(e.target.value)}
                />
                <Button onClick={handleClick}>
                    <SearchOutlined/>
                </Button>
            </div>
            <Button
                onClick={handleOpenAddModal}
                type="primary"
                style={{width: "fit-content", marginBottom: 16}}
            >
                Thêm câu hỏi
            </Button>

            {isLoading && <Spin/>}
            {error && <Alert message="Lỗi tải danh sách câu hỏi" type="error"/>}

            {!isLoading && !error && (
                <>
                    <Table
                        dataSource={questions}
                        columns={columns}
                        rowKey="questionId"
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

            {/* Modal Thêm Câu Hỏi */}
            <Modal
                title="Thêm câu hỏi"
                visible={isAddModalVisible}
                onCancel={() => {
                    setIsAddModalVisible(false);
                    form.resetFields();
                    setFileList([]);
                }}
                onOk={handleAddQuestion}
            >
                {addQuestionError && (
                    <Alert
                        message="Có lỗi xảy ra khi thêm câu hỏi. Vui lòng thử lại."
                        type="error"
                    />
                )}
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="Câu hỏi"
                        name="questionText"
                        rules={[{required: true, message: "Vui lòng nhập câu hỏi!"}]}
                    >
                        <KatexFormulaEditor
                            placeholder="Nhập câu hỏi bạn muốn"
                            onChange={(value) => form.setFieldsValue({questionText: value})}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Loại câu hỏi"
                        name="questionType"
                        rules={[{required: true, message: "Vui lòng chọn loại câu hỏi!"}]}
                    >
                        <Select placeholder="Chọn loại câu hỏi">
                            <Option value="SINGLE_CHOICE">Trắc nghiệm 1 đáp án</Option>
                            <Option value="MULTIPLE_CHOICE">Trắc nghiệm nhiều đáp án</Option>
                            <Option value="TRUE_FALSE">Đúng/Sai</Option>
                            <Option value="GAP_FILLING">Điền từ</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Độ khó"
                        name="difficulty"
                        rules={[{required: true, message: "Vui lòng chọn độ khó!"}]}
                    >
                        <Select placeholder="Chọn độ khó">
                            <Option value="EASY">Dễ</Option>
                            <Option value="MEDIUM">Trung bình</Option>
                            <Option value="HARD">Khó</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="Tệp đính kèm" name="files">
                        <Upload
                            multiple
                            beforeUpload={() => false}
                            onChange={handleFileChange}
                            fileList={fileList}
                            maxCount={5}
                        >
                            <Button icon={<UploadOutlined/>}>
                                Chọn tệp (tối đa 5 tệp)
                            </Button>
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>
            {/* Modal Import */}
            <ImportQuestionModal
                visible={isImportModalVisible}
                onCancel={() => setIsImportModalVisible(false)}
                questionPoolId={questionpoolid}
                onImportSuccess={() => {
                    dispatch(
                        fetchQuestionsByPoolId({
                            poolId: questionpoolid,
                            page: currentPage - 1,
                            size: pageSize,
                        })
                    );
                }}
            />

            {/* Modal Export */}
            <ExportQuestionModal
                visible={isExportModalVisible}
                onCancel={() => setIsExportModalVisible(false)}
                questions={questions}
            />
        </div>
    );
}

export default Question;