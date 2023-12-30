// buat ngecheck auth
import "dotenv/config";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { sqlQuery } from "./database.js";

const generateAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "24h",
  });
};

const addUser = async ({ password, email }) => {
  const hashed_pass = crypto
    .createHash("sha256")
    .update(password)
    .digest("base64");

  const sql = "insert into users (password, email) values (?,?)";

  try {
    const res = await sqlQuery(sql, [hashed_pass, email.toLowerCase()]);
    console.log(res);
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

// return true, or false.
const checkUser = async ({ email, password }) => {
  const hashed_pass = crypto
    .createHash("sha256")
    .update(password)
    .digest("base64");

  console.log(hashed_pass);

  const sql = `
  select id, email from users 
  where email = ? and password = ?`;

  const res = await sqlQuery(sql, [email.toLowerCase(), hashed_pass]);

  // console.log(res[0].username);

  return res[0];
  // return false;
};

// bisa pake database
let refreshTokens = [];

// POST "/token"
export const token = (req, res) => {
  const refreshToken = req.body.token;
  console.log(refreshTokens.includes(refreshToken));
  if (refreshToken == null) return res.sendStatus(401);
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = generateAccessToken({
      id: user.id,
      email: user.email,
    });
    return res.json({ accessToken });
  });
};

// POST "/login"
export const login = async (req, res) => {
  const isUserValid = await checkUser(req.body);
  console.log(isUserValid);
  if (!isUserValid) return res.sendStatus(401);

  const user = {
    id: isUserValid.id,
    email: isUserValid.email,
  };

  const accessToken = generateAccessToken(user);
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
  refreshTokens.push(refreshToken);

  return res.json({
    accessToken,
    refreshToken,
    email: user.email,
  });
};

// POST "/logout"
export const logout = (req, res) => {
  refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
  return res.sendStatus(204);
};

// POST "/signup"
export const signup = async (req, res) => {
  const result = await addUser(req.body);

  if (!result) return res.status(400);
  return res.json({ result });
};

const authUser = (authHeader) => {
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return { result: false, payload: 401 };

  const res = jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    (err, user) => {
      if (err) return { result: false, payload: 403 };
      return {
        result: true,
        payload: { id: user.id, email: user.email },
      };
    }
  );

  return res;
};

// for middleware auth for all user
export const auth = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  const { result, payload } = authUser(authHeader);
  if (!result) return res.sendStatus(payload);
  req.user = payload;
  return next();
};
