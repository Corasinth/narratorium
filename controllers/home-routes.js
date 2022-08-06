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
router.get("/story", async (req, res) => {
  if(req.session.loggedIn) {
    res.redirect("/login");
  } else {
    // Get the story data to display story name on page
    const storyData = await Story.findOne();
    const story = storyData.get({ plain: true });

    // Get the submission data to show words for story
    const submissionData = await Submission.findAll();
    const submission = submissionData.map((sub) =>
      sub.get({ plain: true })
    );
    console.info("Got submissions! " + submission);
    submission.forEach(sub => console.info(sub.submission));   

    res.render("storypage", {story, submission, loggedIn: req.session.loggedIn});
  }
});

module.exports = router;