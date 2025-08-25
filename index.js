const express = require("express");
const mysql = require("mysql2");
require("dotenv").config();
const { connectRabbitMQ, publishToQueue } = require("./rabbit/rabbit");
const app = express();
app.use(express.json());

// ✅ Connect RabbitMQ
connectRabbitMQ();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER, 
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

// CRUD
app.get("/users", (req, res) => {
  db.query("SELECT * FROM users", (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result);
  });
});

// ADD user + send event to RabbitMQ
app.post("/users", (req, res) => {
  const { name, email, password } = req.body;
  db.query(
    "INSERT INTO users (name,email,password) VALUES (?,?,?)",
    [name, email, password],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });

      const user = { id: result.insertId, name, email };

      // ✅ publish user_created event to RabbitMQ
      publishToQueue({ event: "user_created", data: user });

      res.json(user);
    }
  );
});


app.listen(3000, () => console.log("Server running on port 3000"));
