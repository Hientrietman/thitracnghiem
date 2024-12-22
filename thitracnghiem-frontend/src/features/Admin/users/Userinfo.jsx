import {Button, Form, Input} from "antd";
import {useForm} from "antd/es/form/Form";
import {useSelector, useDispatch} from "react-redux"; // Đảm bảo import useDispatch
import {useEffect} from "react"; // Sử dụng useEffect để gọi lại dữ liệu
import {updateUser} from "../../../store/slices/userSlice.js"; // Thêm getUser action
import styles from "./Userinfo.module.css";
import {useNavigate} from "react-router-dom";
import {loginUser} from "../auth/loginSlice.js";

function Userinfo() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {user} = useSelector((state) => state.login); // Truy cập vào user từ Redux store
    const [form] = useForm();

    useEffect(() => {
        if (user) {
            form.setFieldsValue({
                userName: user.userName || "",
                realName: user.realName || "",
                email: user.email || "",
                active: user.active || false,
                phoneNumber: user.phoneNumber || "",
            });
        }
    }, [user, form]);

    const handleSubmit = () => {
        form
            .validateFields()
            .then((values) => {
                // Gọi dispatch cập nhật user
                dispatch(
                    updateUser({
                        userName: values.userName,
                        realName: values.realName,
                        phoneNumber: values.phoneNumber,
                    })
                ).then(() => {
                    // Sau khi cập nhật thành công, gọi lại getUser để lấy lại thông tin mới
                });
            })
            .catch((info) => {
                console.log("Validate Failed:", info);
            });
    };

    return (
        <div className={styles.container}>
            <h1>Thông tin người dùng</h1>
            <div className={styles.userinfo}>
                <Form className={styles.form} form={form} layout="vertical">
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{required: true, message: "Vui lòng nhập email"}]}
                    >
                        <Input disabled/>
                    </Form.Item>
                    <Form.Item
                        label="Tên người dùng"
                        name="userName"
                        rules={[
                            {required: true, message: "Vui lòng nhập tên người dùng"},
                        ]}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item label="Họ tên" name="realName">
                        <Input placeholder="Nhập họ tên"/>
                    </Form.Item>
                    <Form.Item label="Số điện thoại" name="phoneNumber">
                        <Input placeholder="Nhập số điện thoại"/>
                    </Form.Item>
                    <Form.Item label="Trạng thái hoạt động" name="active">
                        <Input
                            disabled
                            value={user?.active ? "Còn hoạt động" : "Không hoạt động"}
                        />
                    </Form.Item>
                    <Button
                        type="primary"
                        style={{marginTop: "20px", width: "fit-content"}}
                        onClick={handleSubmit}
                    >
                        Cập nhật
                    </Button>
                </Form>
                <div className={styles.address}>CHỈNH SỬA ĐỊA CHỈ (ĐANG CẬP NHẬT)</div>
            </div>
        </div>
    );
}

export default Userinfo;
