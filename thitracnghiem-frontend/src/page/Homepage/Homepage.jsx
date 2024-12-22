import React, {useState} from "react";
import {Button, Modal} from "antd";
import Login from "../../features/Admin/auth/Login.jsx";
import Register from "../../features/Admin/auth/Register.jsx";
import styles from "./Homepage.module.css";
import artImage from "../../assets/art.jpg";

function Homepage() {
    const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
    const [isRegisterModalVisible, setIsRegisterModalVisible] = useState(false);

    // Hàm để mở modal Login
    const showLoginModal = () => {
        setIsLoginModalVisible(true);
        setIsRegisterModalVisible(false);
    };

    // Hàm để mở modal Register
    const showRegisterModal = () => {
        setIsRegisterModalVisible(true);
        setIsLoginModalVisible(false);
    };

    // Đóng cả hai modal
    const handleCancel = () => {
        setIsLoginModalVisible(false);
        setIsRegisterModalVisible(false);
    };

    return (
        <div className={styles.container}>
            {/* Bên trái là hình ảnh */}
            <div className={styles.imageContainer}>
                <img
                    src={artImage}
                    alt="Homepage"
                    className={styles.image}
                />
            </div>

            {/* Bên phải là nội dung */}
            <div className={styles.content}>
                <h1 className={styles.title}>Welcome to Our Website</h1>
                <div className={styles.buttonContainer}>
                    <Button type="default" onClick={showRegisterModal}>
                        Register
                    </Button>
                    <Button type="primary" onClick={showLoginModal}>
                        Login
                    </Button>
                </div>
            </div>


            {/* Modal cho Login */
            }
            <Modal
                title="Login"
                visible={isLoginModalVisible}
                onCancel={handleCancel}
                footer={null}
                centered
                className={styles.loginModal}
            >
                <Login/>
            </Modal>

            {/* Modal cho Register */
            }
            <Modal
                title="Register"
                visible={isRegisterModalVisible}
                onCancel={handleCancel}
                footer={null}
                centered
                className={styles.loginModal}
            >
                <Register/>
            </Modal>
        </div>
    );
}

export default Homepage;
