import mysql from "mysql";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "kamin",
  typeCast: function castField(field, useDefaultTypeCasting) {
    if (field.type === "BIT" && field.length === 1) {
      var bytes = field.buffer();
      return bytes[0];
    }
    return useDefaultTypeCasting();
  },
});

const dbConnect = () => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, conn) => {
      if (err) reject(err);
      resolve(conn);
    });
  });
};

export const sqlQuery = async (sql, data) => {
  if (!data) data = [];

  const conn = await dbConnect();
  const res = await new Promise((resolve, reject) => {
    conn.query(sql, data, (err, res) => {
      if (err) reject(err);
      resolve(res);
    });
  });

  conn.release();
  return res;
};

export default dbConnect;
