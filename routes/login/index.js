const express = require("express");
const router = express.Router();
const passport = require("passport");
// render login page and send login failure/success message
router.get("/", function (req, res) {
  m = req.flash("loginMessage")[0];
  return res.render("login", { logins: m });
});

router.post(
  "/",
  (req, res, next) => {
    // if login input is invalid flash error essage
    if (!req.body.email) {
      req.flash("message", "Login Failed: Please enter an email");
      return res.redirect("/");
    } else if (!req.body.password) {
      req.flash("message", "Login Failed: Please enter a password");
      return res.redirect("/");
    }
    next();
  },
  // authenticate login request
  passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/",
    failureFlash: true,
  })
);

module.exports = router;
