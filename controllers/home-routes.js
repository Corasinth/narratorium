const router = require("express").Router();
const { User, Story, Submission } = require("../models");

// "/" GET route for the homepage
router.get('/', async (req, res) => {
  try {
    // Query for all stories
    const storyData = await Story.findAll();
    // Serialize data so the template can read it
    const stories = storyData.map((story) => story.get({ plain: true }));

    // Pass serialized data and session flag into template
    res.render('homepage', {
      stories: stories,
      loggedIn: req.session.loggedIn, session: req.session
    });
  } catch (err) {
    res.json(err);
  };

});

// "/login" GET route for login page
router.get("/login", (req, res) => {
  if (req.session.loggedIn) {
    res.redirect("/");
  } else {
    res.render("login", { loggedIn: req.session.loggedIn });
  }
});

// "/signup" GET route for signup page
router.get("/signup", (req, res) => {
  if (req.session.loggedIn) {
    res.redirect("/");
  } else {
    res.render("signup", { loggedIn: req.session.loggedIn });
  }
});

module.exports = router;