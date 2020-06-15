const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

router.post('/', function(req, res) {

    let urls = new Array();
    let arr = new Array();

    let nutrients = `https://api.edamam.com/api/food-database/nutrients?app_id=e5c14086&app_key=79eb7de743744c10e88f13b79bc70f80`;

    let str = {
        ingredients: [
          {
            quantity: 100,
            measureURI: "http://www.edamam.com/ontologies/edamam.owl#Measure_gram",
            foodId: "food_bnbh4ycaqj9as0a9z7h9xb2wmgat"
          }
        ]
      };

    

    for (let i = 0; i < req.body.Foods.length; i++) {
        var food = req.body.Foods[i]
        
      
      
         urls[i] = `https://api.edamam.com/api/food-database/parser?ingr=${food}&app_id=e5c14086&app_key=79eb7de743744c10e88f13b79bc70f80`;
          
          arr[i] = JSON.parse(JSON.stringify(str));
    
          arr[i].ingredients[0].quantity = req.body.Quantities[i]
           
          let unit = req.body.Units[i]
          let measure = `http://www.edamam.com/ontologies/edamam.owl#Measure_${unit}`

          arr[i].ingredients[0].measureURI = measure;

          
          
        
      }
    
      Promise.all(
        urls.map(url =>
          fetch(url).then(response => {
            return response.json();
          })
        )
      ).then(data => {
        let i;
        let j;
        
        for (i = 0; i < data.length; i++) {
          
          arr[i].ingredients[0].foodId = data[i].parsed[0].food.foodId;
        }
        
        
        Promise.all(
          arr.map(foods =>
            fetch(nutrients, {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify(foods)
            }).then(callback => {
              return callback.json();
            })
          )
        )
        .then(result => {
        /*
          req.flash("result",result)
          res.redirect("/")
         */
        
        res.json(result)
        
        });
        
      }).catch((error) => {
        res.json({error:error})
      });
});



module.exports = router