const mongoose = require("mongoose");

const EntornoSchema = new mongoose.Schema({
  entorno: {
    type: String,
    required: true,
  },
});

module.exports = new mongoose.model("Entorno", EntornoSchema);