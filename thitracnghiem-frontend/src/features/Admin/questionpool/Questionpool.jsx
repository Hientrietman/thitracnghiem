import React, {useEffect, useState} from "react";
import {
    Table,
    Spin,
    Modal,
    Form,
    Input,
    Button,
    Space,
    message,
} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {
    fetchQuestionPools,
    setPagination,
    deleteQuestionPool,
    createQuestionPool,
    updateQuestionPool,
} from "../../../store/slices/questionPoolsSlice.js";
import {EyeOutlined, EditOutlined, DeleteOutlined} from "@ant-design/icons";
import styles from "./QuestionPool.module.css";

const QuestionPools = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {data, loading, error, pagination} = useSelector(
        (state) => state.questionPools
    );

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        dispatch(fetchQuestionPools(pagination));
    }, [dispatch, pagination]);

    const handleTableChange = (newPagination) => {
        dispatch(setPagination({...pagination, current: newPagination.current}));
    };

    const handleAdd = () => {
        setIsEditMode(false);
        setEditingRecord(null);
        setIsModalVisible(true);
    };

    const handleView = (record) => {
        Modal.info({
            title: "Chi tiết ngân hàng câu hỏi",
            content: (
                <div>
                    <p>ID: {record.key}</p>
                    <p>Tên: {record.poolName}</p>
                    <p>Mô tả: {record.description}</p>
                    <ul>
                        {record.questions.map((question, index) => (
                            <li key={index}>{question}</li>
                        ))}
                    </ul>
                </div>
            ),
        });
    };

    const handleEdit = (record) => {
        setIsEditMode(true);
        setEditingRecord(record);
        form.setFieldsValue({
            poolName: record.poolName,
            description: record.description,
        });
        setIsModalVisible(true);
    };

    const handleDelete = (record) => {
        Modal.confirm({
            title: "Bạn có chắc chắn muốn xóa ngân hàng câu hỏi này không?",
            content: `Tên: ${record.poolName}`,
            onOk: async () => {
                try {
                    await dispatch(deleteQuestionPool(record.key)).unwrap();
                    message.success("Ngân hàng câu hỏi đã được xóa thành công!");
                    dispatch(fetchQuestionPools(pagination));
                } catch (error) {
                    message.error(
                        error || "Lỗi khi xóa ngân hàng câu hỏi!"
                    );
                }
            },
        });
    };

    const handleSubmit = async (values) => {
        try {
            if (isEditMode) {
                await dispatch(
                    updateQuestionPool({id: editingRecord.key, ...values})
                ).unwrap();
                message.success("Ngân hàng câu hỏi đã được sửa thành công!");
            } else {
                await dispatch(createQuestionPool(values)).unwrap();
                message.success("Ngân hàng câu hỏi đã được tạo thành công!");
            }
            setIsModalVisible(false);
            form.resetFields();
            dispatch(fetchQuestionPools(pagination));
        } catch (error) {
            message.error(
                isEditMode
                    ? "Lỗi khi sửa ngân hàng câu hỏi!"
                    : "Lỗi khi tạo ngân hàng câu hỏi!"
            );
        }
    };

    const columns = [
        {title: "ID", dataIndex: "key", key: "key"},
        {title: "Tên Ngân Hàng Câu Hỏi", dataIndex: "poolName", key: "poolName"},
        {title: "Mô Tả", dataIndex: "description", key: "description"},
        {
            title: "Hành động",
            key: "action",
            render: (text, record) => (
                <Space size="middle">
                    <Button
                        type="link"
                        icon={<EyeOutlined/>}
                        onClick={() => handleView(record)}
                    >
                        Xem
                    </Button>
                    <Button
                        type="link"
                        icon={<EditOutlined/>}
                        onClick={() => handleEdit(record)}
                    >
                        Sửa
                    </Button>
                    <Button
                        type="link"
                        danger
                        icon={<DeleteOutlined/>}
                        onClick={() => handleDelete(record)}
                    >
                        Xóa
                    </Button>
                    <Button
                        type="link"
                        style={{
                            backgroundColor: "#9EDF9C",
                            color: "#000000",
                            padding: "5px 10px",
                            fontWeight: "bold",
                        }}
                        onClick={() =>
                            navigate("/admin/dashboard/questions", {
                                state: {poolId: record.key},
                            })
                        }
                    >
                        Xem chi tiết câu hỏi
                    </Button>
                </Space>
            ),
        },
    ];

    const formattedData = data.map((pool) => ({
        key: pool.questionPoolId,
        poolName: pool.poolName,
        description: pool.description,
        questions: pool.questions || [],
    }));

    return (
        <div className={styles.container}>
            <h1>Danh sách ngân hàng câu hỏi</h1>
            <Button
                type="primary"
                onClick={handleAdd}
                style={{marginBottom: 16, width: "fit-content"}}
            >
                Thêm Ngân Hàng Câu Hỏi
            </Button>
            <Table
                columns={columns}
                dataSource={formattedData}
                pagination={pagination}
                onChange={handleTableChange}
                bordered
            />
            <Modal
                title={isEditMode ? "Chỉnh Sửa Ngân Hàng Câu Hỏi" : "Thêm Ngân Hàng Câu Hỏi"}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
            >
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <Form.Item
                        name="poolName"
                        label="Tên Ngân Hàng"
                        rules={[
                            {required: true, message: "Vui lòng nhập tên ngân hàng câu hỏi"},
                        ]}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="Mô Tả"
                        rules={[
                            {required: true, message: "Vui lòng nhập mô tả"},
                        ]}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            {isEditMode ? "Lưu Thay Đổi" : "Tạo Mới"}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default QuestionPools;
