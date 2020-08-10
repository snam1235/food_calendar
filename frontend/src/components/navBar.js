import React, { Component } from "react";
import { Link } from "react-router-dom";
import styles from "../css/logout.module.css";

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
          username: null,
          fromLogout: true
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }
  render() {
    const loggedIn = this.props.loggedIn;
    if (loggedIn) {
      return (
        <div className={styles.container}>
          <li className={styles.nav_contain}>
            <AccountCircleIcon style={{ fontSize: 60 }} />
            <Link
              to="/"
              style={{ color: "white" }}
              className={styles.logoutLink}
              onClick={this.handleLogout}
            >
              Logout
            </Link>
          </li>
        </div>
      );
    } else {
      return null;
    }
  }
}

export default NavBar;
