module.exports.index = function (req, res) {
  res.setHeader("Cache-Control", "no-cache, no-store");
  if (!req.user) {
    req.flash("message", "Login to access this page");
    res.redirect("/");
  } else {
    res.render("home");
  }
};
