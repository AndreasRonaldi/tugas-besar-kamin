import React, { useEffect, useState } from "react";
import "./Post.css";
import { Button, Form, Input, Typography, Upload } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const { Title } = Typography;

const Post = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();

  const getData = async () => {
    try {
      const { data } = await axios.get(`http://localhost:8080/post?id=${id}`);
      setData(data);
      console.log(data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <main>
      <div className="wrapperLogin"></div>
    </main>
  );
};

export default Post;
