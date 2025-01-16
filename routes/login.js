const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const passport = require("passport");
const LocalStrategy = require("passport-local");

passport.use(new LocalStrategy(function verify(username, password, callback) {
  const usersArray = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../data/users.json")));
  const filteredArray = usersArray.filter((user) => user.username === username);
  if (filteredArray.length === 1) {
    const user = filteredArray[0];
    if (password === user.password) {
      return callback(null, user);
    }
  }
  return callback(null, false);
}));

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    cb(null, { id: user.id, username: user.username })
  })
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    cb(null, user);
  })
});

router.get("/", (req, res, next) => {
  if (!req.user) {
    res.render("login", { user: null });
  } else {
    res.render("login", { user: req.user });
  }
});

router.post("/password", passport.authenticate("local", {
  successReturnToOrRedirect: "/home",
  failureRedirect: "/login"
}));

router.post("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/home");
  });
});

module.exports = router;