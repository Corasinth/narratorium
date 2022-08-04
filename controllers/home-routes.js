const router = require("express").Router();
const {User, Story, Submission} = require("../models");

// "/" get route for homepage
router.get("/", (req, res) => {
  res.render("homepage", {loggedIn: req.session.loggedIn});
});

// "/login" get route for login page
router.get("/login", (req, res) => {
  if(req.session.loggedIn) {
    res.redirect("/");
  } else {
    res.render("login", {loggedIn: req.session.loggedIn});
  }
});

// "/signup" get route for signup page
router.get("/signup", (req, res) => {
  if(req.session.loggedIn) {
    res.redirect("/");
  } else {
    res.render("signup", {loggedIn: req.session.loggedIn});
  }
});

// "/story" get route for story page
router.get("/story", (req, res) => {
  if(req.session.loggedIn) {
    res.redirect("/login");
  } else {
    res.render("storypage", {loggedIn: req.session.loggedIn});
  }
});


module.exports = router;