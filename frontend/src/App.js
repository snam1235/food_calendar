import React, { Component } from "react";

import { Switch, Route, Redirect } from "react-router-dom";
import Table from "../src/components/table";
import LoginForm from "../src/components/loginForm";

import axios from "axios";
import NavBar from "../src/components/navBar";
import Signup from "../src/components/signup";
import Swal from "sweetalert2";

class App extends Component {
  constructor() {
    super();
    this.state = {
      loggedIn: null,
      username: null
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
    axios.get("/home").then((response) => {
      console.log("get user", response.data);
      if (response.data.username) {
        this.setState({
          loggedIn: true,
          username: response.data.username
        });
      } else {
        this.setState({
          loggedIn: false,
          username: null
        });
      }
    });
  }

  render() {
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
              if (this.state.loggedIn)
                return (
                  <NavBar
                    updateUser={this.updateUser}
                    loggedIn={this.state.loggedIn}
                  ></NavBar>
                );
              else {
                console.log("redirecting", this.state.loggedIn);

                return (
                  <Redirect
                    to={{
                      pathname: "/",
                      state: { message: "Log In to Access this page" }
                    }}
                  ></Redirect>
                );
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
              path="/calories"
              render={() => (
                <>
                  <NavBar
                    updateUser={this.updateUser}
                    loggedIn={this.state.loggedIn}
                  ></NavBar>
                  <Table></Table>
                </>
              )}
            ></Route>

            <Route
              exact
              path="/user/calories"
              render={() => {
                return <Table></Table>;
              }}
            ></Route>

            <Route
              exact
              path="/user/history"
              render={() => <Table></Table>}
            ></Route>
            <Route exact path="/signup" render={() => <Signup />}></Route>
          </Switch>
        </>
      );
    }
  }
}

export default App;
