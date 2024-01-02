import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UseLogin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        await axios.get("http://localhost:8080/amiloggedin");
        console.log("logged in!");
      } catch (e) {
        console.log("not logged in!");
        navigate("/");
      }
    })();
  }, []);

  return <></>;
};

export default UseLogin;
