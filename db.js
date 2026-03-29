const mysql = require("mysql2");

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

module.exports = db;