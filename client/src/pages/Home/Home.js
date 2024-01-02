import React, { useEffect, useState } from "react";
import "./Home.css";
import Navbar from "../../component/Navbar";
import { Avatar, Card, Image, FloatButton } from "antd";
import { HeartOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const { Meta } = Card;

const images = [
  {
    image: "https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png",
    title: "Europe Street beat",
    description: "you can buy it at www.instagram.com",
  },
  {
    image:
      "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
    title: "Sipping a coffee",
    description: "Nice Coffee!",
  },
  {
    image:
      "https://gw.alipayobjects.com/zos/antfincdn/x43I27A55%26/photo-1438109491414-7198515b166b.webp",
    title: "Gotcha!",
    description: "I got your face in my camera now!",
  },
  {
    image:
      "https://gw.alipayobjects.com/zos/antfincdn/LlvErxo8H9/photo-1503185912284-5271ff81b9a8.webp",
    title: "Am i pretty?",
    description: "Rate my look pls",
  },
  {
    image:
      "https://gw.alipayobjects.com/zos/antfincdn/cV16ZqzMjW/photo-1473091540282-9b846e7965e3.webp",
    title: "Cool looking photo",
    description: "This is cool right?",
  },
];

const Home = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  const getData = async () => {
    try {
      const { data } = await axios.get("http://localhost:8080/posts");
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
    <>
      <Navbar />
      <div className="wrapperHome">
        {new Array(3).fill().map((c, idx) => (
          <div className="wrapperPost" key={idx}>
            {data
              .filter((_, i) => i % 3 === idx)
              .map((c, i) => (
                <Card
                  key={i}
                  hoverable
                  onClick={() => navigate(`/post/${c.id}`)}
                  style={{ maxWidth: "500px" }}
                  actions={[<HeartOutlined key="heart" />]}>
                  <Meta
                    avatar={
                      <Avatar
                        src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${c.email}`}
                      />
                    }
                    title={c.title}
                    description={c.email}
                  />
                  <div className="wrapperImg">
                    <Image
                      alt="example"
                      src={c.thumbUrl}
                      height="100%"
                      preview={false}
                    />
                  </div>
                </Card>
              ))}
          </div>
        ))}
      </div>

      <FloatButton
        icon={<PlusOutlined />}
        type="default"
        style={{ right: 24 }}
        onClick={() => navigate("/new-post")}
      />
    </>
  );
};

export default Home;
