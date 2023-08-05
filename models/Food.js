const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  details: {
    type: String,
    required: false,
  },
  antsRequired: {
    type: Number,
    required: true,
  },
  timeRequired: {
    type: Number,
    required: true,
  },
  foodValue: {
    type: Number,
    required: true,
  },
  recollected: {
    type: Boolean,
    required: true,
  },
  assigned: {
    type: Boolean,
    required: true,
  }
});

module.exports = new mongoose.model("Food", foodSchema);
