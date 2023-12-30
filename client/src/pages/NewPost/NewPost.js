import React from "react";
import "./NewPost.css";
import { Button, Form, Input, Typography, Upload, message } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const NewPost = () => {
  // const navigate = useNavigate();

  const fileToBlob = async (file) => {
    return new Promise((resolve) => {
      const fr = new FileReader();
      // let base64;
      fr.readAsDataURL(file);

      fr.onload = (e) => {
        // console.log(new Uint8Array(fr.result));
        // const base64 = btoa(
        //   new Uint8Array(fr.result).reduce(
        //     (data, byte) => data + String.fromCharCode(byte),
        //     ""
        //   )
        // );
        // console.log(base64);
        resolve(e.target.result);
        // resolve(base64);
      };
    });
  };

  const onFinish = async (values) => {
    console.log(values);
    const blob = await fileToBlob(values.image);
    console.log(blob);
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
    <main>
      <div className="wrapperNewPost">
        <Title
          style={{
            fontFamily: "Montserrat",
          }}>
          New Post
        </Title>
        <Form onFinish={onFinish} style={{ width: "100%" }}>
          <Form.Item
            name={"image"}
            wrapperCol={{ span: 24 }}
            valuePropName="file"
            getValueFromEvent={normFile}>
            <Upload.Dragger {...props}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drag image to this area to upload
              </p>
              <p className="ant-upload-hint">Support for a single image.</p>
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
  );
};

export default NewPost;
