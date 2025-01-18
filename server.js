const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();

const db = mysql.createConnection({
    host: "finalprojectdbzxc.database.windows.net", // Azure MySQL server name
    user: "admin01", // Azure MySQL username
    password: "Denreldie10102004", // Azure MySQL password
    database: "finalprojectdb", // Your database name
    ssl: {
      rejectUnauthorized: false // Ensure SSL is enabled
    }
  });
  

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err.stack);
    return;
  }
  console.log("Connected to MySQL as id " + db.threadId);
});

// Middleware
app.use(cors());
app.use(express.json());

// Route to get all posts
app.get("/posts", (req, res) => {
  db.query("SELECT * FROM posts ORDER BY date DESC", (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Route to create a new post
app.post("/posts", (req, res) => {
  const { from, to, content, date } = req.body;

  // Insert the new post into the database
  const query =
    "INSERT INTO posts (from_name, to_name, content, date) VALUES (?, ?, ?, ?)";
  db.query(query, [from, to, content, date], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.status(201).json({
      id: result.insertId,
      from,
      to,
      content,
      date,
    });
  });
});

const port = process.env.PORT || 8080;  // Azure assigns a dynamic port via the PORT variable
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
