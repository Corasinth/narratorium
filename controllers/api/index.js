const express = require("express");
const userRoutes = require("./user-routes");
const storyRoutes = require("./story-routes");
const submissionRoutes = require("./submission-routes");

const router = express.Router();

router.use("/users", userRoutes);
router.use("/stories", storyRoutes);
router.use("/submissions", submissionRoutes);

module.exports = router;