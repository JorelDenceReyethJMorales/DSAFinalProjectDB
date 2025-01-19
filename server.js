const express = require("express");
const cors = require("cors");
const sql = require("mssql");

const app = express();
const port = process.env.PORT || 8080; // Use the PORT environment variable if set, otherwise default to 8080
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Azure SQL connection configuration
const dbConfig = {
  user: "admin01", // Azure SQL username
  password: "Denreldie10102004", // Azure SQL password
  server: "finalprojectdbzxc.database.windows.net", // Azure SQL server name
  database: "finalprojectdb", // Your database name
  options: {
    encrypt: true, // Use encryption
    trustServerCertificate: true, // Set to true to bypass SSL certificate validation
  },
};

// Middleware
app.use(cors());
app.use(express.json());

// Route to get all posts
app.get("/posts", async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig); // Connect to Azure SQL
    const result = await pool
      .request()
      .query("SELECT * FROM posts ORDER BY date DESC");
    res.json(result.recordset); // Return the query results
  } catch (err) {
    console.error("Error querying the database:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Route to create a new post
app.post("/posts", async (req, res) => {
  const { from, to, content, date } = req.body;

  try {
    const pool = await sql.connect(dbConfig); // Connect to Azure SQL
    const result = await pool
      .request()
      .input("from", sql.NVarChar, from)
      .input("to", sql.NVarChar, to)
      .input("content", sql.NVarChar, content)
      .input("date", sql.DateTime, date)
      .query(
        "INSERT INTO posts (from_name, to_name, content, date) VALUES (@from, @to, @content, @date)"
      );

    res.status(201).json({
      id: result.rowsAffected[0], // Get the affected row count or you can get the inserted ID if needed
      from,
      to,
      content,
      date,
    });
  } catch (err) {
    console.error("Error inserting into the database:", err.message);
    res.status(500).json({ error: err.message });
  }
});
