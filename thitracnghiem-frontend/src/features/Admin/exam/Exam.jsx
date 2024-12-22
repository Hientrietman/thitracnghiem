import {useEffect, useState} from "react";
import {Button, Table, Modal, Form, Input, notification, Select} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {
    fetchExams,
    createExam,
    updateExam,
    removeExam,
} from "../../../store/slices/examSlice.js";

function Exam() {
    const dispatch = useDispatch();
    const {exams, isLoading, error, totalPages, currentPage, pageSize} = useSelector(
        (state) => state.exams
    );

    const [currentModal, setCurrentModal] = useState(null);
    const [currentExam, setCurrentExam] = useState(null);
    const [loadingAction, setLoadingAction] = useState(false);
    const [form] = Form.useForm();
    const [searchText, setSearchText] = useState(""); // Trường lưu giá trị tìm kiếm

    useEffect(() => {
        dispatch(fetchExams({page: 0, size: pageSize}));
    }, [dispatch, pageSize]);

    useEffect(() => {
        if (error) {
            notification.error({message: "Lỗi", description: error});
        }
    }, [error]);

    const openModal = (type, exam = null) => {
        setCurrentModal(type);
        setCurrentExam(exam);
        if (type === "update" && exam) {
            form.setFieldsValue(exam);
        }
    };

    const closeModal = () => {
        setCurrentModal(null);
        setCurrentExam(null);
        form.resetFields();
    };

    const handleAction = async (type) => {
        setLoadingAction(true);
        try {
            const values = await form.validateFields();
            if (type === "add") {
                await dispatch(createExam(values)).unwrap();
                notification.success({message: "Thêm kỳ thi thành công"});
            } else if (type === "update") {
                await dispatch(
                    updateExam({examId: currentExam.examId, examData: values})
                ).unwrap();
                notification.success({message: "Cập nhật kỳ thi thành công"});
            }
            dispatch(fetchExams({page: currentPage, size: pageSize}));
            closeModal();
        } catch (error) {
            notification.error({message: "Thất bại", description: error.message});
        } finally {
            setLoadingAction(false);
        }
    };

    const handleDelete = async () => {
        setLoadingAction(true);
        try {
            await dispatch(removeExam(currentExam.examId)).unwrap();
            notification.success({message: "Xoá kỳ thi thành công"});
            dispatch(fetchExams({page: currentPage, size: pageSize}));
            closeModal();
        } catch (error) {
            notification.error({message: "Thất bại", description: error.message});
        } finally {
            setLoadingAction(false);
        }
    };

    const handleTableChange = (pagination) => {
        dispatch(fetchExams({
            page: pagination.current - 1,
            size: pagination.pageSize
        }));
    };

    // Hàm tìm kiếm
    const handleSearch = (e) => {
        setSearchText(e.target.value);
    };

    // Lọc dữ liệu theo searchText
    const filteredExams = exams.filter((exam) =>
        exam.examName.toLowerCase().includes(searchText.toLowerCase()) ||
        exam.description.toLowerCase().includes(searchText.toLowerCase())
    );

    const columns = [
        {title: "Mã kỳ thi", dataIndex: "examId", key: "examId"},
        {title: "Tên kỳ thi", dataIndex: "examName", key: "examName"},
        {title: "Mô tả", dataIndex: "description", key: "description"},
        {title: "Thời gian bắt đầu", dataIndex: "startDate", key: "startDate"},
        {title: "Thời gian kết thúc", dataIndex: "endDate", key: "endDate"},
        {title: "Trạng thái", dataIndex: "status", key: "status"},
        {
            title: "Hành động",
            key: "action",
            render: (_, record) => (
                <>
                    <Button onClick={() => openModal("update", record)}>Cập nhật</Button>
                    <Button
                        type="danger"
                        style={{marginLeft: 8}}
                        onClick={() => openModal("delete", record)}
                    >
                        Xoá
                    </Button>
                </>
            ),
        },
    ];

    const formattedData = filteredExams.map((exam) => ({
        key: exam.examId,
        ...exam,
    }));

    return (
        <div>
            <h1>Quản lý kỳ thi</h1>

            {/* Thêm chức năng tìm kiếm */}
            <Input
                placeholder="Tìm kiếm kỳ thi"
                style={{marginBottom: 16, width: 300}}
                onChange={handleSearch}
                value={searchText}
            />

            <Button
                type="primary"
                style={{width: "fit-content", marginBottom: 16}}
                onClick={() => openModal("add")}
            >
                Thêm kỳ thi
            </Button>

            <Table
                columns={columns}
                dataSource={formattedData}
                loading={isLoading}
                pagination={{
                    current: currentPage + 1,
                    pageSize: pageSize,
                    total: totalPages * pageSize,
                    onChange: (page, pageSize) => handleTableChange({current: page, pageSize}),
                }}
            />

            {/* Add/Update Modal */}
            <Modal
                title={currentModal === "add" ? "Thêm kỳ thi" : "Cập nhật kỳ thi"}
                visible={currentModal === "add" || currentModal === "update"}
                onCancel={closeModal}
                onOk={() => handleAction(currentModal)}
                okButtonProps={{loading: loadingAction}}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="Tên kỳ thi"
                        name="examName"
                        rules={[{required: true, message: "Vui lòng nhập tên kỳ thi!"}]}
                    >
                        <Input placeholder="Nhập tên kỳ thi"/>
                    </Form.Item>
                    <Form.Item
                        label="Mô tả"
                        name="description"
                        rules={[{required: true, message: "Vui lòng nhập mô tả!"}]}
                    >
                        <Input.TextArea placeholder="Nhập mô tả kỳ thi" rows={4}/>
                    </Form.Item>
                    <Form.Item
                        label="Thời gian bắt đầu"
                        name="startDate"
                        rules={[{required: true, message: "Vui lòng nhập thời gian bắt đầu!"}]}
                    >
                        <Input type="datetime-local"/>
                    </Form.Item>
                    <Form.Item
                        label="Thời gian kết thúc"
                        name="endDate"
                        rules={[{required: true, message: "Vui lòng nhập thời gian kết thúc!"}]}
                    >
                        <Input type="datetime-local"/>
                    </Form.Item>
                    <Form.Item
                        label="Trạng thái"
                        name="status"
                        rules={[{required: true, message: "Vui lòng chọn trạng thái!"}]}
                    >
                        <Select placeholder="Chọn trạng thái kỳ thi">
                            <Select.Option value="SCHEDULED">Đã lên lịch</Select.Option>
                            <Select.Option value="ONGOING">Đang diễn ra</Select.Option>
                            <Select.Option value="COMPLETED">Đã hoàn thành</Select.Option>
                            <Select.Option value="CANCELLED">Đã hủy</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                title="Xác nhận xoá"
                visible={currentModal === "delete"}
                onCancel={closeModal}
                onOk={handleDelete}
                okButtonProps={{
                    type: "danger",
                    loading: loadingAction,
                }}
                okText="Xoá"
                cancelText="Hủy"
            >
                Bạn có chắc chắn muốn xoá kỳ thi này?
            </Modal>
        </div>
    );
}

export default Exam;
