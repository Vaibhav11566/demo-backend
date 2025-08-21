// db.js
import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,      // e.g. localhost
  user: process.env.DB_USER,      // e.g. root
  password: process.env.DB_PASS,  // your MySQL password
  database: process.env.DB_NAME,  // your DB name
  port: process.env.DB_PORT || 3306,
});

db.connect((err) => {
  if (err) {
    console.error("❌ DB connection failed:", err.message);
  } else {
    console.log("✅ Connected to MySQL Database");
  }
});

export default db;