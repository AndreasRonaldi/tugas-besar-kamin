import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import NewPost from "./pages/NewPost";
import Post from "./pages/Post";
import Signup from "./pages/Signup";

function App() {
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
