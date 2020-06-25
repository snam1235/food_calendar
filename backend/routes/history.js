const express = require("express");
const router = express.Router();
const controller = require("../controllers/history_controller");
//render history page only if user is logged in
router.get("/", controller.index);
//bring user's food data from mongoDb corresponding to the date entered
router.post("/", controller.show_history);

module.exports = router;
