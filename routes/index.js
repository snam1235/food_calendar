const express = require("express");
const session = require("express-session");
const router = express.Router();
const controller = require("../controllers/index_controller");
router.get("/", controller.index);
// join all routes
router.use("/calories", require("./calories"));
router.use("/calories_user", require("./calories_user"));
router.use("/history", require("./history"));
router.use("/home", require("./home"));
router.use("/login", require("./login"));
router.use("/logout", require("./logout"));
router.use("/signup", require("./signup"));
router.use("/search", require("./search"));

module.exports = router;
