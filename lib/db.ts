import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.MARIADB_HOST || "localhost",
  port: parseInt(process.env.MARIADB_PORT || "3306"),
  user: process.env.MARIADB_USER || "root",
  password: process.env.MARIADB_PASSWORD || "",
  database: process.env.MARIADB_DATABASE || "calendario",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
