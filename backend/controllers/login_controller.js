const passport = require("passport");

module.exports.index = function (req, res) {
  m = req.flash("loginMessage")[0];
  // return res.render("login", { logins: m });
};

module.exports.check_empty_login = function (req, res, next) {
  // if login input is invalid flash error essage
  if (!req.body.username) {
    return res.send("Please enter an email");
  } else if (!req.body.password) {
    return res.send("Please enter a password");
  }
  next();
};

module.exports.authenticate = function (req, res, next) {
  passport.authenticate("local", function (err, user, info) {
    if (err) {
      return res.send(err);
    }
    if (info) {
      console.log(info);
      return res.send(info.message);
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      let User = {
        username: user.email
      };
      res.send(User);
    });
  })(req, res, next);
};
