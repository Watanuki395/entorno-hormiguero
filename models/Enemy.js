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
  completed: {
    type: Boolean,
    required: true,
  },
  assigned: {
    type: Boolean,
    required: true,
  },
  enviroment:{
    type: mongoose.Types.ObjectId,
    ref: "Environment",
    required: true
  }
}, {timestamps:true});

module.exports = new mongoose.model("Enemy", enemySchema);