import React, { Component, Fragment } from "react";
import LoginPanel from "../panels/LoginPanel";
import Container from "@material-ui/core/Container";
import axios from "axios";

export class Login extends Component {
  state = {
    loginState: "N",
    email: "",
    password: "",
    alert: 0,
  };

  redirectToHome = () => {
    const { history } = this.props;
    if (history) history.push("/");
  };

  /*************************************************************
   * Change Handlers
   *************************************************************/
  passwordLoginEmailChangeHandler = (event) => {
    const v = event.target.value;
    this.setState({
      email: v,
    });
  };

  passwordLoginPasswordChangeHandler = (event) => {
    const v = event.target.value;
    this.setState({
      password: v,
    });
  };

  /*************************************************************
   * Button Clicks - Login Form
   *************************************************************/
  doLogin = async () => {
    var formdata = {
      username: this.state.email,
      password: this.state.password,
    };
    axios.defaults.headers.post["Content-Type"] =
      "application/x-www-form-urlencoded";
    axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";
    try {
      const res = await axios.post(
        `http://192.168.1.251:8100/users/login`,
        formdata
      );
      this.setState({
        alert: 0,
      });
      this.loginUser(res);
      this.redirectToHome();
    } catch {
      console.log("error");
      this.setState({
        alert: 1,
      });
    }
  };

  setAlertRender = () => {
    switch (this.state.alert) {
      case 0:
        return <div> </div>;
      case 1:
        return (
          <div className="alert alert-danger" role="alert">
            Login Failed{" "}
          </div>
        );
      default:
        return (
          <div>
            <h1> Error - Unknown </h1>{" "}
          </div>
        );
    }
  };

  loginUser = (res) => {
    sessionStorage.setItem("login", "Y");
    sessionStorage.setItem("token", res.data.token);
    sessionStorage.setItem("User", this.state.email);
    this.setState({
      loginState: "Y",
    });
  };

  render() {
    let outputAlerts = this.setAlertRender();
    return (
      <Fragment>
        <Container>
          <LoginPanel
            onSubmit={this.doLogin}
            onChange={this.passwordLoginEmailChangeHandler}
            nameonChange={this.passwordLoginPasswordChangeHandler}
            email={this.state.email}
            password={this.state.password}
          />
          {outputAlerts}
        </Container>
      </Fragment>
    );
  }
}

export default Login;
