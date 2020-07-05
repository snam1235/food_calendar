const passport = require("passport");

module.exports.index = function (req, res) {
  m = req.flash("loginMessage")[0];
  // return res.render("login", { logins: m });
};

module.exports.check_empty_login = function (req, res, next) {
  // if login input is invalid flash error essage
  if (!req.body.email) {
    req.flash("message", "Login Failed: Please enter an email");
    return res.redirect("/");
  } else if (!req.body.password) {
    req.flash("message", "Login Failed: Please enter a password");
    return res.redirect("/");
  }
  next();
};

module.exports.authenticate = passport.authenticate("local", {
  failureRedirect: "/login_fail",
  failureFlash: true
});
