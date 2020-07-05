import React, { Component } from "react";
import { Link } from "react-router-dom";
import styles from "../css/web.module.css";

import AccountCircleIcon from "@material-ui/icons/AccountCircle";

import axios from "axios";
class NavBar extends Component {
  constructor() {
    super();
    this.state = {
      redirectTo: null
    };
    this.handleLogout = this.handleLogout.bind(this);
  }

  handleLogout(event) {
    axios
      .get("/logout")
      .then((response) => {
        this.props.updateUser({
          loggedIn: false,
          username: null
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }
  render() {
    const loggedIn = this.props.loggedIn;

    return (
      <div className={styles.container}>
        {loggedIn ? (
          <>
            <li className={styles.nav_contain}>
              <Link className={styles.nav_text} to="/user">
                Home
              </Link>
            </li>
            <li className={styles.nav_contain}>
              <Link to="/user/calories" className={styles.nav_text}>
                Calories
              </Link>
            </li>
            <li className={styles.nav_contain}>
              <Link to="/user/history" className={styles.nav_text}>
                History
              </Link>
            </li>
            <li className={styles.nav_contain}>
              <AccountCircleIcon style={{ fontSize: 60 }} />
              <Link to="/" onClick={this.handleLogout}>
                Logout
              </Link>
            </li>
          </>
        ) : (
          <>
            <li className={styles.nav_contain}>
              <Link className={styles.nav_text} to="/">
                Home
              </Link>
            </li>
            <li className={styles.nav_contain}>
              <Link to="/calories" className={styles.nav_text}>
                Calories
              </Link>
            </li>
          </>
        )}
      </div>
    );
  }
}

export default NavBar;
