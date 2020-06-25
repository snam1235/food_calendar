const express = require("express");
const router = express.Router();
const controller = require("../controllers/calories_user_controller");

//render calories-user page only if user is logged in
router.get("/", controller.index);
//gets food data from client and saves the data to mongoDB
router.post("/", controller.save_food_model, controller.save_date_model);

module.exports = router;
