const express = require("express");
const mysql = require("mysql2");
const multer = require("multer");
const path = require("path");

const app = express();

/* DATABASE CONNECTION */
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root123",
  database: "noteshub_db"
});

db.connect(err => {
  if (err) throw err;
  console.log("Database Connected");
});

/* MIDDLEWARE */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

/* VERY IMPORTANT FOR PDF ACCESS */
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* FILE UPLOAD SETUP */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

/* ADD NOTE */
app.post("/addNote", upload.single("file"), (req, res) => {
  const { title, subject, description, type } = req.body;
  const fileName = req.file ? req.file.filename : null;

  const sql = "INSERT INTO notes (title, subject, description, file, type) VALUES (?, ?, ?, ?, ?)";

  db.query(sql, [title, subject, description, fileName, type], (err) => {
    if (err) throw err;
    res.send("Added");
  });
});

/* GET NOTES */
app.get("/notes", (req, res) => {
  db.query("SELECT * FROM notes", (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

/* DELETE */
app.delete("/delete/:id", (req, res) => {
  db.query("DELETE FROM notes WHERE id=?", [req.params.id], () => {
    res.send("Deleted");
  });
});

/* START SERVER */
app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});