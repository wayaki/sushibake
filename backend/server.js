const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const client = new MongoClient(process.env.MONGO_URI);

let db;
let expenses;
let orders;

async function connectDB() {
  await client.connect();
  db = client.db("wayaki_profit");
  expenses = db.collection("expenses");
  orders = db.collection("orders");
  console.log("Connected to MongoDB");
}

app.get("/", (req, res) => {
  res.send("WAYAKI backend is running");
});

/* Expenses */
app.get("/api/expenses", async (req, res) => {
  const data = await expenses.find().sort({ date: -1 }).toArray();
  res.json(data);
});

app.post("/api/expenses", async (req, res) => {
  const expense = req.body;
  const result = await expenses.insertOne(expense);
  res.json({ ...expense, _id: result.insertedId });
});

app.delete("/api/expenses/:id", async (req, res) => {
  await expenses.deleteOne({ _id: new ObjectId(req.params.id) });
  res.json({ success: true });
});

/* Orders */
app.get("/api/orders", async (req, res) => {
  const data = await orders.find().sort({ date: -1 }).toArray();
  res.json(data);
});

app.post("/api/orders", async (req, res) => {
  const order = req.body;
  const result = await orders.insertOne(order);
  res.json({ ...order, _id: result.insertedId });
});

app.delete("/api/orders/:id", async (req, res) => {
  await orders.deleteOne({ _id: new ObjectId(req.params.id) });
  res.json({ success: true });
});

connectDB().then(() => {
  app.listen(process.env.PORT || 3000, () => {
    console.log("Server running");
  });
});