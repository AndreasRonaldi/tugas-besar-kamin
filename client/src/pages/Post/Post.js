import React, { useEffect, useState } from "react";
import "./Post.css";
import {
  Typography,
  Image,
  Button,
  Spin,
  Avatar,
  Divider,
  Skeleton,
  FloatButton,
  List,
  Input,
  Form,
  Empty,
  Tooltip,
} from "antd";
import Icon, { CloseOutlined, HeartOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const { Text, Paragraph, Title } = Typography;

const HeartSvg = () => (
  <svg width="1em" height="1em" fill="currentColor" viewBox="0 0 1024 1024">
    <path d="M923 283.6c-13.4-31.1-32.6-58.9-56.9-82.8-24.3-23.8-52.5-42.4-84-55.5-32.5-13.5-66.9-20.3-102.4-20.3-49.3 0-97.4 13.5-139.2 39-10 6.1-19.5 12.8-28.5 20.1-9-7.3-18.5-14-28.5-20.1-41.8-25.5-89.9-39-139.2-39-35.5 0-69.9 6.8-102.4 20.3-31.4 13-59.7 31.7-84 55.5-24.4 23.9-43.5 51.7-56.9 82.8-13.9 32.3-21 66.6-21 101.9 0 33.3 6.8 68 20.3 103.3 11.3 29.5 27.5 60.1 48.2 91 32.8 48.9 77.9 99.9 133.9 151.6 92.8 85.7 184.7 144.9 188.6 147.3l23.7 15.2c10.5 6.7 24 6.7 34.5 0l23.7-15.2c3.9-2.5 95.7-61.6 188.6-147.3 56-51.7 101.1-102.7 133.9-151.6 20.7-30.9 37-61.5 48.2-91 13.5-35.3 20.3-70 20.3-103.3 0.1-35.3-7-69.6-20.9-101.9z" />
  </svg>
);

const HeartIcon = (props) => <Icon component={HeartSvg} {...props} />;

const Post = () => {
  const [useLogged, setLogged] = useState(false);
  const [post, setPost] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadComment, setLoadComment] = useState(true);
  const [like, setLike] = useState(false);
  const [comment, setComment] = useState([]);

  const navigate = useNavigate();
  const { id } = useParams();

  const getData = async () => {
    setLoading(true);
    try {
      const {
        data: { post, similarPost },
      } = await axios.get(`http://localhost:8080/post?id=${id}`);
      setPost(post[0]);
      setSimilar(similarPost);
      console.log(post);
      console.log("similar", similarPost);
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };

  const getLike = async () => {
    try {
      let { data } = await axios.get(
        `http://localhost:8080/like?id_post=${id}`
      );
      setLike(data);
    } catch (e) {
      console.log(e);
    }
  };

  const getComment = async () => {
    setLoadComment(true);
    try {
      let { data } = await axios.get(
        `http://localhost:8080/comment?id_post=${id}`
      );
      console.log(data);
      setComment(data);
    } catch (e) {
      console.log(e);
    }
    setLoadComment(false);
  };

  useEffect(() => {
    getData();
    getLike();
    getComment();

    (async () => {
      try {
        await axios.get("http://localhost:8080/amiloggedin");
        console.log("logged in!");
        setLogged(true);
      } catch (e) {
        console.log("not logged in!");
        setLogged(false);
      }
      // console.log(await testLoggedIn());
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleLike = async (e, id_post, status) => {
    e.stopPropagation();

    try {
      await axios.post("http://localhost:8080/like", {
        id_post,
        status,
      });
      getLike();
    } catch (e) {
      console.log(e);
    }
  };

  const handleAddComment = async (values) => {
    console.log(values);
    const data = await axios.post("http://localhost:8080/comment", {
      id_post: id,
      comment: values.comment,
    });

    console.log(data);
  };

  return (
    <main>
      <Button
        className="btnBack"
        type="primary"
        danger
        shape="circle"
        icon={<CloseOutlined />}
        size={"large"}
        onClick={() => navigate("/")}
      />

      <div className="wrapperPost">
        <div className="wrapperImage">
          {loading ? (
            <Spin />
          ) : (
            <Image src={post.image} height={window.innerHeight} />
          )}
          {similar.length > 0 && (
            <div className="wrapperSimilarPost">
              <Title level={5} style={{ textAlign: "center" }}>
                Similar Post
              </Title>
              <div style={{ display: "flex", gap: "12px" }}>
                {similar.map((c) => (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      width: "100px",
                      position: "relative",
                    }}
                    onClick={() => {
                      navigate(`/post/${c.id}`);
                    }}>
                    <Tooltip title="click to view post">
                      <Image
                        src={c.thumbUrl}
                        className="imgSimilar"
                        // height={100}
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                        }}
                        preview={false}
                      />
                    </Tooltip>
                    <Text>{Math.round(c.percentage * 100)} %</Text>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="wrapperDesc">
          {loading ? (
            <Skeleton avatar paragraph={{ rows: 4 }} />
          ) : (
            <>
              <div>
                <Avatar
                  size="large"
                  src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${post.email}`}
                  style={{ backgroundColor: "#cdcdcd" }}
                />
                <Text style={{ marginLeft: "20px" }} strong>
                  {post.email}
                </Text>
              </div>
              <Paragraph style={{ marginTop: "20px" }}>{post.desc}</Paragraph>
            </>
          )}
          <Divider>Comment</Divider>
          {loadComment ? (
            <>
              <Skeleton avatar paragraph={{ rows: 4 }} />
              <Skeleton avatar paragraph={{ rows: 4 }} />
              <Skeleton avatar paragraph={{ rows: 4 }} />
            </>
          ) : (
            <>
              {useLogged && (
                <Form name="form_add_comment" onFinish={handleAddComment}>
                  <Form.Item
                    name="comment"
                    rules={[
                      {
                        required: true,
                        message: "Comment can't be empty!",
                      },
                    ]}>
                    <Input.TextArea
                      maxLength={2000}
                      showCount
                      placeholder="Comment Here!"
                    />
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit" block>
                      Reply
                    </Button>
                  </Form.Item>
                </Form>
              )}
              <List
                itemLayout="horizontal"
                dataSource={comment}
                locale={{
                  emptyText: (
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description={<span>Be the first to reply.</span>}
                    />
                  ),
                }}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${item.email}`}
                          style={{ backgroundColor: "#cdcdcd" }}
                        />
                      }
                      title={item.email}
                      description={item.comment}
                    />
                  </List.Item>
                )}
              />
            </>
          )}
        </div>
      </div>

      <FloatButton
        icon={
          like ? <HeartIcon style={{ color: "hotpink" }} /> : <HeartOutlined />
        }
        type="default"
        style={{ right: 24 + 400, bottom: 24 }}
        onClick={(e) => handleLike(e, id, like)}
      />
    </main>
  );
};

export default Post;
