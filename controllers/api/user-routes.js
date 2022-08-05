const router = require("express").Router();
const {User, Story, Submission} = require("../../models");

// "/" get all users
router.get("/", async (req, res) => {
  try {
    const userData = await User.findAll({
      include: [{model: Submission}]
    });
    res.status(200).json(userData);
  } catch (error) {
    res.status(500).json(error);
  }
});

// "/:id" get one user
router.get("/:id", async (req, res) => {
  try {
    const userData = await User.findByPk(req.params.id, {
      include: [{model: Submission}]
    });
    if(!userData) {
      res.status(400).json({message: "No user found with this id"});
    } else{
      res.status(200).json(userData);
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// "/" post create a new user
router.post("/", async (req, res) => {
  try {
    const userData = await User.create(req.body);

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.loggedIn = true;
      
      res.status(200).json({ user: userData, message: 'You are now logged in!' });
    });

  } catch (error) {
    res.status(500).json(error);
  }
});


// "/" delete remove a user
router.delete("/:id", async (req, res) => {
  try {
    const userData = await User.destroy({
      where: {
        id: req.params.id
      }
    });
    if(!userData) {
      res.status(404).json({message: "No user found with this id"});
    }else {
      res.status(200).json(userData);
    }
    
  } catch (error) {
    res.status(500).json(error);
  }
});


// "/login" post login user
router.post("/login", async (req, res) => {
  try {
    const userData = await User.findOne({
      where: {
        email: req.body.email
      }
    });

    if(!userData) {
      res.status(404).json({message: "No user found with this email address"});
    } else{
      const isValidPassword = userData.checkPassword(req.body.password);
      if(!isValidPassword) {
        res.status(404).json({message: "Incorrect password"});
      } else {
        
        req.session.save(() => {
          req.session.user_id = userData.id;
          req.session.loggedIn = true;
          
          res.status(200).json({ user: userData, message: 'You are now logged in!' });
        });
      }
    }
  } catch (error) {
    res.status(500).json(error);
  }
});


// "/logout" post logout user
router.post("/logout", (req, res) => {
  if (req.session.loggedIn) {
    req.session.destroy(() => {
        res.status(200).end();
    });
  }
  else {
    res.status(404).end();
  }
})


module.exports = router;