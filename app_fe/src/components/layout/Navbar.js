import React, { Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Link from "@material-ui/core/Link";
import Button from "@material-ui/core/Button";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  root: {
    background: "#01000a",
    color: "white",
    padding: "0px 30px",
  },
  link: {
    padding: "0 30px",
    color: "white",
  },
}));

export default function Navpage(props) {
  const classes = useStyles();
  let menu = null;
  if (props.logged === "Y") {
    menu = (
      <Fragment>
        <Link className={classes.link} href="/">
          Home
        </Link>
        <Link className={classes.link} href="/logout">
          Log Out
        </Link>

        <Button>Search</Button>
      </Fragment>
    );
  } else {
    menu = (
      <Fragment>
        <a className={classes.root} href="/login">
          Not Looged In - Log In
        </a>
      </Fragment>
    );
  }
  return (
    <div>
      <AppBar className={classes.root} position="static">
        <Toolbar>
          <Typography>IOT Control Panel</Typography>
          {menu}
        </Toolbar>
      </AppBar>
    </div>
  );
}
