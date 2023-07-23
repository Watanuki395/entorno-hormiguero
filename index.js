require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 8080;
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const { createEnemy } = require("./controllers/enemyController");
const { createFood } = require("./controllers/foodController");
const { generateInitialEnvironment } = require("./controllers/entornoController");

app.get("/", (req, res) => {
  res.json({ status: 200, message: "🌱🐜🐜🐜🐜 Entorno en linea 🐜🐜🐜🐜" });
});

app.use("/api/entorno/", require("./routes/entorno"));

const URI = process.env.MONGODB_URI;

async function connectDB() {
  try {
    await mongoose.connect(URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error(error);
  }
}

connectDB();

app.listen(PORT, () => {
  console.log(`la aplicacion esta corriendo en http://localhost:${PORT}`);
});


mongoose.connection.once("open", () => {
  createEnemy();
  createFood();
  generateInitialEnvironment();
});


