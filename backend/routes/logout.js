const express = require("express");
const router = express.Router();
const controller = require("../controllers/logout_controller");
// logout user
router.get("/", controller.logout);

module.exports = router;
