const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

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
// pre-function to activate when "save" is called
userSchema.pre("save", async function preSave(next) {
  const user = this;
  if (!user.isModified("password")) return next();
  try {
    //hashes passwords with 12 salt rounds
    const hash = await bcrypt.hash(user.password, SALT_ROUNDS);
    user.password = hash;
    return next();
  } catch (err) {
    return next(err);
  }
});
// compare password function
userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

var User = mongoose.model("User", userSchema);

module.exports = User;
