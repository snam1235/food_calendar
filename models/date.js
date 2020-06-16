const mongoose = require("mongoose");
const relationship = require("mongoose-relationship");
const bcrypt = require("bcryptjs");

const emailValidator = require("email-validator");

var Schema = mongoose.Schema;
// date model representing one day of the user. contains entries for breakfast lunch dinner, relatonship set with food model
var dateSchema = new Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    index: { unique: true },
  },
  date: String,
  breakfast: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "foodInfo",
    },
  ],
  lunch: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "foodInfo",
    },
  ],
  dinner: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "foodInfo",
    },
  ],
});

var dateInfo = mongoose.model("date", dateSchema);

module.exports = dateInfo;
