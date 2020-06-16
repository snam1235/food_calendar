const express = require("express");
const router = express.Router();
const dateModel = require("../../models/date");
const foodModel = require("../../models/food");
//render calories-user page only if user is logged in
router.get("/", function (req, res) {
  if (!req.user) {
    req.flash("message", "Login to access this page");
    res.redirect("/");
  } else {
    res.render("calories-user");
  }
});
//gets food data from client and saves the data to mongoDB
router.post("/", async (req, res, next) => {
  let ids = new Array();

  let day;
  // if user did not input a date
  if (req.body.day == "") {
    return res.json({ message: "fail" });
  }
  // save food data to mongoDB
  for (let i = 0; i < req.body.food.length; i++) {
    try {
      let food = new foodModel({
        name: req.body.food[i],
        mass: req.body.mass[i],
        unit: req.body.unit[i],
        carb: req.body.carb[i],
        fat: req.body.fat[i],
        protein: req.body.protein[i],
        calories: req.body.calories[i],
      });
      ids[i] = food._id;
      let savedFood = await food.save();
    } catch (err) {
      console.log(err);
      return next(new Error("Failed to save user for unknown reasons"));
    }
  }
  // populate data model with food data saved.
  const date = await dateModel
    .findOne({ email: req.user.email, date: req.body.day })
    .populate("breakfast")
    .populate("lunch")
    .populate("dinner")
    .exec(function (error, days) {
      if (error) {
        return console.log(error);
      }
      // save according to meal type(breakfast, lunch dinner) when date doesn't exist in database
      if (days == null) {
        if (req.body.meal === "breakfast") {
          day = new dateModel({
            email: req.user.email,
            date: req.body.day,
            breakfast: ids,
            lunch: undefined,
            dinner: undefined,
          });

          day.save(function (error) {
            if (!error) {
              dateModel
                .find({})
                .populate("breakfast")
                .populate("lunch")
                .populate("dinner")
                .exec(function (error, days) {
                  console.log(JSON.stringify(days, null, "\t"));
                  return res.json(days);
                });
            }
          });
        } else if (req.body.meal === "lunch") {
          day = new dateModel({
            email: req.user.email,
            date: req.body.day,
            breakfast: undefined,
            lunch: ids,
            dinner: undefined,
          });
          day.save(function (error) {
            if (!error) {
              dateModel
                .find({})
                .populate("breakfast")
                .populate("lunch")
                .populate("dinner")
                .exec(function (error, days) {
                  console.log(JSON.stringify(days, null, "\t"));
                  return res.json(days);
                });
            }
          });
        } else {
          day = new dateModel({
            email: req.user.email,
            date: req.body.day,
            breakfast: undefined,
            lunch: undefined,
            dinner: ids,
          });
          day.save(function (error) {
            if (!error) {
              dateModel
                .find({})
                .populate("breakfast")
                .populate("lunch")
                .populate("dinner")
                .exec(function (error, days) {
                  console.log(JSON.stringify(days, null, "\t"));
                  return res.json(days);
                });
            }
          });
        }
        //when the data exists in database, update the food data instead of creating a new date object
      } else {
        if (req.body.meal === "breakfast") {
          dateModel
            .findOneAndUpdate(
              { email: req.user.email, date: req.body.day },
              { $set: { breakfast: ids } },
              { new: true }
            )
            .populate("breakfast")
            .populate("lunch")
            .populate("dinner")
            .exec(function (error, days) {
              console.log(JSON.stringify(days, null, "\t"));
              return res.json(days);
            });
        } else if (req.body.meal === "lunch") {
          dateModel
            .findOneAndUpdate(
              { email: req.user.email, date: req.body.day },
              { $set: { lunch: ids } },
              { new: true }
            )
            .populate("breakfast")
            .populate("lunch")
            .populate("dinner")
            .exec(function (error, days) {
              console.log(JSON.stringify(days, null, "\t"));
              return res.json(days);
            });
        } else {
          dateModel
            .findOneAndUpdate(
              { email: req.user.email, date: req.body.day },
              { $set: { dinner: ids } },
              { new: true }
            )
            .populate("breakfast")
            .populate("lunch")
            .populate("dinner")
            .exec(function (error, days) {
              console.log(JSON.stringify(days, null, "\t"));
              return res.json(days);
            });
        }
      }
    });
});

module.exports = router;
