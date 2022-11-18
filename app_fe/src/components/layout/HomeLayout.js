import React, { Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Navbar from "../layout/Navbar";

const useStyles = makeStyles({
  root: {
    background: "linear-gradient(180deg, #a0a1a3 80%,  #cbcff2 90%)",
    border: 2,
    borderRadius: 3,
    color: "white",
    padding: "0 30px",
    flexGrow: 1,
    minHeight: "100vh",
  },
});

export default function LeefEntry(props) {
  const classes = useStyles();
  return (
    <Fragment>
      <div className={classes.root}>
        <Navbar logged={props.loggedIn} />
        {props.outputMain}
      </div>
    </Fragment>
  );
}
