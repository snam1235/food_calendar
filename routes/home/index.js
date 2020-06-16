const express = require("express");
const router = express.Router();
//render user home page only if user is logged in
router.get("/", function (req, res) {
  if (!req.user) {
    req.flash("message", "Login to access this page");
    res.redirect("/");
  } else {
    res.render("home");
  }
});

module.exports = router;
