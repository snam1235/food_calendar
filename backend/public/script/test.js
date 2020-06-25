/*const fetch = require("node-fetch");

let url = `https://api.edamam.com/api/food-database/parser?ingr=apple&app_id=e5c14086&app_key=79eb7de743744c10e88f13b79bc70f80`;

fetch(url)
  .then((res) => {
    return res.json();
  })
  .then((data) => {
    console.log(data);
  });

console.log("hihi");
*/

function one() {
  let k = 0;
  for (let i = 0; i < 1000000000; i++) {
    k = k + 10;
  }
  console.log(k);
}

function two() {
  console.log("hihi");
}

one();
two();
