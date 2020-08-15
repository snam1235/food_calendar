import React, { Component } from "react";

import { Switch, Route, Redirect } from "react-router-dom";
import LoginForm from "../src/components/loginForm";

import axios from "axios";
import NavBar from "../src/components/navBar";
import Signup from "../src/components/signup";
import Calendar from "../src/components/calendar";
import Swal from "sweetalert2";

class App extends Component {
  constructor() {
    super();
    // loggedIn checks whether user is logged in or not
    // username keeps tracks of the username if the user is logged in
    // fromLogout checks if the redirect to home page was from the user logging out or not
    this.state = {
      loggedIn: null,
      username: null,
      fromLogout: null
    };
  }
  // check if user is logged in and the user's username
  componentDidMount() {
    console.log("will mount");
    this.getUser();
  }
  // updates user state
  updateUser = (userObject) => {
    this.setState(userObject);
  };
  // talks to backend authentication setup to get logged in status
  getUser = () => {
    axios.get("/check_user").then((response) => {
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
  };

  render() {
    if (this.state.loggedIn == null) {
      return null;
    } else {
      return (
        <>
          <Switch>
            <Route
              exact
              path="/"
              render={(props) => {
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
                        onDayClick={(e, day) => this.onDayClick(e, day)}
                        username={this.state.username}
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
