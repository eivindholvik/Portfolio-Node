const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const app = express();
const passport = require("passport");
const session = require("express-session");
const JsonStore = require("express-session-json")(session);

const indexRouter = require('./routes/index');
const homeRouter = require("./routes/home");
const aboutRouter = require("./routes/about");
const contactRouter = require("./routes/contact");
const portfolioRouter = require("./routes/portfolio");
const recommendationsRouter = require("./routes/recommendations");
const servicesRouter = require("./routes/services");
const loginRouter = require("./routes/login");


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname + "/node_modules/bootstrap/dist")));
app.use(express.static(path.join(__dirname + "/node_modules/bootstrap-icons/font")));
app.use(express.static(path.join(__dirname + "/node_modules/jquery/dist/")));
app.use(express.static(path.join(__dirname + "/node_modules/typed.js/lib")));

app.use(session({
  secret: "jens er kul",
  resave: false,
  saveUninitialized: false,
  store: new JsonStore()
}));
app.use(passport.authenticate("session"));

app.use('/', indexRouter);
app.use('/home', homeRouter);
app.use('/about', aboutRouter);
app.use('/services', servicesRouter);
app.use('/recommendations', recommendationsRouter);
app.use('/portfolio', portfolioRouter);
app.use('/contact', contactRouter);
app.use("/login", loginRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
