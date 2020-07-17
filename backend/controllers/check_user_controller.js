module.exports.index = function (req, res) {
  //res.setHeader("Cache-Control", "no-cache, no-store");
  if (!req.user) {
    //req.flash("message", "Login to access this page");
    //res.redirect("/");
    console.log(" at home null");
    res.send(null);
  } else {
    //res.render("home");
    let user = {
      username: req.user.email
    };
    console.log("at home", req.user.email);
    res.send(user);
  }
};
