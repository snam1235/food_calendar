const UserModel = require("../models/user.js");
const emailValidator = require("email-validator");

module.exports.index = function (req, res) {
  //res.render("signup", { message: "none" });
};

module.exports.check_preexist_user = async function (req, res, next) {
  const preexist = await UserModel.findOne({ email: req.body.email });

  if (preexist) {
    return res.send("User with the email already exists.");
  }
  next();
};

module.exports.signup = async function (req, res) {
  // if email doesn't preexist, create and save user in database
  try {
    const user = new UserModel({
      email: req.body.email,

      password: req.body.psw
    });

    if (emailValidator.validate(req.body.email) != true) {
      return res.send("Please enter valid email");
    }
    const savedUser = await user.save();
    //redirect to index page and flash appropraite message
    if (savedUser) {
      return res.send("Register Complete");
    } else {
      return res.send("Failed to save to unknown reasons");
    }
  } catch (err) {
    return res.send("Server Error");
  }
};
