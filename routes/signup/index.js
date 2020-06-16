const express = require("express");
const router = express.Router();
const UserModel = require("../../models/user");
const emailValidator = require("email-validator");

//render html
router.get("/", function (req, res) {
  res.render("signup", { message: "none" });
});

router.post("/", async (req, res) => {
  try {
    //check if user with the email already exists in database
    const preexist = await UserModel.findOne({ email: req.body.email });

    if (preexist) {
      return res.render("signup", {
        message: "User with the email already exists.",
      });
    } else {
      // if email doesn't preexist, create and save user in database
      const user = new UserModel({
        email: req.body.email,

        password: req.body.psw,
      });
      if (emailValidator.validate(req.body.email) != true) {
        return res.render("signup", {
          message: "Please enter a valid email",
        });
      }
      const savedUser = await user.save();
      //redirect to index page and flash appropraite message
      if (savedUser) {
        req.session.id = req.body.email;
        req.flash("message", "Successfully signed up!");
        return res.redirect("/");
      } else {
        return res.render("signup", {
          message: "Failed to save user for unknown reasons",
        });
      }
    }
  } catch (err) {
    console.log(err);
    return res.render("signup", { message: err });
  }
});

module.exports = router;
