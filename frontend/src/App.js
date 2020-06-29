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
      loggedIn: false,
      username: null
    };
    this.getUser = this.getUser.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.updateUser = this.updateUser.bind(this);
  }

  componentDidMount() {
    this.getUser();
  }

  updateUser(userObject) {
    this.setState(userObject);
  }

  getUser() {
    axios.get("/home").then((response) => {
      if (response.data.user) {
        this.setState({
          loggedIn: true,
          username: response.data.user.username
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
    return (
      <>
        <Switch>
          <Route
            exact
            path="/"
            render={(props) => {
              if (props.location.state) {
                if (
                  props.location.state.message === "Log In to Access this page"
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

                window.history.pushState(null, "");
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
            render={() => <Table></Table>}
          ></Route>

          <Route
            path="/user"
            render={() => {
              if (this.loggedIn)
                return (
                  <NavBar
                    updateUser={this.updateUser}
                    loggedIn={this.state.loggedIn}
                  ></NavBar>
                );
              else {
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

export default App;
