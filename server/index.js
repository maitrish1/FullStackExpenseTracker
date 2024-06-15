const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Babadook@gublu11",
  database: "expenses",
});

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.json("Server running bro");
});

app.get("/getExpense/:id", (req, res) => {
  let id = req.params.id;
  console.log(id)
  const q = "SELECT * FROM expenses WHERE id=?";
  db.query(q, [id], (err, data) => {
    if (err) {
      return res.json(err);
    }
    return res.json(data[0]);
  });
});

app.get("/expenses", (req, res) => {
  const q = "SELECT * FROM expenses";
  db.query(q, (err, data) => {
    if (err) {
      return res.json(err);
    }
    return res.json(data);
  });
});

app.post("/addExpense", (req, res) => {
  const q = "INSERT INTO expenses (`amount`,`desc`,`category`) VALUES (?)";
  const values = [req.body.amount, req.body.desc, req.body.category];
  db.query(q, [values], (err, data) => {
    if (err) return res.json(err);
    return res.json("Expense has been added");
  });
});

app.put("/editExpense/:id", (req, res) => { // Changed from post to put
  const expenseId = req.params.id;
  const q = "UPDATE expenses SET `amount`=?, `desc`=?, `category`=? WHERE id=?";
  const values = [req.body.amount, req.body.desc, req.body.category];
  db.query(q, [...values, expenseId], (err, data) => {
    if (err) return res.json(err);
    return res.json("Expense has been updated.");
  });
});

app.delete("/deleteExpense/:id", (req, res) => {
  const id = req.params.id;
  const q = "DELETE FROM expenses WHERE id=?";

  db.query(q, [id], (err, data) => {
    if (err) return res.json(err);
    return res.json("expense has been deleted.");
  });
});

app.listen(8800, () => {
  console.log("Backend started bro");
});
