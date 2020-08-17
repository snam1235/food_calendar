import React, { Component } from "react";

import { Switch, Route, Redirect } from "react-router-dom";
import LoginForm from "../src/components/loginForm";
import axios from "axios";
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
                //if redirected from a different route with message, display message to user
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
                  //clear previous message so it doesn't repeat on refresh
                  window.history.replaceState(null, "");
                }
                // home page shouldn't be accessible when logged in, so redirect to calendar page
                if (this.state.loggedIn === true) {
                  return <Redirect to="/calendar"></Redirect>;
                }
                // else return loginform component
                return <LoginForm updateUser={this.updateUser} />;
              }}
            ></Route>

            <Route
              exact
              path="/signup"
              render={() => {
                // signup page shouldn't be accessible when logged in, so redirect to calendar page
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
                //render only if user is logged in
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
                  // if user logged out, redirect to homepage
                  if (this.state.fromLogout === true) {
                    return (
                      <Redirect
                        to={{
                          pathname: "/"
                        }}
                      ></Redirect>
                    );
                  } else {
                    // else this is a user that is not logged in trying to access page, redirect with alert message
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
