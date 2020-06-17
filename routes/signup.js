const express = require("express");
const router = express.Router();
const controller = require("../controllers/signup_controller");
//render html
router.get("/", controller.index);

router.post("/", controller.signup);

module.exports = router;
