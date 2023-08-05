require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const { createEnemy } = require("./controllers/enemyController");
const { createFood } = require("./controllers/foodController");
const { createEnvironment, getEnvironment } = require("./controllers/environmentController");
const Environment = require("./models/Environment");

app.get("/", async (req, res) => {
  try {
    // Lógica para obtener los datos de alimentos y enemigos desde tu base de datos
    let response = await Environment.find();
    const environmentData = response[0].data;
    const mode = response[0].mode;
    const antCost = response[0].antCost;
    const environmentType = response[0].environmentType;

    res.render("environment", { environmentData, mode, antCost, environmentType });
  } catch (error) {
    console.error("Error al obtener datos de alimentos y enemigos:", error);
    res.status(500).send("Error en el servidor");
  }
});

app.use("/api/environment/", require("./routes/environment"));

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
  createEnvironment();
});


