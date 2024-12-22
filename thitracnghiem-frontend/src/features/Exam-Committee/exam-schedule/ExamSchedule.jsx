import {Alert, Button, Form, Input, Modal, Pagination, Select, Spin, Table} from "antd";
import {SearchOutlined, PlusOutlined} from "@ant-design/icons";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import styles from "./ExamSchedule.module.css";
import {
    createExamSchedule,
    searchExamSchedules,
    fetchExamScheduleUsers,
    fetchExamScheduleSupervisory, addParticipants, fetchExamSchedules
} from "../../../store/slices/examScheduleSlice.js";
import {getUsers} from "../../../store/slices/userSlice.js";

function ExamSchedule() {

    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const {users, isLoading: isUsersLoading} = useSelector((state) => state.users);

    const [addForm] = Form.useForm(); // Form cho modal
    const [isAddModalVisible, setIsAddModalVisible] = useState(false); // Trạng thái modal
    const [isUserModalVisible, setIsUserModalVisible] = useState(false); // Modal hiển thị DS thí sinh
    const [isSupervisoryModalVisible, setIsSupervisoryModalVisible] = useState(false); // Modal hiển thị DS giám thị

    const [isParticipantModalVisible, setIsParticipantModalVisible] = useState(false); // Modal thêm người tham gia
    const [participantData, setParticipantData] = useState({

        examScheduleId: null,
        userIds: [],
    });
    const [userList, setUserList] = useState([]);
    const [supervisoryList, setSupervisoryList] = useState([]);
    const [searchParams, setSearchParams] = useState({
        subjectName: null,
        locationName: null,
        sessionName: null,
        examPaperTitle: null,
        page: 0,
        size: 10
    });

    const examSchedules = useSelector((state) => state.examSchedules.examSchedules);
    const totalElements = useSelector((state) => state.examSchedules.totalElements);
    const isLoading = useSelector((state) => state.examSchedules.isLoading);
    const error = useSelector((state) => state.examSchedules.error);

    useEffect(() => {
        dispatch(searchExamSchedules(searchParams));
    }, [dispatch, searchParams]);
    useEffect(() => {
        dispatch(getUsers());
    }, [dispatch]);
    useEffect(() => {
        // Gọi action fetch toàn bộ lịch thi
        dispatch(fetchExamSchedules());
    }, [dispatch]);

    const handleSearch = (values) => {
        const processedParams = Object.fromEntries(
            Object.entries(values).filter(([_, v]) => v != null && v !== '')
        );

        setSearchParams({
            ...processedParams,
            page: 0,
            size: 10
        });
    };

    const handlePageChange = (page, pageSize) => {
        setSearchParams(prev => ({
            ...prev,
            page: page - 1,
            size: pageSize
        }));
    };

    const handleAddScheduleModalOpen = () => {
        setIsAddModalVisible(true);
    };

    const handleAddScheduleModalClose = () => {
        setIsAddModalVisible(false);
        addForm.resetFields();
    };
    const handleParticipantModalOpen = () => {
        setIsParticipantModalVisible(true);
    };
    const handleParticipantModalClose = () => {
        setIsParticipantModalVisible(false);
        setParticipantData({
            examScheduleId: null,
            userIds: [],
        });
    };

    const handleAddScheduleSubmit = (values) => {
        dispatch(createExamSchedule(values))
            .unwrap()
            .then(() => {
                Modal.success({
                    title: "Thành công",
                    content: "Lịch thi đã được thêm thành công!",
                });
                handleAddScheduleModalClose(); // Đóng modal
                setSearchParams({...searchParams, page: 0}); // Reload dữ liệu
            })
            .catch((error) => {
                Modal.error({
                    title: "Thất bại",
                    content: `Thêm lịch thi thất bại: ${error}`,
                });
            });
    };
    const handleParticipantSubmit = async () => {
        try {
            const response = await dispatch(
                addParticipants({
                    examScheduleId: participantData.examScheduleId, // Dùng participantData.examScheduleId
                    userIds: participantData.userIds, // Dùng participantData.userIds
                })
            ).unwrap(); // Unwrap để lấy kết quả hoặc lỗi
            console.log("Participants added successfully:", response);
        } catch (error) {
            console.error("Failed to add participants:", error);
        }
    };


    const handleFetchUsers = (examScheduleId) => {
        dispatch(fetchExamScheduleUsers(examScheduleId))
            .unwrap()
            .then(response => {
                // Change this line to access the correct data
                setUserList(response.data.content);
                setIsUserModalVisible(true);
            })
            .catch(error => {
                Modal.error({
                    title: "Lỗi",
                    content: `Lấy danh sách thí sinh thất bại: ${error.message}`,
                });
            });
    };

    const handleFetchSupervisory = (examScheduleId) => {
        dispatch(fetchExamScheduleSupervisory(examScheduleId))
            .unwrap()
            .then(response => {
                // Change this line to access the correct data
                setSupervisoryList(response.data.content);
                setIsSupervisoryModalVisible(true);
            })
            .catch(error => {
                Modal.error({
                    title: "Lỗi",
                    content: `Lấy danh sách giám thị thất bại: ${error.message}`,
                });
            });
    };
    const columns = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Mã đề thi",
            dataIndex: "examPaperId",
            key: "examPaperId",
        },
        {
            title: "Môn học",
            dataIndex: "subjectName",
            key: "subjectName",
        },
        {
            title: "Thời gian bắt đầu",
            dataIndex: "sessionStartTime",
            key: "sessionStartTime",
            render: (text) => text ? new Date(text).toLocaleString('vi-VN') : "",
        },
        {
            title: "Địa điểm",
            dataIndex: "locationName",
            key: "locationName",
        },
        {
            title: "Hành động",
            key: "actions",
            render: (text, record) => (
                <span>
                    <Button onClick={() => handleFetchUsers(record.id)} style={{marginRight: 8}}>
                        DS Thí sinh
                    </Button>
                    <Button onClick={() => handleFetchSupervisory(record.id)}>
                        DS Giám thị
                    </Button>
                </span>
            ),
        }
    ];

    return (
        <div className={styles.container}>
            <h1 className={styles.topButtonsContainer}>Tìm kiếm lịch thi
                <Button type="primary" icon={<PlusOutlined/>} onClick={handleAddScheduleModalOpen}>
                    Thêm lịch thi
                </Button>
                <Button type="primary" icon={<PlusOutlined/>} onClick={handleParticipantModalOpen}>
                    Thêm người tham gia
                </Button>
            </h1>
            <Form
                form={form}
                layout="inline"
                onFinish={handleSearch}
                className={styles.searchForm}
            >
                <Form.Item name="subjectName">
                    <Input placeholder="Môn học"/>
                </Form.Item>
                <Form.Item name="locationName">
                    <Input placeholder="Địa điểm"/>
                </Form.Item>
                <Form.Item name="examPaperId">
                    <Input placeholder="Mã đề thi"/>
                </Form.Item>
                <Form.Item name="sessionName">
                    <Input placeholder="Tên phiên"/>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" icon={<SearchOutlined/>}>
                        Tìm kiếm
                    </Button>
                    <Button onClick={() => form.resetFields()} style={{marginLeft: 8}}>
                        Đặt lại
                    </Button>
                </Form.Item>
            </Form>

            {isLoading && <Spin size="large" style={{width: '100%', margin: '20px 0'}}/>}

            {error && (
                <Alert
                    message="Lỗi"
                    description={error || "Đã xảy ra lỗi khi tìm kiếm"}
                    type="error"
                    showIcon
                />
            )}

            {!isLoading && !error && (
                <>
                    <Table
                        dataSource={examSchedules}
                        columns={columns}
                        rowKey="id"
                        pagination={false}
                    />

                    <Pagination
                        current={searchParams.page + 1} // Trang hiện tại (thêm 1 vì Ant Design bắt đầu từ 1)
                        total={totalElements} // Tổng số bản ghi
                        pageSize={searchParams.size} // Số bản ghi trên mỗi trang
                        onChange={handlePageChange}
                        showTotal={(total, range) => `${range[0]}-${range[1]} của ${total} kết quả`}
                    />

                </>
            )}

            {/* Modal DS Thí sinh */}
            <Modal
                title="Danh sách Thí sinh"
                visible={isUserModalVisible}
                onCancel={() => setIsUserModalVisible(false)}
                footer={null}
                width={1000}

            >
                <Table
                    dataSource={userList}
                    columns={[
                        {title: "ID", dataIndex: ["user", "userId"], key: "userId"},
                        {title: "Email", dataIndex: ["user", "email"], key: "email"},
                        {title: "SĐT", dataIndex: ["user", "phoneNumber"], key: "phoneNumber"},
                        {title: "Tên", dataIndex: ["user", "realName"], key: "realName"},
                        {
                            title: "Ngày đăng ký",
                            dataIndex: ["user", "registrationDate"],
                            key: "registrationDate",
                            render: (text) => new Date(text).toLocaleString('vi-VN')
                        },
                    ]}
                    rowKey={record => record.user.userId}
                    pagination={false}
                />


            </Modal>

            {/* Modal DS Giám Thị */}
            <Modal
                title="Danh sách Giám Thị"
                visible={isSupervisoryModalVisible}
                onCancel={() => setIsSupervisoryModalVisible(false)}
                footer={null}
                width={1000}

            >
                <Table
                    dataSource={supervisoryList}
                    columns={[
                        {title: "ID", dataIndex: ["user", "userId"], key: "userId"},
                        {title: "Email", dataIndex: ["user", "email"], key: "email"},
                        {title: "SĐT", dataIndex: ["user", "phoneNumber"], key: "phoneNumber"},
                        {title: "Tên", dataIndex: ["user", "realName"], key: "realName"},
                        {
                            title: "Ngày đăng ký",
                            dataIndex: ["user", "registrationDate"],
                            key: "registrationDate",
                            render: (text) => new Date(text).toLocaleString('vi-VN')
                        },
                    ]}
                    rowKey={record => record.user.userId}
                    pagination={false}
                />

            </Modal>
            {/* Modal Thêm lịch thi */}

            <Modal
                title="Thêm lịch thi"
                visible={isAddModalVisible}
                onCancel={handleAddScheduleModalClose}
                onOk={() => addForm.submit()}
                okText="Thêm"
                cancelText="Hủy"
            >
                <Form form={addForm} layout="vertical" onFinish={handleAddScheduleSubmit}>
                    <Form.Item
                        name="subjectId"
                        label="Mã môn học"
                        rules={[{required: true, message: "Vui lòng nhập mã môn học"}]}
                    >
                        <Input placeholder="Mã môn học"/>
                    </Form.Item>
                    <Form.Item
                        name="sessionId"
                        label="Mã phiên"
                        rules={[{required: true, message: "Vui lòng nhập mã phiên"}]}
                    >
                        <Input placeholder="Mã phiên"/>
                    </Form.Item>
                    <Form.Item
                        name="locationId"
                        label="Mã địa điểm"
                        rules={[{required: true, message: "Vui lòng nhập mã địa điểm"}]}
                    >
                        <Input placeholder="Mã địa điểm"/>
                    </Form.Item>
                    <Form.Item
                        name="examPaperId"
                        label="Mã đề thi"
                        rules={[{required: true, message: "Vui lòng nhập mã đề thi"}]}
                    >
                        <Input placeholder="Mã đề thi"/>
                    </Form.Item>
                </Form>
            </Modal>
            {/* Modal Thêm người tham gia*/}


            <Modal
                title="Thêm người tham gia"
                visible={isParticipantModalVisible}
                onCancel={handleParticipantModalClose}
                onOk={handleParticipantSubmit}
                okText="Thêm"
                cancelText="Hủy"
            >
                <Form layout="vertical">
                    <Form.Item label="Mã lịch thi" required>
                        <Input
                            value={participantData.examScheduleId}
                            onChange={(e) =>
                                setParticipantData((prev) => ({...prev, examScheduleId: e.target.value}))
                            }
                            placeholder="Nhập mã lịch thi"
                        />
                    </Form.Item>
                    <Form.Item label="Chọn người tham gia" required>
                        <Select
                            mode="multiple"
                            style={{width: '100%'}}
                            placeholder="Chọn người dùng"
                            loading={isUsersLoading}
                            onChange={(selectedUserIds) => {
                                console.log("Selected user IDs:", selectedUserIds);
                                setParticipantData((prev) => ({
                                    ...prev,
                                    userIds: selectedUserIds,
                                }));
                            }}
                        >
                            {users.map((user) => (
                                <Select.Option
                                    key={user.userId}
                                    value={user.userId}
                                    label={user.realName || user.email} // Đảm bảo `label` phù hợp với `value`
                                >
                                    {user.realName || user.email} (ID: {user.userId})
                                </Select.Option>
                            ))}
                        </Select>


                    </Form.Item> </Form>
            </Modal>
        </div>
    );
}

export default ExamSchedule;
