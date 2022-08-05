const router = require("express").Router();
const sequelize = require("../../config/connection");
const { Op } = require("sequelize");
const {User, Story, Submission} = require("../../models");

// "/" get all submissions
router.get("/", async (req, res) => {
  try {
    const submissionData = await Submission.findAll({
      include: [{model: User}, {model: Story}]
    });

    res.status(200).json(submissionData);

  } catch (error) {
    res.status(500).json(error);
  }
});


// "/:id" get one submission by id
router.get("/:id", async (req, res) => {
  try {
    const submissionData = await Submission.findByPk(req.params.id, {
      include: [{model: User}, {model: Story}]
    });

    if(!submissionData) {
      res.status(400).json({message: "No submission found with that id"})
    } else{
      res.status(200).json(submissionData);
    }

  } catch (error) {
    res.status(500).json(error);
  }
});

// "/:position" get one submission by position
// router.get("/:position", async (req, res) => {
//   try {
//     const submissionData = await Submission.findOne({
//       where: {
//         position: req.params.position
//       },
//       include: [{model: User}, {model: Story}]
//     });

//     if(!submissionData) {
//       res.status(400).json({message: "No submission found with that position"})
//     } else{
//       res.status(200).json(submissionData);
//     }

//   } catch (error) {
//     res.status(500).json(error);
//   }
// });


// "/" post create a new submission
router.post("/", async (req, res) => {
  try {
    const incrementPosition = await Submission.increment({position: 1}, {
      where: {
        position: {[Op.gte]: req.body.position}
      }
    });
    const submissionData = await Submission.create(req.body);

    res.status(200).json(submissionData);

  } catch (error) {
    res.status(500).json(error);
  }
});


// "/" put updates a submission
router.put("/:id", async (req, res) => {
  try {
    const submissionData = await Submission.update(req.body, {
      where: {
        id: req.params.id
      }
    });

    if(!submissionData) {
      res.status(400).json({message: "No submission found with that id"})
    } else{
      res.status(200).json(submissionData);
    }

  } catch (error) {
    res.status(500).json(error);
  }
});


// "/" delete remove a submission
router.delete("/:id", async (req, res) => {
  try {
    const positionData = await Submission.findOne({
      attributes: ['position'],
      where: {id: req.params.id}
    });
    const position = positionData.get({plain: true}).position;

    const submissionData = await Submission.destroy({
      where: {
        id: req.params.id
      }
    });

    if(!submissionData) {
      res.status(400).json({message: "No submission found with that id"});
      return;
    }

    const incrementPosition = await Submission.increment('position', {
      by: -1,
      where: {
        position: {[Op.gt]: position}
      }
    });

    res.status(200).json(submissionData);
  
  } catch (error) {
    res.status(500).json(error);
  }
});




module.exports = router;