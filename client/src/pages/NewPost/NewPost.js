import React from "react";
import "./NewPost.css";
import { Button, Form, Input, Typography, Upload, message } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UseLogin from "../../component/UseLogin/UseLogin";

const { Title } = Typography;

const NewPost = () => {
  const navigate = useNavigate();

  const fileToBlob = async (file) => {
    return new Promise((resolve) => {
      const fr = new FileReader();
      fr.readAsDataURL(file);

      fr.onload = (e) => {
        resolve(e.target.result);
      };
    });
  };

  const onFinish = async (values) => {
    console.log(values);
    const blob = await fileToBlob(values.image);
    // console.log(blob);
    try {
      const { data } = await axios.post("http://localhost:8080/post", {
        image: blob,
        title: values.title,
        desc: values.desc,
      });
      console.log(data);
      console.log(data?.resizedBase64);

      navigate("/");
    } catch (e) {
      message.error(`Something went wrong, Please try again!`);
    }

    // const linkSource = data;
    // const downloadLink = document.createElement("a");
    // const fileName = `test`;
    // downloadLink.href = linkSource;
    // downloadLink.download = fileName;
    // downloadLink.click();
  };

  const listType = ["image/png", "image/jpeg"];

  const props = {
    name: "file",
    listType: "picture",
    beforeUpload: (file) => {
      console.log(file);
      const isAccType = listType.includes(file.type);
      if (!isAccType) {
        message.error(`${file.name} is not an acceptable type`);
        return Upload.LIST_IGNORE;
      }
      return false;
    },
    style: { width: "100%" },
    maxCount: 1,
    accept: ".png, .jpg",
  };

  const normFile = (e) => {
    return e?.file;
  };

  return (
    <>
      <UseLogin />

      <main>
        <div className="wrapperNewPost">
          <Title
            style={{
              fontFamily: "Montserrat",
            }}>
            New Post
          </Title>
          <Form
            onFinish={onFinish}
            style={{ width: "100%" }}
            labelCol={{ span: 5 }}>
            <Form.Item
              label="Title"
              name="title"
              rules={[{ required: true, message: "Please input the title!" }]}>
              <Input maxLength={100} showCount />
            </Form.Item>
            <Form.Item
              label="Description"
              name="desc"
              rules={[
                { required: true, message: "Please input the description!" },
              ]}>
              <Input.TextArea maxLength={2000} showCount />
            </Form.Item>
            <Form.Item
              label="Photo"
              name={"image"}
              wrapperCol={{ span: 24 }}
              valuePropName="file"
              getValueFromEvent={normFile}
              rules={[{ required: true, message: "Please input the photos!" }]}>
              <Upload.Dragger {...props}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  Click or drag image to this area to upload
                </p>
                <p className="ant-upload-hint">
                  Support for a single image. (png, jpg)
                </p>
              </Upload.Dragger>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Submit
              </Button>
            </Form.Item>
          </Form>
        </div>
      </main>
    </>
  );
};

export default NewPost;
