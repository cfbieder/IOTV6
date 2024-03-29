var User = require("../../models/user");
var jwt = require("jsonwebtoken"); // used to create, sign, and verify tokens
var config = require("../config.js");

var debug_mode = config.debug_mode;

exports.getToken = function (user) {
  return jwt.sign({ data: user }, config.secretKey, {
    expiresIn: 360000,
  });
};

exports.checkUserStatus = function (req, res) {
  var status = "none";
  var token =
    req.body.token || req.query.token || req.headers["x-access-token"];
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, config.secretKey, function (err, decoded) {
      if (err) {
        status = "Error";
      } else {
        status = "OK";
      }
    });
  } else {
    status = "Not found";
  }
  return status;
};

exports.verifyOrdinaryUser = function (req, res, next) {
  // check header or url parameters or post parameters for token

  var token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, config.secretKey, function (err, decoded) {
      if (err && !debug_mode) {
        var err = new Error("You are not authenticated!");
        err.status = 401;
        return next(err);
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });
  } else {
    // if there is no token
    // return an error
    var err = new Error("No token provided!");
    err.status = 403;
    return next(err);
  }
};

exports.verifyAdmin = function (req, res, next) {
  var admin = req.admin;
  console.log("A " + admin);
  if (admin) {
    next();
  } else {
    var err = new Error("You are not authorized!");
    err.status = 403;
    return next(err);
  }
};
