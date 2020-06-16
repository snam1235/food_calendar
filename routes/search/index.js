const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");
// makes post request to food database API and sends the received data to client side
router.post("/", function (req, res) {
  // urls that makes post request and gets the foodID of each food
  let urls = new Array();
  //stores JSON body needed when making post request to get nutrition facts
  let arr = new Array();
  //API url
  let nutrients = `https://api.edamam.com/api/food-database/nutrients?app_id=e5c14086&app_key=79eb7de743744c10e88f13b79bc70f80`;
  //JSON template
  let str = {
    ingredients: [
      {
        quantity: 0,
        measureURI: "",
        foodId: "",
      },
    ],
  };
  // for each row of user input in table
  for (let i = 0; i < req.body.Foods.length; i++) {
    var food = req.body.Foods[i];

    urls[
      i
    ] = `https://api.edamam.com/api/food-database/parser?ingr=${food}&app_id=e5c14086&app_key=79eb7de743744c10e88f13b79bc70f80`;

    arr[i] = JSON.parse(JSON.stringify(str));

    arr[i].ingredients[0].quantity = req.body.Quantities[i];

    let unit = req.body.Units[i];
    let measure = `http://www.edamam.com/ontologies/edamam.owl#Measure_${unit}`;

    arr[i].ingredients[0].measureURI = measure;
  }
  // first promise gets the foodID of each food with fetch post call
  Promise.all(
    urls.map((url) =>
      fetch(url).then((response) => {
        return response.json();
      })
    )
  )
    .then((data) => {
      let i;
      let j;
      //set foodID
      for (i = 0; i < data.length; i++) {
        arr[i].ingredients[0].foodId = data[i].parsed[0].food.foodId;
      }
      // second promise gets nutrition facts of each food by making fetch post call using foodID found from last API call
      Promise.all(
        arr.map((foods) =>
          fetch(nutrients, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(foods),
          }).then((callback) => {
            return callback.json();
          })
        )
      ).then((result) => {
        res.json(result);
      });
    })
    .catch((error) => {
      res.json({ error: error });
    });
});

module.exports = router;
