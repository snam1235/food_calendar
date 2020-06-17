module.exports.index = function (req, res) {
  if (!req.user) {
    req.flash("message", "Login to access this page");
    res.redirect("/");
  } else {
    res.render("home");
  }
};
