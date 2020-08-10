import React, { Component } from "react";
import moment from "moment";
import styles from "../css/calendar.module.css";
import Table from "./table";
import axios from "axios";
import { darken } from "@material-ui/core";
import cx from "classnames";
import NavBar from "./navBar";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import { Link } from "react-router-dom";

class Calendar extends Component {
  state = {
    dateContext: moment(),
    today: moment(),
    showMonthPopup: false,
    showYearPopup: false,
    selectedDay: null,
    seen: false,
    route: null,
    meal: null
  };

  constructor(props) {
    super(props);
    this.width = props.width || "350px";
    this.handleLogout = this.handleLogout.bind(this);
  }

  handleLogout(event) {
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
  }
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
    console.log("currentDate: ", this.state.dateContext.get("date"));
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

  onSelectChange = (e, data) => {
    this.setMonth(data);
    this.props.onMonthChange && this.props.onMonthChange();
  };
  SelectList = (props) => {
    let popup = props.data.map((data) => {
      return (
        <div key={data}>
          <a
            href="#"
            onClick={(e) => {
              this.onSelectChange(e, data);
            }}
            style={{ textDecoration: "none", color: "black" }}
          >
            {data}
          </a>
        </div>
      );
    });

    return <div className={styles.month_popup}>{popup}</div>;
  };

  onChangeMonth = (e, month) => {
    this.setState({
      showMonthPopup: !this.state.showMonthPopup
    });
  };

  MonthNav = () => {
    return (
      <span
        id="month"
        className={styles.label_month}
        onClick={(e) => {
          this.onChangeMonth(e, this.month());
        }}
      >
        {this.month()}
        {this.state.showMonthPopup && <this.SelectList data={this.months} />}
      </span>
    );
  };

  showYearEditor = () => {
    this.setState({
      showYearNav: true
    });
  };

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

  onKeyUpYear = (e) => {
    if (e.which === 13 || e.which === 27) {
      this.setYear(e.target.value);
      this.setState({
        showYearNav: false
      });
    }
  };

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
        type="number"
        placeholder="year"
      />
    ) : (
      <span
        className={styles.label_year}
        onClick={(e) => {
          this.showYearEditor();
        }}
        className="year"
      >
        {this.year()}
      </span>
    );
  };
  closeTable = () => {
    this.setState({
      seen: !this.state.seen
    });

    const calendar = document.getElementById("calendar");
    const buttons = document.getElementsByTagName("button");
    const cells = document.getElementsByTagName("td");
    const month = document.getElementById("month");
    const year = document.getElementsByClassName("year");
    const link = document.getElementsByTagName("a");
    const meals = document.getElementsByClassName("meal");
    const monthButtons = document.getElementsByClassName("monthButton");
    month.style.color = "white";
    year[0].style.color = "white";
    calendar.style.backgroundColor = "#faaca8";
    calendar.style.backgroundImage =
      "linear-gradient(19deg, #faaca8 0%, #ddd6f3 100%)";

    for (let i = 0; i < buttons.length; i++) {
      buttons[i].style.color = "white";
      buttons[i].style.backgroundColor = "#faaca8";
      buttons[i].style.backgroundImage =
        "linear-gradient(19deg, #faaca8 0%, #ddd6f3 100%)";
      buttons[i].style.borderColor = "white";
    }
    for (let i = 0; i < cells.length; i++) {
      cells[i].style.color = "white";
    }
    for (let i = 0; i < meals.length; i++) {
      meals[i].disabled = false;
    }
    monthButtons[0].disabled = false;
    monthButtons[1].disabled = false;
    link[0].style.color = "white";
  };

  onDayClick = (e, day) => {
    let dateContext = this.state.dateContext;
    dateContext = moment(dateContext).set("date", day);
    this.setState({
      dateContext: dateContext
    });
    this.setState({
      selectedDay: day
    });
  };
  onMealClick = (e, day) => {
    let dateContext = this.state.dateContext;
    dateContext = moment(dateContext).set("date", day);
    this.setState({
      dateContext: dateContext
    });

    this.setState(
      {
        selectedDay: day
      },
      () => console.log(this.state.dateContext)
    );
    this.setState({
      seen: !this.state.seen
    });
    this.setState({
      meal: e.target.value
    });

    const calendar = document.getElementById("calendar");
    const buttons = document.getElementsByTagName("button");
    const cells = document.getElementsByTagName("td");
    const month = document.getElementById("month");
    const year = document.getElementsByClassName("year");
    const link = document.getElementsByTagName("a");
    const meals = document.getElementsByClassName("meal");
    const monthButtons = document.getElementsByClassName("monthButton");
    month.style.color = "rgba(0,0,0, 0.5)";
    year[0].style.color = "rgba(0,0,0, 0.5)";
    calendar.style.backgroundColor = "rgba(0,0,0, 0.5)";
    calendar.style.backgroundImage = "none";
    for (let i = 0; i < buttons.length; i++) {
      buttons[i].style.color = "rgba(0,0,0, 0.5)";
      buttons[i].style.backgroundColor = "rgba(0,0,0, 0.5)";
      buttons[i].style.backgroundImage = "none";
      buttons[i].style.borderColor = "rgba(0,0,0, 0.5)";
    }
    for (let i = 0; i < cells.length; i++) {
      cells[i].style.color = "rgba(0,0,0, 0.5)";
    }
    for (let i = 0; i < meals.length; i++) {
      meals[i].disabled = true;
    }
    monthButtons[0].disabled = true;
    monthButtons[1].disabled = true;
    link[0].style.color = "rgba(0,0,0, 0.5)";
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

    let blanks = [];
    for (let i = 0; i < this.firstDayOfMonth(); i++) {
      blanks.push(
        <td key={i * 80} className={styles.emptySlot}>
          {""}
        </td>
      );
    }

    let daysInMonth = [];
    for (let d = 1; d <= this.daysInMonth(); d++) {
      let param = {
        Meal: "breakfast",
        Date: ``
      };
      let className =
        d == this.state.today.get("date") &&
        this.state.dateContext.get("year") == this.state.today.get("year") &&
        this.state.dateContext.get("month") == this.state.today.get("month")
          ? cx(styles.day, styles.current_day)
          : styles.day;
      let selectedClass =
        d == this.state.selectedDay ? styles.selected_day : "";
      daysInMonth.push(
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
      );
    }

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

    let trElems = rows.map((d, i) => {
      return <tr key={i * 100}>{d}</tr>;
    });

    return (
      <div id="container" className={styles.container}>
        <div className={styles.calendar_container}>
          <table id="calendar" className={styles.calendar}>
            <thead id="head">
              <tr className={styles.calendar_header}>
                <td colSpan="4">
                  <this.MonthNav id="month" /> <this.YearNav />
                </td>
                <td colSpan="1" className={styles.nav_month}>
                  <button
                    className={cx(styles.button, "monthButton")}
                    onClick={(e) => {
                      this.prevMonth();
                    }}
                  >
                    Previous month
                  </button>
                  <button
                    className={cx(styles.button, "monthButton")}
                    onClick={(e) => {
                      this.nextMonth();
                    }}
                  >
                    Next month
                  </button>
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
