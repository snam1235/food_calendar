const express = require("express");
const router = express.Router();
const controller = require("../controllers/login_fail_controller");

router.get("/", controller.fail);

module.exports = router;
