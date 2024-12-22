import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import axios from "axios";

const Register = () => {
  const [step, setStep] = useState(1); // Biến điều khiển bước hiện tại
  const [email, setEmail] = useState(""); // Lưu email người dùng
  const [verificationCode, setVerificationCode] = useState(""); // Lưu mã xác thực
  const [isLoading, setIsLoading] = useState(false); // Trạng thái loading

  const handleEmailSubmit = async (values) => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        "http://localhost:8080/api/v1/auth/register/email",
        {
          email: values.email,
        }
      );
      setEmail(values.email); // Lưu email sau khi gửi thành công
      message.success("Mã xác thực đã được gửi đến email của bạn!");
      setStep(2); // Chuyển sang bước 2 để nhập mã xác thực
    } catch (error) {
      message.error("Đăng ký thất bại. Vui lòng thử lại!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificationSubmit = async (values) => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        "http://localhost:8080/api/v1/auth/verify",
        {
          email,
          verificationCode: values.verificationCode,
          password: values.password,
        }
      );
      message.success("Đăng ký thành công!");
      setStep(1); // Đưa người dùng về bước 1 sau khi hoàn tất đăng ký
    } catch (error) {
      message.error("Mã xác thực không chính xác hoặc đã hết hạn!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {step === 1 ? (
        // Bước 1: Nhập email
        <Form onFinish={handleEmailSubmit}>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              style={{ width: "100%" }}
            >
              Gửi mã xác thực
            </Button>
          </Form.Item>
        </Form>
      ) : (
        // Bước 2: Nhập mã xác thực và mật khẩu
        <Form onFinish={handleVerificationSubmit}>
          <Form.Item
            name="verificationCode"
            rules={[{ required: true, message: "Vui lòng nhập mã xác thực!" }]}
          >
            <Input placeholder="Mã xác thực" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password placeholder="Mật khẩu" />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              style={{ width: "100%" }}
            >
              Xác thực và Đăng ký
            </Button>
          </Form.Item>
        </Form>
      )}
    </div>
  );
};

export default Register;
