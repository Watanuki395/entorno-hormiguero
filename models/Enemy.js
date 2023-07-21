const mongoose = require("mongoose");

const enemySchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  antsRequired: {
    type: Number,
    required: true,
  },
  timeRequired: {
    type: Number,
    required: true,
  },
  defeated: {
    type: Boolean,
    required: true,
  },
});

module.exports = new mongoose.model("Enemy", enemySchema);