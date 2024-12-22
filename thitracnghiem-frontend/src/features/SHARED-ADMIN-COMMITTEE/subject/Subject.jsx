import {useEffect, useState} from "react";
import {Button, Table, Modal, Form, Input, notification} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {fetchSubjects, createSubject, modifySubject, removeSubject} from "../../../store/slices/subjectSlice.js";
import SubjectModel from "../../../model/SubjectModel.js";

function Subject() {
    const dispatch = useDispatch();
    const {subjects, isLoading, error} = useSelector((state) => state.subjects);

    const [currentModal, setCurrentModal] = useState(null); // 'add' | 'update' | 'delete' | null
    const [currentSubject, setCurrentSubject] = useState(null);
    const [loadingAction, setLoadingAction] = useState(false); // Loading state cho nút hành động
    const [form] = Form.useForm();

    useEffect(() => {
        dispatch(fetchSubjects());
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            notification.error({message: "Lỗi", description: error});
        }
    }, [error]);

    const openModal = (type, subject = null) => {
        setCurrentModal(type);
        setCurrentSubject(subject);
        if (type === "update" && subject) {
            form.setFieldsValue(subject); // Điền dữ liệu vào form khi cập nhật
        }
    };

    const closeModal = () => {
        setCurrentModal(null);
        setCurrentSubject(null);
        form.resetFields();
    };

    const handleAction = async (type) => {
        setLoadingAction(true);
        try {
            const values = await form.validateFields();

            // Sau đó gửi dữ liệu đi
            if (type === "add") {
                await dispatch(createSubject(values)).unwrap();
                notification.success({message: "Thêm môn học thành công"});
            } else if (type === "update") {
                await dispatch(
                    modifySubject({subjectId: currentSubject.subjectId, subjectData: values})
                ).unwrap();
                notification.success({message: "Cập nhật môn học thành công"});
            }
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
            await dispatch(removeSubject(currentSubject.subjectId)).unwrap();
            notification.success({message: "Xoá môn học thành công"});
            closeModal();
        } catch (error) {
            notification.error({message: "Thất bại", description: error.message});
        } finally {
            setLoadingAction(false);
        }
    };

    const columns = [
        {title: "Mã môn học", dataIndex: "subjectId", key: "subjectId"},
        {title: "Tên môn học", dataIndex: "subjectName", key: "subjectName"},
        {title: "Mô tả", dataIndex: "description", key: "description"}, // Cột mới cho mô tả
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

    const formattedData = subjects.map((subject) => ({
        key: subject.subjectId,
        subjectId: subject.subjectId,
        subjectName: subject.subjectName,
        description: subject.description, // Thêm mô tả vào dữ liệu hiển thị
    }));

    return (
        <div>
            <h1>Quản lý môn học</h1>
            <Button
                type="primary"
                style={{width: "fit-content", marginBottom: 16}}
                onClick={() => openModal("add")}
            >
                Thêm môn học
            </Button>

            <Table columns={columns} dataSource={formattedData} loading={isLoading}/>

            {/* Modal Thêm/Cập nhật môn học */}
            <Modal
                title={currentModal === "add" ? "Thêm môn học" : "Cập nhật môn học"}
                visible={currentModal === "add" || currentModal === "update"}
                onCancel={closeModal}
                onOk={() => handleAction(currentModal)}
                okButtonProps={{loading: loadingAction}}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="Tên môn học"
                        name="subjectName"
                        rules={[{required: true, message: "Vui lòng nhập tên môn học!"}]}
                    >
                        <Input placeholder="Nhập tên môn học"/>
                    </Form.Item>
                    <Form.Item
                        label="Mô tả"
                        name="description"
                        rules={[{required: true, message: "Vui lòng nhập mô tả môn học!"}]}
                    >
                        <Input placeholder="Nhập mô tả môn học"/>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Modal Xoá môn học */}
            <Modal
                title="Xoá môn học"
                visible={currentModal === "delete"}
                onCancel={closeModal}
                onOk={handleDelete}
                okButtonProps={{loading: loadingAction}}
                okText="Xoá"
                cancelText="Hủy"
            >
                <p>Bạn có chắc chắn muốn xoá môn học này không?</p>
            </Modal>
        </div>
    );
}

export default Subject;
