import React, { Component } from "react";
import styles from "../css/web.module.css";
import cx from "classnames";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import axios from "axios";
import Swal from "sweetalert2";

class LoginForm extends Component {
  constructor() {
    super();
    //keeps track of user input of username and password
    this.state = {
      username: "",
      password: ""
    };
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };
  handleSubmit = (event) => {
    event.preventDefault();
    console.log("handle submit");
    axios
      .post("/login", {
        username: this.state.username,
        password: this.state.password
      })
      .then((response) => {
        console.log(response);
        if (response.data.username) {
          // update App.js state

          this.props.updateUser({
            loggedIn: true,
            username: response.data.username,
            fromLogout: null
          });
          // update the state to redirect to home
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: response.data
          });
        }
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Error"
        });
      });
  };
  render() {
    return (
      <div className={styles.full}>
        <h1 className={styles.heading}>Food Calendar</h1>
        <form>
          <div className={cx(styles.container, styles.login)}>
            <AccountCircleIcon style={{ fontSize: "6rem" }} />
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

export default LoginForm;
