import {useEffect, useState} from "react";
import {Button, Table, Modal, Form, Input, notification, Checkbox} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {
    fetchExamPapers,
    createExamPaper,
    updateExamPaper,
    removeExamPaper,
} from "../../../store/slices/examPaperSlice.js";
import {Outlet} from "react-router-dom";

function ExamPaper() {
    const dispatch = useDispatch();
    const {examPapers, isLoading, error, totalPages, currentPage, pageSize} = useSelector(
        (state) => state.examPapers
    );

    const [currentModal, setCurrentModal] = useState(null);
    const [currentExamPaper, setCurrentExamPaper] = useState(null);
    const [loadingAction, setLoadingAction] = useState(false);
    const [form] = Form.useForm();
    const [searchText, setSearchText] = useState("");

    useEffect(() => {
        dispatch(fetchExamPapers({page: 0, size: pageSize}));
    }, [dispatch, pageSize]);

    useEffect(() => {
        if (error) {
            notification.error({message: "Lỗi", description: error});
        }
    }, [error]);

    const openModal = (type, examPaper = null) => {
        setCurrentModal(type);
        setCurrentExamPaper(examPaper);
        if (type === "update" && examPaper) {
            form.setFieldsValue(examPaper);
        }
    };

    const closeModal = () => {
        setCurrentModal(null);
        setCurrentExamPaper(null);
        form.resetFields();
    };

    const handleAction = async (type) => {
        setLoadingAction(true);
        try {
            const values = await form.validateFields();
            if (type === "add") {
                await dispatch(createExamPaper(values)).unwrap();
                notification.success({message: "Thêm đề thi thành công"});
            } else if (type === "update") {
                await dispatch(
                    updateExamPaper({
                        examPaperId: currentExamPaper.examPaperId,
                        examPaperData: {...values, examId: currentExamPaper.examId},
                    })
                ).unwrap();
                notification.success({message: "Cập nhật đề thi thành công"});
            }
            dispatch(fetchExamPapers({page: currentPage, size: pageSize}));
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
            await dispatch(removeExamPaper(currentExamPaper.examPaperId)).unwrap();
            notification.success({message: "Xoá đề thi thành công"});
            dispatch(fetchExamPapers({page: currentPage, size: pageSize}));
            closeModal();
        } catch (error) {
            notification.error({message: "Thất bại", description: error.message});
        } finally {
            setLoadingAction(false);
        }
    };

    const handleTableChange = (pagination) => {
        dispatch(fetchExamPapers({
            page: pagination.current - 1,
            size: pagination.pageSize
        }));
    };

    const handleSearch = (e) => {
        setSearchText(e.target.value);
    };

    const filteredExamPapers = examPapers.filter((examPaper) =>
        examPaper.examPaperId.toString().includes(searchText.toLowerCase()) || // Lọc theo ID
        examPaper.title.toLowerCase().includes(searchText.toLowerCase()) || // Lọc theo tiêu đề
        examPaper.description?.toLowerCase().includes(searchText.toLowerCase()) // Lọc theo mô tả
    );


    const columns = [
        {title: "Mã đề thi", dataIndex: "examPaperId", key: "examPaperId"},
        {title: "Tiêu đề", dataIndex: "title", key: "title"},
        {title: "Mô tả", dataIndex: "description", key: "description"},
        {title: "Thời lượng", dataIndex: "duration", key: "duration"},
        {title: "Điểm tối đa", dataIndex: "maxScore", key: "maxScore"},
        {title: "Điểm đạt", dataIndex: "passingScore", key: "passingScore"},
        {
            title: "Cấp chứng nhận",
            dataIndex: "canAwardCertificate",
            key: "canAwardCertificate",
            render: (value) => (value ? "Có" : "Không"),
        },
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

    const formattedData = filteredExamPapers.map((examPaper) => ({
        key: examPaper.examPaperId,
        ...examPaper,
    }));

    return (
        <div>
            <h1>Quản lý đề thi</h1>

            <Input
                placeholder="Tìm kiếm đề thi"
                style={{marginBottom: 16, width: 300}}
                onChange={handleSearch}
                value={searchText}
            />

            <Button
                type="primary"
                style={{width: "fit-content", marginBottom: 16}}
                onClick={() => openModal("add")}
            >
                Thêm đề thi
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

            <Modal
                title={currentModal === "add" ? "Thêm đề thi" : "Cập nhật đề thi"}
                visible={currentModal === "add" || currentModal === "update"}
                onCancel={closeModal}
                onOk={() => handleAction(currentModal)}
                okButtonProps={{loading: loadingAction}}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="Tiêu đề"
                        name="title"
                        rules={[{required: true, message: "Vui lòng nhập tiêu đề!"}]}
                    >
                        <Input placeholder="Nhập tiêu đề đề thi"/>
                    </Form.Item>
                    {currentModal === "add" ? (
                        <Form.Item
                            label="Kỳ thi (Exam ID)"
                            name="examId"
                            rules={[{required: true, message: "Vui lòng nhập mã kỳ thi!"}]}
                        >
                            <Input type="number" placeholder="Nhập mã kỳ thi (Exam ID)"/>
                        </Form.Item>
                    ) : (
                        <Form.Item
                            label="Kỳ thi (Exam ID)"
                            name="examId"
                        >
                            <Input
                                type="number"
                                placeholder="Mã kỳ thi"
                                disabled={currentModal === "update"}
                            />
                        </Form.Item>

                    )}
                    <Form.Item
                        label="Mô tả"
                        name="description"
                        rules={[{required: true, message: "Vui lòng nhập mô tả!"}]}
                    >
                        <Input.TextArea placeholder="Nhập mô tả đề thi" rows={4}/>
                    </Form.Item>
                    <Form.Item
                        label="Thời lượng (phút)"
                        name="duration"
                        rules={[{required: true, message: "Vui lòng nhập thời lượng!"}]}
                    >
                        <Input type="number" placeholder="Nhập thời lượng (phút)"/>
                    </Form.Item>
                    <Form.Item
                        label="Điểm tối đa"
                        name="maxScore"
                        rules={[{required: true, message: "Vui lòng nhập điểm tối đa!"}]}
                    >
                        <Input type="number" placeholder="Nhập điểm tối đa"/>
                    </Form.Item>
                    <Form.Item
                        label="Điểm đạt"
                        name="passingScore"
                        rules={[{required: true, message: "Vui lòng nhập điểm đạt!"}]}
                    >
                        <Input type="number" placeholder="Nhập điểm đạt"/>
                    </Form.Item>
                    <Form.Item
                        label="Cấp chứng nhận"
                        name="canAwardCertificate"
                        valuePropName="checked"
                    >
                        <Checkbox>Có cấp chứng nhận</Checkbox>
                    </Form.Item>
                </Form>
            </Modal>

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
                Bạn có chắc chắn muốn xoá đề thi này?
            </Modal>
            <Outlet/>
        </div>
    );
}

export default ExamPaper;
