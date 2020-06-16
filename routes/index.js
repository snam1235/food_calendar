const express = require("express");
const session = require("express-session");
const router = express.Router();
const calories = require("./calories");
const calories_user = require("./calories-user");
const history = require("./history");
const home = require("./home");
const login = require("./login");
const logout = require("./logout");
const signup = require("./signup");
const search = require("./search");

router.get("/", function (req, res, next) {
  //flash message coming from different routes
  m = req.flash("message")[0];

  if (m) {
    //send message to view
    return res.render("index", { message: m });
  } else {
    return res.render("index", { message: "none" });
  }
});
// join all routes
router.use("/calories", calories);
router.use("/calories-user", calories_user);
router.use("/history", history);
router.use("/home", home);
router.use("/login", login);
router.use("/logout", logout);
router.use("/signup", signup);
router.use("/search", search);

module.exports = router;
