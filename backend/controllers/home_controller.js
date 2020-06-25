module.exports.index = function (req, res) {
  //res.setHeader("Cache-Control", "no-cache, no-store");
  if (!req.user) {
    //req.flash("message", "Login to access this page");
    //res.redirect("/");
    res.send("fail");
  } else {
    //res.render("home");
    res.send("success");
  }
};
