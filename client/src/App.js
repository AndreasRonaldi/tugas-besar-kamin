import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import NewPost from "./pages/NewPost";
import Post from "./pages/Post";
import Signup from "./pages/Signup";

import axios from "axios";
import { useEffect } from "react";

function isTokenExpired(token) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  const { exp } = JSON.parse(jsonPayload);
  const expired = Date.now() >= exp * 1000;
  return expired;
}

function App() {
  useEffect(() => {
    // set access token when reloading page
    (() => {
      console.log("set access token!");
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken)
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${accessToken}`;
    })();

    // set if access token expired & there's refresh token
    axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const status = error.response ? error.response.status : null;

        if (status === 403) {
          const token =
            axios.defaults.headers.common["Authorization"]?.split(" ")[1];
          const refreshToken = localStorage.getItem("refreshToken");

          if (refreshToken && token && isTokenExpired(token)) {
            console.log("GETTING NEW TOKEN");

            try {
              axios.defaults.headers.common["Authorization"] = undefined;

              const { data } = await axios.post("http://localhost:8080/token", {
                token: refreshToken,
              });

              axios.defaults.headers.common[
                "Authorization"
              ] = `Bearer ${data.accessToken}`;

              error.config.headers[
                "Authorization"
              ] = `Bearer ${data.accessToken}`;

              // return axios.request(error.config); // retry api call
              return Promise.resolve(error.config);
            } catch (e) {
              console.error(e);
              return Promise.reject();
            }
          }
        }

        return Promise.reject(error);
      }
    );
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/post/:id" element={<Post />} />
      {/* 👈 Renders at /localhost:3000/ */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/new-post" element={<NewPost />} />
    </Routes>
  );
}

export default App;
