var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var User = require("../../models/user");
var Verify = require("./verify");

var router = express.Router();
router.use(bodyParser.json());

var Device = require("../../models/device")(mongoose);

router.route("/").get(Verify.verifyOrdinaryUser, function (req, res, next) {
  myQuery = Device.find({});
  myQuery.exec(function (err, dev) {
    res.json(dev);
  });
});

module.exports = router;
