import {useEffect, useState} from "react";
import styles from "./Session.module.css";
import {Button, Table, Modal, Form, Input, notification, Spin} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {
    fetchSessions,
    createSession,
    modifySession,
    removeSession,
} from "../../../store/slices/sessionSlice.js";

function Session() {
    const dispatch = useDispatch();
    const {sessions, isLoading, error} = useSelector((state) => state.sessions);

    const [currentModal, setCurrentModal] = useState(null); // 'add' | 'update' | 'delete' | null
    const [currentSession, setCurrentSession] = useState(null);
    const [loadingAction, setLoadingAction] = useState(false); // Loading state cho nút hành động
    const [form] = Form.useForm();

    useEffect(() => {
        dispatch(fetchSessions());
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            notification.error({message: "Lỗi", description: error});
        }
    }, [error]);

    const openModal = (type, session = null) => {
        setCurrentModal(type);
        setCurrentSession(session);
        if (type === "update" && session) {
            form.setFieldsValue(session); // Điền dữ liệu vào form khi cập nhật
        }
    };

    const closeModal = () => {
        setCurrentModal(null);
        setCurrentSession(null);
        form.resetFields();
    };

    const handleAction = async (type) => {
        setLoadingAction(true);
        try {
            const values = await form.validateFields();
            // Chuyển đổi thời gian bắt đầu thành UTC nếu cần
            if (values.startTime) {
                const date = new Date(values.startTime);
                values.startTime = date.toISOString(); // Chuyển sang định dạng UTC chuẩn ISO
            }

            // Sau đó gửi dữ liệu đi
            if (type === "add") {
                await dispatch(createSession(values)).unwrap();
                notification.success({message: "Thêm ca thi thành công"});
            } else if (type === "update") {
                await dispatch(
                    modifySession({sessionId: currentSession.sessionId, sessionData: values})
                ).unwrap();
                notification.success({message: "Cập nhật ca thi thành công"});
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
            await dispatch(removeSession(currentSession.sessionId)).unwrap();
            notification.success({message: "Xoá ca thi thành công"});
            closeModal();
        } catch (error) {
            notification.error({message: "Thất bại", description: error.message});
        } finally {
            setLoadingAction(false);
        }
    };
    const columns = [
        {title: "Mã ca thi", dataIndex: "sessionId", key: "sessionId"},
        {title: "Tên ca thi", dataIndex: "sessionName", key: "sessionName"},
        {title: "Thời gian bắt đầu", dataIndex: "startTime", key: "startTime"},  // Đây là trường đã format
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

    const formattedData = sessions.map((session) => ({
        key: session.sessionId,
        sessionId: session.sessionId,
        sessionName: session.sessionName,
        startTime: session.formattedStartTime,  // Sử dụng phương thức này để hiển thị thời gian
    }));


    return (
        <div className={styles.container}>
            <h1>Quản lý ca thi</h1>
            <Button
                type="primary"
                style={{width: "fit-content", marginBottom: 16}}
                onClick={() => openModal("add")}
            >
                Thêm ca thi
            </Button>

            <Table columns={columns} dataSource={formattedData} loading={isLoading}/>

            {/* Modal Thêm/Cập nhật ca thi */}
            <Modal
                title={currentModal === "add" ? "Thêm ca thi" : "Cập nhật ca thi"}
                visible={currentModal === "add" || currentModal === "update"}
                onCancel={closeModal}
                onOk={() => handleAction(currentModal)}
                okButtonProps={{loading: loadingAction}}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="Tên ca thi"
                        name="sessionName"
                        rules={[{required: true, message: "Vui lòng nhập tên ca thi!"}]}
                    >
                        <Input placeholder="Nhập tên ca thi"/>
                    </Form.Item>
                    <Form.Item
                        label="Thời gian bắt đầu"
                        name="startTime"
                        rules={[{required: true, message: "Vui lòng chọn thời gian bắt đầu!"}]}
                    >
                        <Input type="datetime-local"/>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Modal Xoá ca thi */}
            <Modal
                title="Xoá ca thi"
                visible={currentModal === "delete"}
                onCancel={closeModal}
                onOk={handleDelete}
                okButtonProps={{loading: loadingAction}}
                okText="Xoá"
                cancelText="Hủy"
            >
                <p>Bạn có chắc chắn muốn xoá ca thi này không?</p>
            </Modal>
        </div>
    );
}

export default Session;
