require('dotenv').config()
const express = require('express')
const http = require('http')
const cors = require('cors')
const mongoose = require("mongoose")

const app = express()
const PORT = process.env.PORT || 8080
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({status: 200,
message: "🌱🐜🐜🐜🐜 Entorno en linea 🐜🐜🐜🐜"})
})

app.use("/api/entorno/", require("./routes/entorno"));

const URI = process.env.MONGODB_URI;

async function connect() {
  try {
    await mongoose.connect(URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error(error);
  }
}

connect();

app.listen(PORT, () => {
  console.log(`la aplicacion esta corriendo en http://localhost:${PORT}`);
})