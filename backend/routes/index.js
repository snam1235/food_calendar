const express = require("express");
const router = express.Router();

// join all routes
router.use("/calories_user", require("./calories_user"));
router.use("/history", require("./history"));
router.use("/check_user", require("./check_user"));
router.use("/login", require("./login"));
router.use("/logout", require("./logout"));
router.use("/signup", require("./signup"));
router.use("/search", require("./search"));
module.exports = router;
