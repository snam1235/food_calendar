import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import styles from "../css/web.module.css";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import axios from "axios";
import cx from "classnames";
class Logout extends Component {
  constructor() {
    super();
    this.state = {
      redirectTo: null
    };
    this.handleLogout = this.handleLogout.bind(this);
  }

  handleLogout(event) {
    console.log("yoyo");
    axios
      .get("/logout")
      .then((response) => {
        console.log("clicked!");
        this.props.updateUser({
          loggedIn: false,
          username: null
        });
        this.setState({
          redirectTo: "/"
        });
      })
      .catch((error) => {
        console.log("Logout error");
      });
  }
  render() {
    if (this.state.redirectTo) {
      console.log("redirecting");
      return <Redirect to={this.state.redirectTo} />;
    } else {
      return (
        <div className={cx(styles.container, styles.logout_box)}>
          <AccountCircleIcon style={{ fontSize: 100 }} />
          <a onClick={this.handleLogout}>Logout</a>
        </div>
      );
    }
  }
}

export default Logout;
