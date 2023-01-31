const mongoose = require("mongoose");

const MODELNAME = "chat";

const Schema = new mongoose.Schema({
  name: { type: String },
  content: { type: String },
  date: { type: Date, default: Date.now() },
  organisation: { type: String, trim: true },
  avatar: { type: String },
});

const OBJ = mongoose.model(MODELNAME, Schema);
module.exports = OBJ;
