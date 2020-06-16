const mongoose = require("mongoose");
const relationship = require("mongoose-relationship");
const bcrypt = require("bcryptjs");

const emailValidator = require("email-validator");

var Schema = mongoose.Schema;

var foodSchema = new Schema({
  name: String,
  mass: String,
  unit: String,
  carb: String,
  fat: String,
  protein: String,
  calories: String,
});

var foodInfo = mongoose.model("foodInfo", foodSchema);

module.exports = foodInfo;
