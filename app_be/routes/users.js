var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../../models/user");
var Verify = require("./verify");

/* GET users listing. */
router.route("/").get(Verify.verifyOrdinaryUser, function (req, res, next) {
  User.find(function (err, usrs) {
    // if there is an error retrieving, send the error. nothing after res.send(err) will execute
    if (err) res.send(err);
    res.json(usrs); // return all todos in JSON format
  });
});

router.delete("/:id", Verify.verifyOrdinaryUser, function (req, res, next) {
  User.remove(
    {
      _id: req.params.id,
    },
    function (err, users) {
      if (err) res.send(err);

      // get and return all the todos after you create another
      User.find(function (err, users) {
        if (err) res.send(err);
        res.json(users);
      });
    }
  );
});

router.put("/:id", Verify.verifyOrdinaryUser, function (req, res, next) {
  User.findOneAndUpdate(
    { _id: req.body._id },
    { lastname: req.body.lastname },
    { upsert: false },
    function (err, users) {
      if (err) return res.send(500, { error: err });
      res.json(users);
    }
  );
});

router.get("/valid", Verify.verifyOrdinaryUser, function (req, res) {
  var sts = Verify.checkUserStatus(req, res);
  s = { status: sts };
  res.json(s);
});

router.post("/admin", Verify.verifyOrdinaryUser, function (req, res) {
  var a = req.body.admin == "true";

  User.findOneAndUpdate(
    { _id: req.body.id },
    { admin: a },
    { upsert: false },
    function (err, users) {
      if (err) return res.send(500, { error: err });
      res.json(users);
    }
  );
});

router.post("/update", Verify.verifyOrdinaryUser, function (req, res) {
  User.findOneAndUpdate(
    { _id: req.body.id },
    {
      username: req.body.username,
      lastname: req.body.lastname,
      firstname: req.body.firstname,
    },
    { upsert: false },
    function (err, users) {
      if (err) return res.send(500, { error: err });
      res.json(users);
    }
  );
});

router.post("/register", Verify.verifyAdmin, function (req, res) {
  console.log(req.body);
  User.register(
    new User({ username: req.body.username }),
    req.body.password,
    function (err, user) {
      if (err) {
        return res.status(500).json({ err: err });
      }
      passport.authenticate("local")(req, res, function () {
        return res.status(200).json({ status: "Registration Successful!" });
      });
    }
  );
});

router.post("/setadmin", Verify.verifyAdmin, function (req, res) {
  console.log(req.body.username);
  User.findOneAndUpdate(
    { username: req.body.username },
    {
      admin: req.body.admin,
    },
    function (err, users) {
      if (err) return res.send(500, { error: err });
      res.json(users);
    }
  );
});

router.post("/login", function (req, res, next) {
  passport.authenticate("local", function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({
        err: info,
      });
    }
    req.logIn(user, function (err) {
      if (err) {
        console.log("Error " + err);
        return res.status(500).json({
          err: "Could not log in user",
        });
      }
      var token = Verify.getToken(user);
      res.status(200).json({
        status: "Login successful!",
        success: true,
        admin: user.admin,
        token: token,
      });
    });
  })(req, res, next);
});

router.get("/logout", function (req, res) {
  req.logout();
  res.status(200).json({
    status: "Bye!",
  });
});

module.exports = router;
