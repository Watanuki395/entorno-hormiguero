const mongoose = require("mongoose");

const environmentSchema = new mongoose.Schema({
  data: {
    type: Array,
    required: true,
  },
  mode: {
    type: String,
    enum: ["easy", "medium", "hard"], // Nivel de dificultad: "easy", "medium" o "hard"
    required: true,
  },
  antCost: {
    type: Number,
    required: true,
  },
  environmentType: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    required: true,
  }
},{timestamps:true});

module.exports = new mongoose.model("Environment", environmentSchema);