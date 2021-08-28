var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var User = require("../../models/user");
var Verify = require("./verify");

var router = express.Router();
router.use(bodyParser.json());

var Log = require("../../models/log")(mongoose);

router.route("/").get(Verify.verifyOrdinaryUser, function (req, res, next) {
  myQuery = Log.find({});
  myQuery.exec(function (err, dev) {
    res.json(dev);
  });
});

router
  .route("/last/")
  .get(Verify.verifyOrdinaryUser, function (req, res, next) {
    Log.findOne(
      { MAC: req.body.MAC, component: req.body.component },
      {},
      { sort: { createdAt: -1 } },
      function (err, dev) {
        if (err) throw err;
        res.json(dev);
      }
    );
  });

module.exports = router;
