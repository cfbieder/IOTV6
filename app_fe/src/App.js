import React, { Component, Fragment } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";

import Home from "./components/Pages/Home";
import Login from "./components/Pages/Login";
import Logout from "./components/Pages/Logout";
//import NotFound from "./components/Pages/NotFound";

class App extends Component {
  /*************************************************************
   * Render
   *************************************************************/
  render() {
    return (
      <Router>
        <Fragment>
          <div>
            <Switch>
              <Route exact path="/" render={() => <Home />} />{" "}
              <Route exact path="/login" component={Login} />{" "}
              <Route exact path="/logout" component={Logout} />{" "}
            </Switch>
          </div>
        </Fragment>
      </Router>
    );
  }
}

export default App;
