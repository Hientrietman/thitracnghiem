import React, {useState, useEffect} from "react";
import {Form, Input, Button, Spin} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {loginUser} from "./loginSlice.js";
import {useNavigate} from "react-router-dom";
import styles from "./Login.module.css"; // Import CSS module

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {isLoading, error, isLogin, role} = useSelector(
        (state) => state.login
    );
    const [credentials, setCredentials] = useState({
        username: "",
        password: "",
    });

    const onFinish = async (values) => {
        setCredentials({
            username: values.username,
            password: values.password,
        });
        await dispatch(
            loginUser({username: values.username, password: values.password})
        );
    };

    useEffect(() => {
        if (isLogin) {
            if (role === "ADMIN") {
                navigate("/admin/dashboard/");
            } else if (role === "EXAM_COMMITTEE") {
                navigate("/committee/dashboard/");
            } else if (role === "USER") {
                navigate("/student/dashboard/");
            } else {
                navigate("/");
            }
        }
    }, [isLogin, role, navigate]);

    return (
        <div className={styles.container}>
            <Form
                name="login"
                initialValues={{remember: true}}
                onFinish={onFinish}
                className={styles.form}
            >
                <Form.Item
                    name="username"
                    rules={[{required: true, message: "Please input your username!"}]}
                >
                    <Input
                        placeholder="Username"
                        value={credentials.username}
                        onChange={(e) =>
                            setCredentials({...credentials, username: e.target.value})
                        }
                    />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[{required: true, message: "Please input your password!"}]}
                >
                    <Input.Password
                        placeholder="Password"
                        value={credentials.password}
                        onChange={(e) =>
                            setCredentials({...credentials, password: e.target.value})
                        }
                    />
                </Form.Item>
                {error && <div className={styles.error}>{error}</div>}
                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        disabled={isLoading}
                        className={styles.button}
                    >
                        {isLoading ? <Spin/> : "Login"}
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default Login;
