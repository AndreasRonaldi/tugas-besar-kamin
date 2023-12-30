import "dotenv/config";
import express from "express";
import cors from "cors";

import { auth, login, logout, token, signup } from "./util/auth.js";
import { add_post, get_post, get_posts } from "./api/post.js";

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

app.get("/posts", auth, get_posts);
app.get("/post", auth, get_post);
app.post("/post", auth, add_post);

app.listen(PORT);
