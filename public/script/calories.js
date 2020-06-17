
//function that enables table cells to be editable
function load() {
  let i;

  for (i = 0; i < 2; i++) {
    document
      .getElementsByTagName("td")
      [i].setAttribute("contenteditable", "true");
  }
}
//adds a row to table and sets corresponding attributes
function addRow() {
  let table = document.getElementById("myTable");
  let len = table.rows.length;

  let lastRow = table.insertRow(len - 1);

  let j;

  var element = lastRow.insertCell(0);
  element.setAttribute("name", "name");

  element = lastRow.insertCell(1);
  element.setAttribute("name", "mass");

  element = lastRow.insertCell(2);
  var select = document.createElement("select");
  select.setAttribute("name", "unit");

  var units = [
    "Gram",
    "Kilogram",
    "Ounce",
    "Pinch",
    "Liter",
    "Fluid Ounce",
    "Gallon",
    "Pint",
    "Milliliter",
    "Cup",
    "Tablespoon",
    "Teaspoon",
  ];

  for (let i = 0; i < units.length; i++) {
    var option = document.createElement("option");

    option.value = units[i].toLowerCase();
    option.text = units[i];
    select.appendChild(option);
  }

  element.appendChild(select);

  element = lastRow.insertCell(3);
  element.setAttribute("name", "carb");

  element = lastRow.insertCell(4);
  element.setAttribute("name", "fat");

  element = lastRow.insertCell(5);
  element.setAttribute("name", "protein");

  element = lastRow.insertCell(6);
  element.setAttribute("name", "calories");

  let i;

  for (i = 2; i < table.rows.length - 1; i++) {
    for (let j = 0; j < 2; j++) {
      table.rows[i].cells[j].setAttribute("contenteditable", "true");
    }
  }
}
function deleteRow() {
  let table = document.getElementById("myTable");
  let len = table.rows.length;

  if (len >= 4) document.getElementById("myTable").deleteRow(len - 1);
}
// this function saves the searched nutrition facts to the database for each user
function save() {
  let param = {
    food: [],
    mass: [],
    unit: [],
    carb: [],
    fat: [],
    protein: [],
    calories: [],
    day: document.getElementById("day").value.toString(),
    meal: document.getElementById("meal").value.toString(),
  };

  let len = document.getElementsByName("name").length;

  let names = document.getElementsByName("name");
  let masses = document.getElementsByName("mass");
  let units = document.getElementsByName("unit");
  let carbs = document.getElementsByName("carb");
  let fats = document.getElementsByName("fat");
  let proteins = document.getElementsByName("protein");
  let calories = document.getElementsByName("calories");
  let i = 0;
  //create post body
  for (i; i < len; i++) {
    param.food.push(names[i].innerHTML);
    param.mass.push(masses[i].innerHTML);
    param.unit.push(units[i].value);
    param.carb.push(carbs[i].innerHTML);
    param.fat.push(fats[i].innerHTML);
    param.protein.push(proteins[i].innerHTML);
    param.calories.push(calories[i].innerHTML);
  }

  const options = {
    method: "POST",
    body: JSON.stringify(param),
    headers: {
      "Content-Type": "application/json",
    },
  };
//post requrest and fetch response
  fetch("/calories-user", options)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
    // if server gives fail message, show alert message to client
      if (data.message == "fail") {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Please select a date",
        });
      } else {
        Swal.fire({ icon: "success", title: "Saved!" });
      }
    });
}
// this function makes a 3rd party API call to a food database to get nutritient facts for user's food input
function search() {
  let foods = [];
  let units = [];
  let quantities = [];
  let table = document.getElementById("myTable");
  let totalCarb = 0;
  let totalPro = 0;
  let totalFat = 0;
  let totalCal = 0;

  for (let i = 0; i < table.rows.length - 2; i++) {
    let food = table.rows[i + 1].cells[0].innerHTML;
    //error message if food name is invalid
    if (food.includes("&nbsp") || food.length <= 0) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please enter valid food names",
      });
      return;
    }
    food = food.trim().replace(" ", "%20");
    foods[i] = food;
    units[i] = table.rows[i + 1].cells[2].children[0].value;

    quantities[i] = parseInt(table.rows[i + 1].cells[1].innerHTML);
    //error message if quantity/mass input is invalid
    if (typeof quantities[i] != "number") {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please enter valid quantities",
      });
      return;
    }
  }
// create post body 
  let param = { Foods: foods, Quantities: quantities, Units: units };
  const options = {
    method: "POST",
    body: JSON.stringify(param),
    headers: {
      "Content-Type": "application/json",
    },
  };
// make post request and fetch response
  fetch("/search", options)
    .then((res) => {
      return res.json();
    })
    .then((result) => {
      // if response has error message, show to client
      if (result.error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Please enter valid food names",
        });

        return;
      }
      // else post response data from API to client
      for (let i = 0; i < result.length; i++) {
        let row = table.rows[i + 1];

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
      // total nutrition
      let lastRow = document.getElementById("total");
      lastRow.cells[3].innerHTML = totalCarb.toFixed(2) + "g";
      lastRow.cells[4].innerHTML = totalFat.toFixed(2) + "g";
      lastRow.cells[5].innerHTML = totalPro.toFixed(2) + "g";
      lastRow.cells[6].innerHTML = totalCal.toFixed(2) + "kcal";
    });
}
