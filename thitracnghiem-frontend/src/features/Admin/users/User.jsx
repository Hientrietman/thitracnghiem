import React, {useEffect} from "react";
import {Table, Spin, Alert, Select, message, notification} from "antd";
import styles from "./User.module.css";
import {useDispatch, useSelector} from "react-redux";
import {getUsers, updateUserRole} from "../../../store/slices/userSlice.js";

const {Option} = Select;

function User() {
    const dispatch = useDispatch();
    const {users, isLoading, error} = useSelector((state) => state.users);

    useEffect(() => {
        dispatch(getUsers());
    }, [dispatch]);

    // Hiển thị thông báo lỗi nếu error tồn tại
    useEffect(() => {
        if (error) {
            notification.error({
                message: "Lỗi",
                description: error,
            });
        }
    }, [error]);

    const handleChangeRole = async (userId, newRole) => {
        try {
            const roleId = convertRoleToId(newRole);
            await dispatch(updateUserRole({userId, roleId})).unwrap();
            notification.success({
                message: "Thành công",
                description: "Cập nhật vai trò thành công!",
            });
        } catch (error) {
            notification.error({
                message: "Thất bại",
                description: error.message || "Cập nhật vai trò thất bại!",
            });
        }
    };

    const convertRoleToId = (role) => {
        const roles = {
            USER: 1,
            SUPERVISORY: 2,
            EXAM_COMMITTEE: 3,
            ADMIN: 4,
        };
        return roles[role] || 1;
    };

    const columns = [
        {title: "ID", dataIndex: "userId", key: "userId"},
        {title: "Tên", dataIndex: "realName", key: "realName"},
        {title: "Email", dataIndex: "email", key: "email"},
        {
            title: "Ngày đăng ký",
            dataIndex: "registrationDate",
            key: "registrationDate",
            render: (text) => new Date(text).toLocaleString(),
        },
        {
            title: "Trạng thái",
            dataIndex: "active",
            key: "active",
            render: (text) => (text ? "Kích hoạt" : "Không kích hoạt"),
        },
        {
            title: "Vai trò",
            dataIndex: "role",
            key: "editRole",
            render: (role, record) => (
                <Select
                    defaultValue={role}
                    style={{width: 120}}
                    onChange={(newRole) => handleChangeRole(record.userId, newRole)}
                >
                    <Option value="USER">User</Option>
                    <Option value="SUPERVISORY">Supervisory</Option>
                    <Option value="EXAM_COMMITTEE">Exam Committee</Option>
                    <Option value="ADMIN">Admin</Option>
                </Select>
            ),
        },
    ];

    return (
        <div className={styles.container}>
            <h1>Quản lý người dùng</h1>
            {error && <Alert message={error} type="error" showIcon/>}
            {isLoading ? <Spin size="large"/> : <Table dataSource={users} columns={columns}/>}
        </div>
    );
}

export default User;
