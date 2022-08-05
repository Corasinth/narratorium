const sequelize = require('../config/connection');
const { User, Submission, Story } = require('../models');

const userData = require('./userData.json');
const submissionData = require('./submissionData.json');
const storyData = require('./storyData.json');

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  const users = await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });

  const story = await Story.bulkCreate(storyData, {
    individualHooks: true,
    returning: true,
  });
  
  const submissions = await Submission.bulkCreate(submissionData, {
    individualHooks: true,
    returning: true,
  });

  process.exit(0);
};

seedDatabase();
