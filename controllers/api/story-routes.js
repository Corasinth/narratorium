const router = require("express").Router();
const {User, Story, Submission} = require("../../models");

// "/" get all stories
router.get("/", async (req, res) => {
  try {
    const storyData = await Story.findAll({
      include: [{model: Submission}]
    });

    res.status(200).json(storyData);
  } catch (error) {
    res.status(500).json(error);
  }
});

// "/:id" get one story
router.get("/:id", async (req, res) => {
  try {
    const storyData = await Story.findByPk(req.params.id, {
      include: [{model: Submission}]
    });

    if(!storyData) {
      res.status(400).json({message: "No story found with that id"});
    } else {
      res.status(200).json(storyData);
    }

  } catch (error) {
    res.status(500).json(error);
  }
});

// "/" post create a new story
router.post("/", async (req, res) => {
  try {
    const storyData = await Story.create(req.body);

    res.status(200).json(storyData);
  } catch (error) {
    res.status(500).json(error);
  }
});

// "/:id" delete remove a story
router.delete("/:id", async (req, res) => {
  try {
    const storyData = await Story.destroy({
      where: {id: req.params.id}
    });
    
    if(!storyData) {
      res.status(400).json({message: "No story found with that id"});
    } else {
      res.status(200).json(storyData);
    }
  } catch (error) {
    res.status(500).json(error);
  }
});


module.exports = router;