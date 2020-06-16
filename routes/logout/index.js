const express = require("express");
const router = express.Router();
// logout user
router.get("/", function (req, res) {
  req.logout();
  return res.redirect("/");
});

module.exports = router;
