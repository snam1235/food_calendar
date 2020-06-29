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
    const box_style = {
      position: "relative",
      fontSize: "30px",
      backgroundColor: "rgba(226, 220, 220, 0.637)",
      width: "200px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      margin: "auto",
      height: "80px"
    };

    if (this.state.redirectTo) {
      console.log("redirecting");
      return <Redirect to={this.state.redirectTo} />;
    } else {
      return (
        <div style={box_style}>
          <AccountCircleIcon style={{ fontSize: 60 }} />
          <a onClick={this.handleLogout}>Logout</a>
        </div>
      );
    }
  }
}

export default Logout;
