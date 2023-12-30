import React, { Fragment, useEffect, useState } from "react";
import "./Navbar.css";

import { useNavigate } from "react-router-dom";
import { Button, App, Dropdown, Tooltip } from "antd";
import { UserOutlined, ExclamationOutlined } from "@ant-design/icons";
import axios from "axios";

const NavBar = () => {
  const [useLogged, setLogged] = useState(false);
  const { message, notification } = App.useApp();
  const navigate = useNavigate();

  const Logout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      console.log(refreshToken);
      console.log(await axios.post("http://localhost:8080/logout"), {
        refreshToken,
      });
      axios.defaults.headers.common["Authorization"] = undefined;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      message.success("Logout successfully");
      setLogged(false);
      navigate("/");
      return true;
    } catch (e) {
      message.error("Something went wrong, Try Refeshing.");
      return false;
    }
  };

  const itemUser = [
    {
      key: "logout",
      label: (
        <Button type="link" danger onClick={Logout}>
          Log out
        </Button>
      ),
    },
  ];

  const testLoggedIn = async () => {
    try {
      console.log(
        "trying",
        await axios.get("http://localhost:8080/amiloggedin")
      );
      notification.info({
        message: "You are logged in!",
        placement: "bottomRight",
        // description: "",
      });
      return true;
    } catch (e) {
      console.error(e);
      notification.info({
        message: "You are not logged in!",
        placement: "bottomRight",
        // description: "",
      });
      return false;
    }
  };

  useEffect(() => {
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
  }, []);

  return (
    <Fragment>
      <header>
        <nav className="navigationBar">
          <div style={{ flex: 1 }} />
          {!useLogged ? (
            <Button
              type="text"
              onClick={() => navigate("/login")}
              // style={{ color: "#fff" }}
            >
              Login
            </Button>
          ) : (
            <Dropdown menu={{ items: itemUser }} placement="bottomRight">
              <Button icon={<UserOutlined />} shape="circle" />
            </Dropdown>
          )}
          <Tooltip placement="bottomRight" title={"Am i logged in?"}>
            <Button
              onClick={testLoggedIn}
              type="primary"
              shape="circle"
              icon={<ExclamationOutlined />}
            />
          </Tooltip>
        </nav>
      </header>
    </Fragment>
  );
};

// eslint-disable-next-line react/display-name, import/no-anonymous-default-export
export default (props) => (
  <App>
    <NavBar {...props} />
  </App>
);
