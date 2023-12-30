import React from "react";
import "./Login.css";
import { Button, Form, Input, Typography, message, Checkbox } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const { Title } = Typography;

const Login = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    console.log(values);
    const { email, password, remember } = values;

    try {
      const { data } = await axios.post("http://localhost:8080/login", {
        email,
        password,
      });
      // console.log(data);
      localStorage.setItem(
        "user",
        JSON.stringify({
          email,
          username: data.username,
          role: data.role,
        })
      );

      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${data.accessToken}`;

      if (remember) localStorage.setItem("accessToken", data.accessToken);
      if (remember) localStorage.setItem("refreshToken", data.refreshToken);
      navigate("/");
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
          Login
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
          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            {/* <a className="login-form-forgot" href="">
              Forgot password
            </a> */}
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button">
              Log in
            </Button>
            Or <Link to="/signup">register now!</Link>
          </Form.Item>
        </Form>
      </div>
    </main>
  );
};

export default Login;
