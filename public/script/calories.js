let api;
let url = `https://api.edamam.com/api/food-database/nutrients?app_id=e5c14086&app_key=79eb7de743744c10e88f13b79bc70f80`;

let nutrients = `https://api.edamam.com/api/food-database/nutrients?app_id=e5c14086&app_key=79eb7de743744c10e88f13b79bc70f80`;





function load() {
 
  let i;

  for (i = 0; i < 2; i++) {
    document
      .getElementsByTagName("td")
      [i].setAttribute("contenteditable", "true");
  }

 
}

function addRow() {
  let table = document.getElementById("myTable");
  let len = table.rows.length;

  let lastRow = table.insertRow(len - 1);

  let j;

  
    var element = lastRow.insertCell(0)
    element.setAttribute("name","name")

    element = lastRow.insertCell(1)
    element.setAttribute("name","mass")

    element = lastRow.insertCell(2)
    var select = document.createElement("select")
    select.setAttribute("name","unit")

    var option1 = document.createElement("option")
    option1.value = "gram"
    option1.text = "gram"
    select.appendChild(option1)

    var option2 = document.createElement("option")
    option2.value = "ounce"
    option2.text = "ounce"
    select.appendChild(option2)

    var option3 = document.createElement("option")
    option3.value = "pound"
    option3.text = "pound"
    select.appendChild(option3)

    var option4 = document.createElement("option")
    option4.value = "kilogram"
    option4.text = "kilogram"
    select.appendChild(option4)

    element.appendChild(select)
    

    element = lastRow.insertCell(3)
    element.setAttribute("name","carb")

    element = lastRow.insertCell(4)
    element.setAttribute("name","fat")

   element = lastRow.insertCell(5)
    element.setAttribute("name","protein")

    element = lastRow.insertCell(6)
    element.setAttribute("name","calories")
 
  

  let i;

  for (i = 2; i < table.rows.length - 1; i++) {
    for (let j = 0; j < 2; j++) {
      table.rows[i].cells[j].setAttribute("contenteditable", "true");
    }
  }
}

function search() {
  let table = document.getElementById("myTable");
  let urls = new Array();
  let arr = new Array();
  let totalCarb = 0;
  let totalPro = 0;
  let totalFat = 0;
  let totalCal = 0;
  let index = new Array();

  let str = {
    ingredients: [
      {
        quantity: 100,
        measureURI: "http://www.edamam.com/ontologies/edamam.owl#Measure_gram",
        foodId: "food_bnbh4ycaqj9as0a9z7h9xb2wmgat"
      }
    ]
  };

  let j = 0;

  for (let i = 0; i < table.rows.length - 2; i++) {
    var food = table.rows[i + 1].cells[0].innerHTML
    
    food = food.trim().replace(" ","%20")
  
    if (food.length !== 0) {
      urls[
        j
      ] = `https://api.edamam.com/api/food-database/parser?ingr=${food}&app_id=e5c14086&app_key=79eb7de743744c10e88f13b79bc70f80`;

      arr[j] = JSON.parse(JSON.stringify(str));

      arr[j].ingredients[0].quantity = parseInt(
        table.rows[i + 1].cells[1].innerHTML
      );

      var unit = table.rows[i + 1].cells[2].children[0].value
     
      var measure = `http://www.edamam.com/ontologies/edamam.owl#Measure_${unit}`;
      arr[j].ingredients[0].measureURI = measure;
      index[j] = i + 1;
      j++;
    }
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
      let row = table.rows[i];
      arr[i].ingredients[0].foodId = data[i].parsed[0].food.foodId;
    }

    console.log(arr);
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
      console.log(result);
      for (let i = 0; i < result.length; i++) {
        let row = table.rows[index[i]];
        
        row.cells[3].innerHTML =
          result[i].totalNutrients.CHOCDF.quantity.toFixed(2) +
          result[i].totalNutrients.CHOCDF.unit;
        row.cells[4].innerHTML =
          result[i].totalNutrients.FAT.quantity.toFixed(2) +
          result[i].totalNutrients.FAT.unit;
        row.cells[5].innerHTML =
          result[i].totalNutrients.PROCNT.quantity.toFixed(2) +
          result[i].totalNutrients.PROCNT.unit;
        row.cells[6].innerHTML =
          result[i].totalNutrients.ENERC_KCAL.quantity.toFixed(2) +
          result[i].totalNutrients.ENERC_KCAL.unit;
        totalCarb += parseFloat(
          result[i].totalNutrients.CHOCDF.quantity.toFixed(2)
        );
        totalFat += parseFloat(
          result[i].totalNutrients.FAT.quantity.toFixed(2)
        );

        totalPro += parseFloat(
          result[i].totalNutrients.PROCNT.quantity.toFixed(2)
        );
        totalCal += parseFloat(
          result[i].totalNutrients.ENERC_KCAL.quantity.toFixed(2)
        );
      }

      let lastRow = document.getElementById("total");
      lastRow.cells[3].innerHTML = totalCarb.toFixed(2) + "g";
      lastRow.cells[4].innerHTML = totalFat.toFixed(2) + "g";
      lastRow.cells[5].innerHTML = totalPro.toFixed(2) + "g";
      lastRow.cells[6].innerHTML = totalCal.toFixed(2) + "kcal";
    });
  }).catch(function(){

    alert("Error: Please enter valid values")

  })
}

function save(){

  let param = {food:[], mass:[], unit:[],carb:[],fat:[],protein:[],calories:[],day:document.getElementById("day").value.toString()
,meal:document.getElementById("meal").value.toString()}

  let len = document.getElementsByName("name").length

  let names = document.getElementsByName("name")
  let masses = document.getElementsByName("mass")
  let units = document.getElementsByName("unit")
  let carbs = document.getElementsByName("carb")
  let fats = document.getElementsByName("fat")
  let proteins = document.getElementsByName("protein")
  let calories = document.getElementsByName("calories")
  let i=0;
  for(i;i<len;i++){
param.food.push(names[i].innerHTML)
param.mass.push(masses[i].innerHTML)
param.unit.push(units[i].value)
param.carb.push(carbs[i].innerHTML)
param.fat.push(fats[i].innerHTML)
param.protein.push(proteins[i].innerHTML)
param.calories.push(calories[i].innerHTML)
  }

  const options = {method: 'POST',body: JSON.stringify(param), headers: {
    "Content-Type": "application/json"
  }}

  fetch('/calories-user',options)
  .then(res =>{ return res.json()})        
  .then(data => {
    if(data.message=="fail"){
  alert("Please select a date")
    }
    else{
      alert("Successfully saved!")
    }
  })



}