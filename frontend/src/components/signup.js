import React, { Component } from "react";
import styles from "../css/signup.module.css";
import cx from "classnames";
import axios from "axios";
import Swal from "sweetalert2";
import { Redirect, Link } from "react-router-dom";
class Signup extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      psw: "",
      pswCheck: "",
      redirectTo: null
    };
  }

  myChangeHandler = (event) => {
    let name = event.target.name;
    let val = event.target.value;

    this.setState({ [name]: val });
  };
  handleSubmit = (event) => {
    event.preventDefault();
    if (this.state.pswCheck !== this.state.psw) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Passwords do not match"
      });
      return;
    }
    const body = { email: this.state.email, psw: this.state.psw };

    const options = {
      method: "post",
      url: "/signup",
      data: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json"
      }
    };

    axios(options)
      .then((res) => {
        return res.data;
      })
      .then((data) => {
        if (data === "Register Complete") {
          this.setState({ redirectTo: "/" });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: data
          });
        }
      });
  };
  render() {
    if (this.state.redirectTo) {
      return (
        <Redirect
          to={{ pathname: "/", state: { message: "Register Complete" } }}
        ></Redirect>
      );
    }
    return (
      <form className={styles.myForm} onSubmit={this.handleSubmit}>
        <div className={styles.container}>
          <h1>Sign Up</h1>
          <p>Please fill in this form to create an account.</p>
          <hr className={styles.theme} />

          <label for="email">
            <b>Email</b>
          </label>
          <input
            type="text"
            className={styles.email}
            placeholder="Enter Email"
            name="email"
            required
            onChange={this.myChangeHandler}
          />

          <label for="psw">
            <b>Password</b>
          </label>
          <input
            type="password"
            placeholder="Enter Password"
            className={styles.password}
            name="psw"
            required
            onChange={this.myChangeHandler}
            oninput="check_pass()"
          />

          <label for="psw-repeat">
            <b>Repeat Password</b>
          </label>
          <input
            type="password"
            placeholder="Repeat Password"
            className={styles.password}
            id="passcheck"
            name="pswCheck"
            required
            onChange={this.myChangeHandler}
          />

          <div className={styles.clearfix}>
            <Link to="/">
              <button
                className={cx(styles.button, styles.cancelbtn)}
                type="button"
              >
                Cancel
              </button>
            </Link>
            <button
              className={cx(styles.button, styles.signupbtn)}
              type="submit"
              id="submit"
            >
              Sign Up
            </button>
          </div>
        </div>
      </form>
    );
  }
}

export default Signup;
