import React, { Component } from "react";

import { Switch, Route, Redirect } from "react-router-dom";
import Table from "../src/components/table";
import LoginForm from "../src/components/loginForm";

import axios from "axios";
import NavBar from "../src/components/navBar";
import Signup from "../src/components/signup";
import Calendar from "../src/components/calendar";
import Swal from "sweetalert2";

class App extends Component {
  constructor() {
    super();
    this.state = {
      loggedIn: null,
      username: null,
      fromLogout: null
    };
    this.getUser = this.getUser.bind(this);
    this.updateUser = this.updateUser.bind(this);
  }

  componentDidMount() {
    console.log("will mount");
    this.getUser();
  }

  updateUser(userObject) {
    this.setState(userObject);
  }

  getUser() {
    axios.get("/check_user").then((response) => {
      console.log("hi");
      console.log("get user", response.data);

      if (response.data.username) {
        this.setState({
          loggedIn: true,
          username: response.data.username,
          fromLogout: null
        });
      } else {
        this.setState({
          loggedIn: false,
          username: null,
          fromLogout: null
        });
      }
    });
  }

  render() {
    const setState1 = {
      name: "",
      mass: "",
      unit: "",
      carbs: "",
      fat: "",
      protein: "",
      calories: ""
    };
    const setState2 = null;

    if (this.state.loggedIn == null) {
      return null;
    } else {
      return (
        <>
          <Route
            path="/user"
            render={() => {
              console.log("user");
              console.log(this.state.loggedIn);
              if (this.state.loggedIn === true)
                return (
                  <NavBar
                    updateUser={this.updateUser}
                    loggedIn={this.state.loggedIn}
                  ></NavBar>
                );
              else {
                console.log("redirecting", this.state.loggedIn);
                if (this.state.fromLogout === true) {
                  return (
                    <Redirect
                      to={{
                        pathname: "/"
                      }}
                    ></Redirect>
                  );
                } else {
                  return (
                    <Redirect
                      to={{
                        pathname: "/",
                        state: { message: "Log In to Access this page" }
                      }}
                    ></Redirect>
                  );
                }
              }
            }}
          ></Route>
          <Switch>
            <Route
              exact
              path="/"
              render={(props) => {
                console.log("message props is", props.location.state);
                console.log(this.state.loggedIn);
                if (props.location.state) {
                  if (
                    props.location.state.message ===
                    "Log In to Access this page"
                  ) {
                    Swal.fire({
                      icon: "error",
                      title: "Error",
                      text: props.location.state.message
                    });
                  } else {
                    Swal.fire({
                      icon: "success",
                      title: "Success",
                      text: props.location.state.message
                    });
                  }
                  props.location.state = null;
                }

                if (this.state.loggedIn === true) {
                  return <Redirect to="/calendar"></Redirect>;
                }
                console.log(this.state.loggedIn);
                return (
                  <>
                    <NavBar
                      updateUser={this.updateUser}
                      loggedIn={this.state.loggedIn}
                    ></NavBar>
                    <LoginForm updateUser={this.updateUser} />
                  </>
                );
              }}
            ></Route>

            <Route
              exact
              path="/signup"
              render={() => {
                if (this.state.loggedIn === true) {
                  return <Redirect to="/calendar"></Redirect>;
                }

                return <Signup />;
              }}
            ></Route>
            <Route
              exact
              path="/calendar"
              render={() => {
                if (this.state.loggedIn === true) {
                  return (
                    <>
                      <Calendar
                        updateUser={this.updateUser}
                        loggedIn={this.state.loggedIn}
                        width="2000px"
                        onDayClick={(e, day) => this.onDayClick(e, day)}
                      ></Calendar>
                    </>
                  );
                } else {
                  console.log("redirecting", this.state.loggedIn);
                  if (this.state.fromLogout === true) {
                    return (
                      <Redirect
                        to={{
                          pathname: "/"
                        }}
                      ></Redirect>
                    );
                  } else {
                    return (
                      <Redirect
                        to={{
                          pathname: "/",
                          state: { message: "Log In to Access this page" }
                        }}
                      ></Redirect>
                    );
                  }
                }
              }}
            ></Route>
          </Switch>
        </>
      );
    }
  }
}

export default App;
