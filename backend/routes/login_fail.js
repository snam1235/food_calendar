const express = require("express");
const router = express.Router();
const controller = require("../controllers/login_fail_controller");

router.get(
  "/",
  (res, req) => {
    console.log(" here we at login fail route!");
  },
  controller.fail
);

module.exports = router;
