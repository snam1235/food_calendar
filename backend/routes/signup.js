const express = require("express");
const router = express.Router();
const controller = require("../controllers/signup_controller");
//render html

router.post("/", controller.check_preexist_user, controller.signup);

module.exports = router;
