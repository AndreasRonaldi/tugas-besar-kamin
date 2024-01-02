import { sqlQuery } from "../util/database.js";
import sharp from "sharp";

// GET "/posts"
export const get_posts = async (req, res) => {
  const sql = `select post.id, title, thumbUrl, email from post join users on users.id = post.id_user`;
  const data = await sqlQuery(sql, []);
  return res.json(data);
};

// GET "/post"
export const get_post = async (req, res) => {
  let { id } = req.query;
  // console.log(id);
  if (!id) return res.status(400);
  // id = parseInt(id);

  const sql = `select post.id, title, ${"`desc`"}, image, email, thumbUrl
  from post join users on users.id = post.id_user where post.id = ?`;

  const sqlSimilarPost = `
  select post.id, title, thumbUrl, email, percentage
  from similar_post	
  join post on post.id = similar_post.id_post_similar
  join users on users.id = post.id_user
  where similar_post.id_post = ?
  `;

  const [dataPost, dataSimilarPost] = await Promise.all([
    sqlQuery(sql, [id]),
    sqlQuery(sqlSimilarPost, [id]),
  ]);

  return res.json({ post: dataPost, similarPost: dataSimilarPost });
};

// GET "/likes"
export const get_likes = async (req, res) => {
  const { id } = req.user;

  const sql = `select * from like_post where id_user = ?`;
  const data = await sqlQuery(sql, [id]);
  return res.json(data);
};

// GET "/like"
export const get_like = async (req, res) => {
  const { id } = req.user;
  const { id_post } = req.query;

  const sql = `select * from like_post where id_user = ? and id_post = ?`;
  const data = await sqlQuery(sql, [id, id_post]);
  return res.json(data.length > 0);
};

// POST "/like"
export const like_post = async (req, res) => {
  const { id } = req.user;
  const { id_post, status } = req.body;

  let sql = "";
  if (status) sql = `DELETE FROM like_post WHERE id_user = ? and id_post = ?`;
  else sql = `insert into like_post (id_user, id_post) values (?, ?)`;

  const data = await sqlQuery(sql, [id, id_post]);
  return res.json(data);
};

// GET "/comment"
export const get_comment = async (req, res) => {
  const { id_post } = req.query;

  const sql = `select email, comment from comment_post 
  join users on users.id = comment_post.id_user 
  where id_post = ?`;
  const data = await sqlQuery(sql, [id_post]);
  return res.json(data);
};

// POST "/comment"
export const add_comment = async (req, res) => {
  const { id } = req.user;
  const { id_post, comment } = req.body;

  const sql = `insert into comment_post (id_user, id_post, comment) values (?, ?, ?)`;
  const data = await sqlQuery(sql, [id, id_post, comment]);
  return res.json(data);
};

const size = 64;

const hammingDistance = (str1, str2) => {
  let dist = 0;
  for (let i = 0; i < str1.length; i += 1) {
    if (str1[i] !== str2[i]) dist += 1;
  }
  return dist;
};

const check_similar = async ({ digest, id }) => {
  // get all post hash
  const sqlPost = `select id, hashimage from post where id != ?`;
  let post = await sqlQuery(sqlPost, [id]);

  // get hamming distance for every post
  post = post
    .map((c) => ({
      id: c.id,
      diff: hammingDistance(digest, c.hashimage),
    }))
    .sort((a, b) => (a.diff !== b.diff ? a.diff - b.diff : a.id - b.id));

  console.log("similar post:", post);

  // add top 3 to similar post
  for (let i = 0; i < post.length && i < 3; i++) {
    const element = post[i];
    const sql = `insert into similar_post (id_post, id_post_similar, percentage) 
    values (?, ?, ?)`;

    const data = await sqlQuery(sql, [
      id,
      element.id,
      1 - element.diff / (size * size),
    ]);
    // console.log(data);
  }

  return true;
};

// POST "/post"
export const add_post = async (req, res) => {
  const { id } = req.user;
  const { image, title, desc } = req.body;

  try {
    // get image data without meta data
    let parts = image.split(";");
    let mimType = parts[0].split(":")[1];
    let imageData = parts[1].split(",")[1];

    var img = Buffer.from(imageData, "base64");

    // get resize and grayscale image
    const imgPromise = sharp(img)
      .resize(size, size, {
        kernel: sharp.kernel.nearest,
        fit: "fill",
      })
      .greyscale();

    const dataImg = await imgPromise.toBuffer(); // image can see
    const data = await imgPromise.raw().toBuffer(); // image can't see but can get color pixel

    console.log(data);

    let total = 0;

    // calc average
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        total += data[i * size + j] / 255;
      }
    }

    const avg = total / (size * size);

    console.log("total: ", total);
    console.log("avg: ", total / (size * size));

    // create hash
    let digest = "";
    for (let i = 0; i < size; i++)
      for (let j = 0; j < size; j++)
        digest = digest + (data[i * size + j] / 255 > avg ? "1" : "0"); // kalau pixel lebih dari average jadi 1

    // for (let i = 0; i < size; i++)
    //   console.log(digest.substring(i * size, (i + 1) * size));

    console.log("disgest len: ", digest.length);

    // create thumbUrl
    const thumbUrl = await sharp(img).resize(500, undefined).toBuffer();
    let resizedThumbUrlData = thumbUrl.toString("base64");
    let ThumbUrlBase64 = `data:${mimType};base64,${resizedThumbUrlData}`;

    // add to database
    const sql = `insert into post (title, id_user, ${"`desc`"}, image, thumbUrl, hashimage) 
    values (?, ?, ?, ?, ?, ?)`;

    const dataSql = await sqlQuery(sql, [
      title,
      id,
      desc,
      image,
      ThumbUrlBase64,
      digest,
    ]);

    console.log("inserted id: ", dataSql["insertId"]);

    // check similar with other post
    await check_similar({ digest, id: dataSql["insertId"] });

    let resizedImageData = dataImg.toString("base64");
    let resizedBase64 = `data:${mimType};base64,${resizedImageData}`;
    res.json({ resizedBase64, ThumbUrlBase64 });
  } catch (error) {
    console.log(error);
    return res.send(error);
  }
};
