var createError = require("http-errors");
var express = require("express");
var path = require("path");
var favicon = require("serve-favicon");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var deviceRouter = require("./routes/deviceRouter");
var logRouter = require("./routes/logRouter");

config = require("./config");

var app = express();

// Allow Cross Origin
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Cache-Control, Pragma, Origin, Authorization,   x-access-token, Content-Type, X-Requested-With"
  );
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  return next();
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

//connect to db
mongoose.connect(config.mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  // we're connected!
  console.log("Connected correctly to server!");
});

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + "/public/images/logo.png"));

app.use(logger("short"));
//app.use(logger("common"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// passport config

app.use(passport.initialize());
var User = require("../models/user");
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/api/device", deviceRouter);
app.use("/api/log", logRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
