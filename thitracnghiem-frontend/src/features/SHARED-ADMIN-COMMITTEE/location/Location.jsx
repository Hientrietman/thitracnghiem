import {useEffect, useState} from "react";
import styles from "./Location.module.css";
import {Button, Table, Modal, Form, Input, notification, Spin} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {
    fetchLocations,
    createLocation,
    modifyLocation,
    removeLocation,
} from "../../../store/slices/locationSlice.js";

function Location() {
    const dispatch = useDispatch();
    const {locations, isLoading, error} = useSelector((state) => state.locations);

    const [currentModal, setCurrentModal] = useState(null); // 'add' | 'update' | 'delete' | null
    const [currentLocation, setCurrentLocation] = useState(null);
    const [loadingAction, setLoadingAction] = useState(false); // Loading state cho nút hành động
    const [form] = Form.useForm();

    useEffect(() => {
        dispatch(fetchLocations());
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            notification.error({message: "Lỗi", description: error});
        }
    }, [error]);

    const openModal = (type, location = null) => {
        setCurrentModal(type);
        setCurrentLocation(location);
        if (type === "update" && location) {
            form.setFieldsValue(location); // Điền dữ liệu vào form khi cập nhật
        }
    };

    const closeModal = () => {
        setCurrentModal(null);
        setCurrentLocation(null);
        form.resetFields();
    };

    const handleAction = async (type) => {
        setLoadingAction(true);
        try {
            const values = await form.validateFields();
            if (type === "add") {
                await dispatch(createLocation(values)).unwrap();
                notification.success({message: "Thêm địa điểm thành công"});
            } else if (type === "update") {
                await dispatch(
                    modifyLocation({locationId: currentLocation.locationId, locationData: values})
                ).unwrap();
                notification.success({message: "Cập nhật địa điểm thành công"});
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
            await dispatch(removeLocation(currentLocation.locationId)).unwrap();
            notification.success({message: "Xoá địa điểm thành công"});
            closeModal();
        } catch (error) {
            notification.error({message: "Thất bại", description: error.message});
        } finally {
            setLoadingAction(false);
        }
    };

    const columns = [
        {title: "Mã địa điểm", dataIndex: "locationId", key: "locationId"},
        {title: "Tên địa điểm", dataIndex: "locationName", key: "locationName"},
        {title: "Địa chỉ", dataIndex: "address", key: "address"},
        {title: "Sức chứa", dataIndex: "capacity", key: "capacity"},
        {title: "Mô tả", dataIndex: "description", key: "description"},
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

    const formattedData = locations.map((location) => ({
        key: location.locationId,
        ...location,
    }));

    return (
        <div className={styles.container}>
            <h1>Quản lý địa điểm thi</h1>
            <Button
                type="primary"
                style={{width: "fit-content", marginBottom: 16}}
                onClick={() => openModal("add")}
            >
                Thêm địa điểm thi
            </Button>

            <Table columns={columns} dataSource={formattedData} loading={isLoading}/>

            {/* Modal Thêm/Cập nhật địa điểm */}
            <Modal
                title={currentModal === "add" ? "Thêm địa điểm thi" : "Cập nhật địa điểm thi"}
                visible={currentModal === "add" || currentModal === "update"}
                onCancel={closeModal}
                onOk={() => handleAction(currentModal)}
                okButtonProps={{loading: loadingAction}}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="Tên địa điểm"
                        name="locationName"
                        rules={[{required: true, message: "Vui lòng nhập tên địa điểm!"}]}
                    >
                        <Input placeholder="Nhập tên địa điểm"/>
                    </Form.Item>
                    <Form.Item
                        label="Địa chỉ"
                        name="address"
                        rules={[{required: true, message: "Vui lòng nhập địa chỉ!"}]}
                    >
                        <Input placeholder="Nhập địa chỉ"/>
                    </Form.Item>
                    <Form.Item
                        label="Sức chứa"
                        name="capacity"
                        rules={[
                            {required: true, message: "Vui lòng nhập sức chứa!"},
                            {
                                type: "number",
                                min: 1,
                                transform: (value) => Number(value),
                                message: "Sức chứa phải là số lớn hơn 0!",
                            },
                        ]}
                    >
                        <Input type="number" placeholder="Nhập sức chứa"/>
                    </Form.Item>
                    <Form.Item label="Mô tả" name="description">
                        <Input.TextArea placeholder="Nhập mô tả địa điểm" rows={4}/>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Modal Xoá địa điểm */}
            <Modal
                title="Xoá địa điểm thi"
                visible={currentModal === "delete"}
                onCancel={closeModal}
                onOk={handleDelete}
                okButtonProps={{loading: loadingAction}}
                okText="Xoá"
                cancelText="Hủy"
            >
                <p>Bạn có chắc chắn muốn xoá địa điểm này không?</p>
            </Modal>
        </div>
    );
}

export default Location;
