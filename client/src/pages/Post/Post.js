import React from "react";
import "./Post.css";
import { Button, Form, Input, Typography, Upload } from "antd";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const Post = () => {
  const navigate = useNavigate();

  const onFinish = (values) => {
    console.log(values);
    // const { email, password } = values;
    // if (email === "test@gmail.com" && password === "test123") navigate("/");
  };

  return (
    <main>
      <div className="wrapperLogin">
        <Title>Login</Title>
        <Form onFinish={onFinish} autoComplete="off">
          <Form.Item label="test image" name={"image"}>
            <Upload />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </main>
  );
};

export default Post;
