import React, { Component } from "react";
import HomeLayout from "../layout/HomeLayout.js";

import axios from "axios";

export class Logout extends Component {
  state = {
    loggedIn: false,
  };

  componentDidMount = () => {
    this.doLogout();
  };

  doLogout = async () => {
    axios.defaults.headers.post["Content-Type"] =
      "application/x-www-form-urlencoded";
    axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";
    try {
      const res = await axios.get(
        `http://172.104.137.168:3000/api/users/logout`
      );
      console.log(res);
      sessionStorage.setItem("login", "N");
      sessionStorage.setItem("token", "");
      this.setState({ loggedIn: sessionStorage.getItem("login") });
    } catch {
      console.log("error");
    }
  };

  render() {
    let outputMain = "";
    return (
      <div>
        <HomeLayout loggedIn={this.state.loggedIn} outputMain={outputMain} />
      </div>
    );
  }
}

export default Logout;
