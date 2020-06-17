const express = require("express");
const router = express.Router();
const controller = require("../controllers/search_controller");
// makes post request to food database API and sends the received data to client side
router.post("/", controller.search_nutrition);

module.exports = router;
