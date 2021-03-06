const express = require("express");
const router = express.Router();
const controller = require("../controllers/login_controller");

router.post("/", controller.check_empty_login, controller.authenticate);

module.exports = router;
