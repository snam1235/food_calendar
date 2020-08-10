import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import styles from "../css/web.module.css";
import cx from "classnames";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import axios from "axios";
import Swal from "sweetalert2";

class LoginForm extends Component {
  constructor() {
    super();
    this.state = {
      username: "",
      password: "",
      redirectTo: null
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }
  handleSubmit(event) {
    event.preventDefault();
    console.log("handle submit");
    axios
      .post("/login", {
        username: this.state.username,
        password: this.state.password
      })
      .then((response) => {
        console.log(this.state.username);
        console.log(response.data.username);
        if (response.data.username) {
          // update App.js state

          this.props.updateUser({
            loggedIn: true,
            username: response.data.username,
            fromLogout: null
          });
          // update the state to redirect to home

          this.setState({
            redirectTo: "/user"
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: response.data
          });
        }
      })
      .catch((error) => {
        console.log("login error: ");
        console.log(error);
      });
  }
  render() {
    console.log("rendered");
    if (this.state.redirectTo) {
      return <Redirect to={this.state.redirectTo} />;
    } else {
      return (
        <div className={styles.full}>
          <h1 className={styles.heading}>Food Calendar</h1>
          <form>
            <div className={cx(styles.container, styles.login)}>
              <AccountCircleIcon style={{ fontSize: 100 }} />
              <label className={styles.label}>Email</label>
              <input
                type="email"
                name="username"
                className={styles.input}
                value={this.state.username}
                onChange={this.handleChange}
              />
              <label className={styles.label}>Password</label>
              <input
                type="password"
                name="password"
                height="20"
                className={styles.input}
                value={this.state.password}
                onChange={this.handleChange}
              />

              <button
                type="submit"
                className={styles.button}
                onClick={this.handleSubmit}
                id="btn1"
              >
                Sign In
              </button>

              <a href="/signup" className={styles.signup}>
                <button className={styles.button} type="button">
                  Sign up
                </button>
              </a>
            </div>
          </form>
        </div>
      );
    }
  }
}

export default LoginForm;
