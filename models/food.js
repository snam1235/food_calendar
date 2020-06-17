const mongoose = require("mongoose");

var Schema = mongoose.Schema;
// food model representing one row in the food calculator table
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
