import React, { Component } from "react";
import cx from "classnames";
import styles from "./css/web.module.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Table from "../src/components/table";
import LoginForm from "../src/components/loginForm";
import Logout from "../src/components/logout";
import axios from "axios";

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
      console.log("Get user response: ");
      console.log(response.data);
      if (response.data.user) {
        console.log("Get User: There is a user saved in the server session: ");

        this.setState({
          loggedIn: true,
          username: response.data.user.username
        });
      } else {
        console.log("Get user: no user");
        this.setState({
          loggedIn: false,
          username: null
        });
      }
    });
  }

  render() {
    return (
      <Router>
        <div className={styles.container}>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Route exact path="/">
              <Link to="/calories" className={styles.cal}>
                Calories
              </Link>
            </Route>
            <Route path="/home">
              <Link to="/calories-user" className={styles.cal}>
                Calories
              </Link>
            </Route>
          </li>
          <li>
            <a id="history" href="/history">
              My History
            </a>
          </li>
        </div>
        <Switch>
          <Route exact path="/">
            <LoginForm updateUser={this.updateUser}></LoginForm>
          </Route>
          <Route path="/calories">
            <Table></Table>
          </Route>
          <Route path="/calories-user">
            <Table></Table>
          </Route>
          <Route path="/home">
            <Logout updateUser={this.updateUser}></Logout>
          </Route>
        </Switch>
      </Router>
    );
  }
}

export default App;
