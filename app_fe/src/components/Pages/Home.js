import React, { Component } from "react";
import HomeLayout from "../layout/HomeLayout.js";

export class Home extends Component {
  state = {
    loggedIn: false,
  };

  componentDidMount = () => {
    this.setState({ loggedIn: sessionStorage.getItem("login") });
  };

  render() {
    let outputMain = "";
    outputMain = <h1>Home</h1>;
    return (
      <div>
        <HomeLayout loggedIn={this.state.loggedIn} outputMain={outputMain} />
      </div>
    );
  }
}

export default Home;
