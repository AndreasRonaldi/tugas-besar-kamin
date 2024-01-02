import "dotenv/config";
import express from "express";
import cors from "cors";

import { auth, login, logout, token, signup } from "./util/auth.js";
import {
  add_post,
  get_post,
  get_posts,
  like_post,
  get_likes,
  get_like,
  get_comment,
  add_comment,
} from "./api/post.js";

const PORT = 8080;
const app = express();

app.use(cors());
app.use(express.json({ limit: "100mb" }));

// Authentication
app.post("/token", token);
app.post("/login", login);
app.post("/logout", auth, logout);
app.post("/signup", signup);

app.get("/amiloggedin", auth, (_, res) => res.json({ msg: "yes" }));

app.get("/posts", get_posts); // GET ALL POST
app.get("/post", get_post); // GET SINGLE POST
app.post("/post", auth, add_post); // ADD NEW POST

app.get("/likes", auth, get_likes);
app.get("/like", auth, get_like);
app.post("/like", auth, like_post); // LIKE / DISLIKE POST

app.get("/comment", get_comment);
app.post("/comment", auth, add_comment);

app.listen(PORT);
