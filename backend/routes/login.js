const express = require("express");
const router = express.Router();
const controller = require("../controllers/login_controller");

router.post(
  "/",
  controller.check_empty_login,
  controller.authenticate,
  function (req, res) {
    if (req.user) {
      console.log("yes user");

      let user = {
        username: req.user.email
      };
      res.send(user);
    } else {
      console.log("nooo user");
      console.log(req.flash("message"));
      res.send(req.flash("message"));
    }
  }
);

module.exports = router;
