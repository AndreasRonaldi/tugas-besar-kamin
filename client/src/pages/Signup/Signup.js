import React from "react";
import "./Signup.css";
import { Button, Form, Input, Typography, message } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const { Title } = Typography;

const Signup = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    console.log(values);
    const { email, password } = values;

    try {
      const { data } = await axios.post("http://localhost:8080/signup", {
        email,
        password,
      });

      console.log(data);
      navigate("/login");
    } catch (e) {
      if (e.response.status === 401)
        messageApi.error("Incorrect Email or Password");
      else messageApi.error("Something went wrong, Please Try Again!");
    }
  };

  return (
    <main>
      {contextHolder}
      <div className="wrapperLogin">
        <Title
          style={{
            fontFamily: "Montserrat",
          }}>
          Sign up
        </Title>
        <Form
          className="forminputLogin"
          name="normal_login"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}>
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: "Please input your Email!",
              },
              {
                required: true,
                type: "email",
                message: "Must be valid Email!",
              },
            ]}>
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Email"
              type="email"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your Password!",
              },
            ]}>
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item
            name="confirm"
            dependencies={["password"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please confirm your password!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("The new password that you entered do not match!")
                  );
                },
              }),
            ]}>
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder="Confirm Password"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button">
              Sign up
            </Button>
            Or <Link to="/login">login now!</Link>
          </Form.Item>
        </Form>
      </div>
    </main>
  );
};

export default Signup;
