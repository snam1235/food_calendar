const mongoose = require("mongoose");
const relationship = require("mongoose-relationship");
const bcrypt = require("bcryptjs");

const emailValidator = require("email-validator");

var Schema = mongoose.Schema;

const SALT_ROUNDS = 12;
//create user model
var userSchema = new Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    index: { unique: true },
  },

  password: String,
});

userSchema.pre("save", async function preSave(next) {
  const user = this;
  if (!user.isModified("password")) return next();
  try {
    const hash = await bcrypt.hash(user.password, SALT_ROUNDS);
    user.password = hash;
    return next();
  } catch (err) {
    return next(err);
  }
});

userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

var User = mongoose.model("User", userSchema);

module.exports = User;
