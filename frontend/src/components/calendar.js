import React, { Component } from "react";
import moment from "moment";
import styles from "../css/calendar.module.css";
import Table from "./table";
import axios from "axios";
import cx from "classnames";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import { Link } from "react-router-dom";

class Calendar extends Component {
  state = {
    dateContext: moment(),
    today: moment(),
    showMonthPopup: false,
    showYearNav: false,
    selectedDay: null,
    seen: false,
    route: null,
    meal: null
  };

  constructor(props) {
    super(props);
  }
  //logout and update state of parent component
  handleLogout = (event) => {
    axios
      .get("/logout")
      .then((response) => {
        this.props.updateUser({
          loggedIn: false,
          username: null,
          fromLogout: true
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  weekdays = moment.weekdays(); //["Sunday", "Monday", "Tuesday", "Wednessday", "Thursday", "Friday", "Saturday"]
  weekdaysShort = moment.weekdaysShort(); // ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  months = moment.months();

  year = () => {
    return this.state.dateContext.format("Y");
  };
  month = () => {
    return this.state.dateContext.format("MMMM");
  };
  daysInMonth = () => {
    return this.state.dateContext.daysInMonth();
  };
  currentDate = () => {
    
    return this.state.dateContext.get("date");
  };
  currentDay = () => {
    return this.state.dateContext.format("D");
  };

  firstDayOfMonth = () => {
    let dateContext = this.state.dateContext;
    let firstDay = moment(dateContext).startOf("month").format("d"); // Day of week 0...1..5...6
    return firstDay;
  };
  //changes month of state
  setMonth = (month) => {
    let monthNo = this.months.indexOf(month);
    let dateContext = this.state.dateContext;
    dateContext = moment(dateContext).set("month", monthNo);
    this.setState({
      dateContext: dateContext
    });
  };

  nextMonth = () => {
    let dateContext = this.state.dateContext;
    dateContext = moment(dateContext).add(1, "month");
    this.setState({
      dateContext: dateContext
    });
  };

  prevMonth = () => {
    let dateContext = this.state.dateContext;
    dateContext = moment(dateContext).subtract(1, "month");
    this.setState({
      dateContext: dateContext
    });
  };
  //handles user clicking on the month they choose on the months list
  onSelectChange = (e, data) => {
    this.setMonth(data);
    this.setState({
      showMonthPopup: false
    });
  };
  // months list
  

  onChangeMonth = () => {
    this.setState({
      showMonthPopup:  !this.state.showMonthPopup
    });
  };
  // container for the months list
  MonthNav = () => {
    let popup = this.months.map((data) => {
      return (
        <div key={data} className={styles.month_popup_content}>
          <a
            href="#"
            onClick={(e) => {
              this.onSelectChange(e, data);
            }}
            className = {styles.months}
            style={{ textDecoration: "none", color: "black" }}
          >
            {data}
          </a>
        </div>
      );
    });
    let SelectList =
      <div
        className={styles.month_popup}
        onMouseLeave={(e) => {
          this.setState({
            showMonthPopup: false
          });
        }}
      >
        {popup}
      </div>
    
    return this.state.showMonthPopup ? 
    (
      <div className={styles.month_popup_container}>
      <span
        id="month"
        className={styles.label_month}
       
      >
        {this.month()}
      </span>
    {SelectList}
    </div>
    )
    :
    (
      <span
        id="month"
        className={styles.label_month}
        onMouseEnter={(e) => {
          this.onChangeMonth(e, this.month());
        }}
       
      >
        {this.month()}
        
      </span>
    )
  };
  // triggers year editor
  showYearEditor = () => {
    this.setState({
      showYearNav: !this.state.showYearNav
    });
  };
  // changes year in state to user's choice
  setYear = (year) => {
    let dateContext = this.state.dateContext;
    dateContext = moment(dateContext).set("year", year);
    this.setState({
      dateContext: dateContext
    });
  };
  onYearChange = (e) => {
    this.setYear(e.target.value);
    this.props.onYearChange && this.props.onYearChange(e, e.target.value);
  };
  // handles onKeyUp event of year editor
  onKeyUpYear = (e) => {
    if (e.which === 13 || e.which === 27) {
      this.setYear(e.target.value);
      this.setState({
        showYearNav: false
      });
    }
  };
  // year editor component
  YearNav = () => {
    return this.state.showYearNav ? (
      <input
        defaultValue={this.year()}
        className={cx(styles.editor_year, "year")}
        ref={(yearInput) => {
          this.yearInput = yearInput;
        }}
        onKeyUp={(e) => this.onKeyUpYear(e)}
        onChange={(e) => this.onYearChange(e)}
        onMouseLeave={(e) => {
          this.showYearEditor();
        }}
        type="number"
        placeholder="year"
      />
    ) : (
      <span
        className={styles.label_year}
        onMouseEnter={(e) => {
          this.showYearEditor();
        }}
        className="year"
      >
        {this.year()}
      </span>
    );
  };
  // when user clicks on the close button of table popup, close the popup and return the darkened calendar background back to normal
  closeTable = () => {
   

    const calendar = document.getElementById("calendar");
    const cells = document.getElementsByTagName("td");
    const month = document.getElementById("month");
    const year = document.getElementsByClassName("year");
    const link = document.getElementsByTagName("a");
    const meals = document.getElementsByClassName("meal");
    const header = document.getElementById("header");
    const selected = document.getElementsByClassName(styles.selected_day)[0];
    const current = document.getElementsByClassName(styles.current_day)[0];

    if(selected!=null){
      console.log("selected is null")
      selected.style.backgroundColor = "transparent";
      this.setState({
        seen: false,
        selectedDay: null
      },()=>{
        if(current!=null){
          current.style.backgroundColor = "lightblue";
        }
        header.style.borderColor = "skyblue";
        month.style.color = "white";
        year[0].style.color = "white";
        calendar.style.backgroundImage =
          "url('../images/food4.jpg')";
        calendar.style.backgroundRepeat = "round";
        for (let i = 0; i < cells.length; i++) {
          cells[i].style.color = "white";
        }
        for (let i = 0; i < meals.length; i++) {
          meals[i].disabled = false;
        }
    
        link[2].style.color = "white";

      });
    }
   else{
    this.setState({
      seen: false} ,()=>{

        if(current!=null){
          current.style.backgroundColor = "lightblue";
        }
        header.style.borderColor = "skyblue";
        month.style.color = "white";
        year[0].style.color = "white";
        calendar.style.backgroundImage =
          "url('../images/food4.jpg')";
        calendar.style.backgroundRepeat = "round";
        for (let i = 0; i < cells.length; i++) {
          cells[i].style.color = "white";
        }
        for (let i = 0; i < meals.length; i++) {
          meals[i].disabled = false;
        }
    
        link[2].style.color = "white";


      })
    

   }
  };
  // when user clicks on a date, change the datecontext state to the selected day
  onDayClick = (e, day) => {
    e.preventDefault();
    if(e.target === e.currentTarget){
    let dateContext = this.state.dateContext;
    dateContext = moment(dateContext).set("date", day);
    this.setState({
      dateContext: dateContext
    });

    this.setState({
      selectedDay: day
    });
    }
  };
  // when user clicks on a certain meal of a certain day
  onMealClick = (e, day) => {
    let dateContext = this.state.dateContext;
    dateContext = moment(dateContext).set("date", day);
   
 
    this.setState({
      seen: true,
      dateContext: dateContext,
      meal: e.target.value,
      selectedDay: null
    } , ()=>{ 
  
    
      const calendar = document.getElementById("calendar");
      const cells = document.getElementsByTagName("td");
      const month = document.getElementById("month");
      const year = document.getElementsByClassName("year");
      const link = document.getElementsByTagName("a");
      const meals = document.getElementsByClassName("meal");
      const header = document.getElementById("header");
      //const selected = document.getElementsByClassName(styles.selected_day)[0];
      const current = document.getElementsByClassName(styles.current_day)[0];
 
      header.style.borderColor = "rgba(0,0,0, 0.9)";
      month.style.color = "rgba(0,0,0, 0.5)";
      year[0].style.color = "rgba(0,0,0, 0.5)";
      calendar.style.backgroundColor = "rgba(0,0,0, 0.9)";
     // if(selected!=null){
     //   selected.style.backgroundColor = "rgba(0,0,0, 0.9)";
     // }
      if(current!=null){
        current.style.backgroundColor = "rgba(0,0,0, 0.9)";
      }
      calendar.style.backgroundImage = "none";
  
      for (let i = 0; i < cells.length; i++) {
        cells[i].style.color = "rgba(0,0,0, 0.5)";
      }
      for (let i = 0; i < meals.length; i++) {
        meals[i].disabled = true;
      }
  
      link[2].style.color = "rgba(0,0,0, 0.5)";






    });
 
    
   
  };

  render() {
    // Map the weekdays i.e Sun, Mon, Tue etc as <td>
    let weekdays = this.weekdaysShort.map((day) => {
      return (
        <td key={day} className={styles.week_day}>
          {day}
        </td>
      );
    });
    // empty table slots for slots before the first day of the month
    let blanks = [];
    for (let i = 0; i < this.firstDayOfMonth(); i++) {
      blanks.push(
        <td key={i * 80} className={styles.emptySlot}>
          {""}
        </td>
      );
    }

    let daysInMonth = [];
    //create all day slots of the calendar
    for (let d = 1; d <= this.daysInMonth(); d++) {
      let param = {
        Meal: "breakfast",
        Date: ``
      };
      // different classname for selected day, current day, and other days
      let className =
        d == this.state.today.get("date") &&
        this.state.dateContext.get("year") == this.state.today.get("year") &&
        this.state.dateContext.get("month") == this.state.today.get("month")
          ? cx(styles.day, styles.current_day)
          : styles.day;
      
      let selectedClass =
        d == this.state.selectedDay ? styles.selected_day : "";
      daysInMonth.push(
            this.state.seen ? (
               <td
               key={d}
               className={cx(className, selectedClass)}
             >
               <span>
            {d}
                <button
                  value="breakfast"
                  onClick={(e) => {
                    this.onMealClick(e, d);
                  }}
                  className={cx(styles.darkButton, "meal")}
                >
                  Breakfast
                </button>
                <button
                  value="lunch"
                  onClick={(e) => {
                    this.onMealClick(e, d);
                  }}
                  className={cx(styles.darkButton, "meal")}
                >
                  Lunch
                </button>
                <button
                  value="dinner"
                  onClick={(e) => {
                    this.onMealClick(e, d);
                  }}
                  className={cx(styles.darkButton, "meal")}
                >
                  Dinner
                </button>
                </span>
              </td>
            ) : (
              <td
              key={d}
              onClick={(e) => {
                this.onDayClick(e, d);
              }}
              className={cx(className, selectedClass)}
            >
              <span>
            {d}
                <button
                  value="breakfast"
                  onClick={(e) => {
                    this.onMealClick(e, d);
                  }}
                  className={cx(styles.button, "meal")}
                >
                  Breakfast
                </button>
                <button
                  value="lunch"
                  onClick={(e) => {
                    this.onMealClick(e, d);
                  }}
                  className={cx(styles.button, "meal")}
                >
                  Lunch
                </button>
                <button
                  value="dinner"
                  onClick={(e) => {
                    this.onMealClick(e, d);
                  }}
                  className={cx(styles.button, "meal")}
                >
                  Dinner
                </button>
                </span>
              </td>
            )
      );
    }
    // creates all rows and cells of the calendar
    var totalSlots = [...blanks, ...daysInMonth];
    let rows = [];
    let cells = [];

    totalSlots.forEach((row, i) => {
      if (i % 7 !== 0) {
        cells.push(row);
      } else {
        let insertRow = cells.slice();
        rows.push(insertRow);
        cells = [];
        cells.push(row);
      }
      if (i === totalSlots.length - 1) {
        let insertRow = cells.slice();
        rows.push(insertRow);
      }
    });
    // final output of all table cells
    let trElems = rows.map((d, i) => {
      return <tr key={i * 100}>{d}</tr>;
    });

    return (
      <div id="container" className={styles.container}>
        <div className={styles.calendar_container}>
          <table id="calendar" className={styles.calendar}>
            <thead id="head">
              <tr id="header" className={styles.calendar_header}>
                <td colSpan="1">
                  {" "}
                  {this.state.seen ? (
                    <>
                      <a
                        id="leftArrow"
                        className={cx(styles.darkArrow, styles.left)}
                      ></a>
                      <a
                        id="rightArrow"
                        className={cx(styles.darkArrow, styles.right)}
                      ></a>
                    </>
                  ) : (
                    <>
                      <a
                        id="leftArrow"
                        className={cx(styles.arrow, styles.left)}
                        onClick={(e) => {
                          this.prevMonth();
                        }}
                      ></a>
                      <a
                        id="rightArrow"
                        className={cx(styles.arrow, styles.right)}
                        onClick={(e) => {
                          this.nextMonth();
                        }}
                      ></a>
                    </>
                  )}
                </td>
                <td colSpan="4">
                  <this.MonthNav id="month" /> <this.YearNav />
                </td>

                <td colSpan="1">
                  <AccountCircleIcon style={{ fontSize: "4rem" }} />
                  <Link
                    to="/"
                    onClick={this.handleLogout}
                    style={{
                      fontSize: "2.5rem",
                      textDecoration: "none",
                      color: "white"
                    }}
                    id="link"
                  >
                    Logout
                  </Link>
                </td>
              </tr>
            </thead>
            <tbody>
              <tr>{weekdays}</tr>
              {trElems}
            </tbody>
          </table>
          {this.state.seen ? (
            <Table
              meal={this.state.meal}
              date={this.state.dateContext.format("YYYY-MM-DD")}
              close={this.closeTable}
              className="handle"
            />
          ) : null}
        </div>
      </div>
    );
  }
}

export default Calendar;
