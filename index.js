require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger'); 


const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, { /* options */ });
const PORT = process.env.PORT || 8080;
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Middleware para pasar la instancia de io a los controladores
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const { createEnvironment, getEnvironment } = require("./controllers/environmentController");
const Environment = require("./models/Environment");


io.on("connection", (socket) => {
  console.log('Cliente conectado:', socket.id);
});


app.get("/", async (req, res) => {
  try {
    res.render("environment");
  } catch (error) {
    console.error("Error al obtener datos de alimentos y enemigos:", error);
    res.status(500).send("Error en el servidor");
  }
});

// Environment
app.use("/api/environment/", require("./routes/environment"));

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


const URI = process.env.MONGODB_URI;

async function connectDB() {
  try {
    await mongoose.connect(URI);
    console.log("Conectado a MongoDB");
  } catch (error) {
    console.error(error);
  }
}

connectDB();

httpServer.listen(PORT, () => {
  console.log(`la aplicacion esta corriendo en http://localhost:${PORT}`);
});


mongoose.connection.once("open", () => {
  createEnvironment('medium', 'desert');
});


