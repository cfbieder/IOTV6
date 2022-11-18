import React from "react";
import Button from "@material-ui/core/Button";

export default function Login(props) {
  return (
    <div>
      <h1>Account Login</h1>
      <div>
        <div className="form-group">
          <label htmlFor="email">User Name: </label>
          <input
            id="email"
            type="email"
            name="email"
            className="form-control"
            value={props.email}
            onChange={props.onChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            className="form-control"
            value={props.password}
            onChange={props.nameonChange}
            required
          />
        </div>
        <Button onClick={props.onSubmit} variant="contained" color="primary">
          Submit
        </Button>
      </div>
    </div>
  );
}
