const express = require("express");
const router = express.Router();
const dateModel = require("../../models/date");
//render history page only if user is logged in
router.get("/", async function (req, res) {
  if (!req.user) {
    req.flash("message", "Login to access this page");
    res.redirect("/");
  } else {
    res.render("history");
  }
});
//bring user's food data from mongoDb corresponding to the date entered
router.post("/", (req, res, next) => {
  const date = dateModel
    .findOne({ email: req.user.email, date: req.body.Date })
    .populate("breakfast")
    .populate("lunch")
    .populate("dinner")
    .exec(function (error, days) {
      if (error) {
        return res.status(401).end();
      } else {
        if (days != null) {
          if (req.body.Meal == "breakfast") {
            return res.json({ message: days.breakfast });
          } else if (req.body.Meal == "lunch") {
            return res.json({ message: days.lunch });
          } else {
            return res.json({ message: days.dinner });
          }
        } else {
          return res.json({ message: "fail" });
        }
      }
    });
});

module.exports = router;
