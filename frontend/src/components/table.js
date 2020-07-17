import React, { Component } from "react";
import styles from "../css/calories.module.css";
import { Route } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: []
    };

    this.search = this.search.bind(this);
    this.save = this.save.bind(this);
    this.addInfoRow = this.addInfoRow.bind(this);
    this.getData = this.getData.bind(this);
  }
  componentDidMount() {
    console.log("thisisisis");
    if (this.props.initialTableState === "oneRow") {
      this.setState({
        rows: [
          {
            name: "",
            mass: "",
            unit: "",
            carbs: "",
            fat: "",
            protein: "",
            calories: ""
          }
        ]
      });
    }
  }
  componentDidUpdate(prevProps) {
    if (prevProps.initialTableState !== this.props.initialTableState) {
      let lastRow = document.getElementById("total");
      lastRow.cells[3].innerHTML = "";
      lastRow.cells[4].innerHTML = "";
      lastRow.cells[5].innerHTML = "";
      lastRow.cells[6].innerHTML = "";

      if (this.props.initialTableState === "oneRow") {
        console.log(prevProps.initialTableState);

        this.setState({
          rows: [
            {
              name: "",
              mass: "",
              unit: "",
              carbs: "",
              fat: "",
              protein: "",
              calories: ""
            }
          ]
        });
      } else {
        this.setState({
          rows: []
        });
      }
    }
  }
  unitSelect = () => {
    return (
      <select name="unit">
        <option value="gram">Gram</option>
        <option value="kilogram">Kilogram</option>
        <option value="ounce">Ounce</option>
        <option value="pinch">Pinch</option>
        <option value="liter">Liter</option>
        <option value="fluid_ounce">Fluid Ounce</option>
        <option value="gallon">Gallon</option>
        <option value="pint">Pint</option>
        <option value="milliliter">Milliliter</option>
        <option value="cup">Cup</option>
        <option value="tablespoon">Tablespoon</option>
        <option value="teaspoon">Teaspoon</option>
      </select>
    );
  };

  addRow = () => {
    let newRow = {
      name: "",
      mass: "",
      unit: "",
      carbs: "",
      fat: "",
      protein: "",
      calories: ""
    };
    let currentRows = this.state.rows;
    currentRows.push(newRow);
    this.setState({
      rows: currentRows
    });
  };
  deleteRow = () => {
    if (this.state.rows.length > 1) {
      let currentRows = this.state.rows;
      currentRows.pop();
      this.setState({ rows: currentRows });
    }
  };

  search(event) {
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
          text: "Please enter valid food names"
        });
        return;
      }
      food = food.trim().replace(" ", "%20");
      foods[i] = food;
      units[i] = table.rows[i + 1].cells[2].children[0].value;

      quantities[i] = parseInt(table.rows[i + 1].cells[1].innerHTML);
      //error message if quantity/mass input is invalid
      if (isNaN(quantities[i])) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Please enter valid quantities"
        });
        return;
      }
    }
    // create post body
    let param = { Foods: foods, Quantities: quantities, Units: units };
    const options = {
      method: "post",
      url: "/search",
      data: JSON.stringify(param),
      headers: {
        "Content-Type": "application/json"
      }
    };
    // make post request and fetch response
    axios(options).then((res) => {
      let result = res.data;

      // if response has error message, show to client
      if (result.error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Please enter valid food names"
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

  save() {
    let param = {
      food: [],
      mass: [],
      unit: [],
      carb: [],
      fat: [],
      protein: [],
      calories: [],
      day: document.getElementById("day").value.toString(),
      meal: document.getElementById("meal").value.toString()
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
      method: "post",
      data: JSON.stringify(param),
      url: "/calories_user",
      headers: {
        "Content-Type": "application/json"
      }
    };
    //post request and fetch response
    axios(options)
      .then((res) => {
        return res.data;
      })
      .then((data) => {
        // if server gives fail message, show alert message to client
        if (data.message === "fail") {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Please select a date"
          });
        } else {
          Swal.fire({ icon: "success", title: "Saved!" });
        }
      });
  }
  addInfoRow(infos) {
    let currentRows = this.state.rows;
    let newRow = {
      name: infos.name,
      mass: infos.mass,
      unit: infos.unit,
      carb: infos.carb,
      fat: infos.fat,
      protein: infos.protein,
      calories: infos.calories
    };
    currentRows.push(newRow);
  }
  async getData() {
    //gets user input
    let param = {
      Meal: document.getElementById("meal").value.toString(),
      Date: document.getElementById("day").value.toString()
    };

    const options = {
      method: "post",
      data: JSON.stringify(param),
      headers: {
        "Content-Type": "application/json"
      },
      url: "/history"
    };
    // make post request
    axios(options)
      .then((res) => {
        return res.data;
      })
      .then((data) => {
        // if response is failure show alert message to client

        if (data == null) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed for unknown reason"
          });
        } else if (data.message === "fail") {
          Swal.fire({
            icon: "error",
            title: "Error",
            text:
              "No entries for the selected date and time, please enter another date and time"
          });
        } else {
          // if response is success, show user's food history data in table
          if (document.getElementById("myTable").rows.length > 2) {
            let i = 1;

            for (i; i < document.getElementById("myTable").rows.length; i++) {
              document.getElementById("myTable").deleteRow(1);
            }
          }

          let mealCount = data.message.length;
          let i = 0;

          for (i; i < mealCount - 1; i++) {
            this.addInfoRow(data.message[i]);
          }

          let lastRow = document.getElementById("myTable").rows[
            document.getElementById("myTable").rows.length - 1
          ];
          lastRow.cells[3].innerHTML = data.message[mealCount - 1].carb;
          lastRow.cells[4].innerHTML = data.message[mealCount - 1].fat;
          lastRow.cells[5].innerHTML = data.message[mealCount - 1].protein;
          lastRow.cells[6].innerHTML = data.message[mealCount - 1].calories;
        }
      });
  }
  render() {
    return (
      <div class="container">
        <Route exact path="/user/calories">
          <button
            type="button"
            className={styles.rowButton}
            onClick={this.addRow}
          >
            Add row
          </button>
          <button
            type="button"
            className={styles.rowButton}
            onClick={this.deleteRow}
          >
            Delete Row
          </button>
          <button type="button" className={styles.search} onClick={this.search}>
            Search Nutrition Facts
          </button>
        </Route>
        <table id="myTable" className={styles.table}>
          <tbody>
            <tr>
              <th className={styles.th}>Food Name</th>
              <th className={styles.th}>Mass/Quantity</th>
              <th className={styles.th}>Unit</th>
              <th className={styles.th}>Carbs</th>
              <th className={styles.th}>Fat</th>
              <th className={styles.th}>Protein</th>
              <th className={styles.th}>K Calories</th>
            </tr>

            {this.state.rows.map((row, index) => (
              <tr key={index} className={styles.caloriesRow}>
                <td className={styles.td} name="name" contentEditable="true">
                  {row.name}
                </td>
                <td className={styles.td} name="mass" contentEditable="true">
                  {row.mass}
                </td>
                <td className={styles.td} name="unit">
                  <this.unitSelect />
                </td>
                <td className={styles.td} name="carb">
                  {row.carbs}
                </td>
                <td className={styles.td} name="fat">
                  {row.fat}
                </td>
                <td className={styles.td} name="protein">
                  {row.protein}
                </td>
                <td className={styles.td} name="calories">
                  {row.calories}
                </td>
              </tr>
            ))}

            <tr className={styles.total} id="total">
              <th className={styles.th}>Total</th>
              <td className={styles.td}></td>
              <td className={styles.td}></td>
              <td className={styles.td}></td>
              <td className={styles.td}></td>
              <td className={styles.td}></td>
              <td className={styles.td}></td>
            </tr>
          </tbody>
        </table>

        <Route exact path="/calories">
          <button
            type="button"
            className={styles.rowButton}
            onClick={this.addRow}
          >
            Add row
          </button>
          <button
            type="button"
            className={styles.rowButton}
            onClick={this.deleteRow}
          >
            Delete Row
          </button>
          <button type="button" className={styles.search} onClick={this.search}>
            Search Info
          </button>
        </Route>
        <Route path="/user">
          <div class="container">
            <input type="date" id="day" />
            <select id="meal">
              <option value="none">Select Meal</option>
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
            </select>
            <Route exact path="/user/calories">
              <button id="save" onClick={this.save}>
                Save
              </button>
            </Route>

            <Route exact path="/user/history">
              <button onClick={this.getData} id="find">
                Find Data
              </button>
            </Route>
          </div>
        </Route>
      </div>
    );
  }
}

export default Table;
