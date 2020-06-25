const express = require("express");
const router = express.Router();
const controller = require("../controllers/login_controller");

router.get("/", controller.index);

router.post("/", controller.authenticate, function (req, res) {
  console.log("logged in");
  console.log("user is", req.user);
  let user = {
    username: req.user.email,
  };
  res.send(user);
});

module.exports = router;
