const foodModel = require("../models/food.js");
const dateModel = require("../models/date.js");

module.exports.index = function (req, res) {
  res.setHeader("Cache-Control", "no-cache, no-store");
  if (!req.user) {
    req.flash("message", "Login to access this page");
    res.redirect("/");
  } else {
    // res.render("calories_user");
  }
};
module.exports.save_food_model = async function (req, res, next) {
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
        calories: req.body.calories[i]
      });
      ids[i] = food._id;
      let savedFood = await food.save();
    } catch (err) {
      return res.json({ message: err });
    }
  }

  res.locals.food_ids = ids;

  next();
};

module.exports.save_date_model = async function (req, res) {
  let day;
  let ids = res.locals.food_ids;
  // populate data model with food data saved.
  const date = await dateModel
    .findOne({ email: req.user.email, date: req.body.day })
    .populate("breakfast")
    .populate("lunch")
    .populate("dinner")
    .exec(function (err, days) {
      if (err) {
        return res.json({ message: err });
      }
      // save according to meal type(breakfast, lunch dinner) when date doesn't exist in database
      if (days == null) {
        if (req.body.meal === "breakfast") {
          day = new dateModel({
            email: req.user.email,
            date: req.body.day,
            breakfast: ids,
            lunch: undefined,
            dinner: undefined
          });

          day.save(function (error) {
            if (!error) {
              dateModel
                .find({})
                .populate("breakfast")
                .populate("lunch")
                .populate("dinner")
                .exec(function (error, days) {
                  if (!error) {
                    return res.json(days);
                  } else {
                    return res.json({ message: err });
                  }
                });
            } else {
              return res.json({ message: err });
            }
          });
        } else if (req.body.meal === "lunch") {
          day = new dateModel({
            email: req.user.email,
            date: req.body.day,
            breakfast: undefined,
            lunch: ids,
            dinner: undefined
          });
          day.save(function (error) {
            if (!error) {
              dateModel
                .find({})
                .populate("breakfast")
                .populate("lunch")
                .populate("dinner")
                .exec(function (error, days) {
                  if (!error) {
                    return res.json(days);
                  } else {
                    return res.json({ message: err });
                  }
                });
            } else {
              return res.json({ message: err });
            }
          });
        } else {
          day = new dateModel({
            email: req.user.email,
            date: req.body.day,
            breakfast: undefined,
            lunch: undefined,
            dinner: ids
          });
          day.save(function (error) {
            if (!error) {
              dateModel
                .find({})
                .populate("breakfast")
                .populate("lunch")
                .populate("dinner")
                .exec(function (error, days) {
                  if (!error) {
                    return res.json(days);
                  } else {
                    return res.json({ message: err });
                  }
                });
            } else {
              return res.json({ message: err });
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
              if (!error) {
                return res.json(days);
              } else {
                return res.json({ message: err });
              }
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
              if (!error) {
                return res.json(days);
              } else {
                return res.json({ message: err });
              }
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
              if (!error) {
                return res.json(days);
              } else {
                return res.json({ message: err });
              }
            });
        }
      }
    });
};
