const router = require("express").Router();
const {User, Story, Submission} = require("../models");

router.get('/', async (req, res) => {
    // Get all story
    const storyData = await Story.findAll().catch((err) => { 
      res.json(err);
    });
    // Serialize data so the template can read it
    const stories = storyData.map((story) => story.get({ plain: true }));

    // Pass serialized data and session flag into template
    res.render('homepage', { 
      stories: stories, 
      loggedIn: req.session.loggedIn, session: req.session
    });
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

module.exports = router;