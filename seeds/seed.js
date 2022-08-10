// Import packages
const sequelize = require('../config/connection');
const { User, Submission, Story } = require('../models');

// Import json files
const userData = require('./userData.json');
const submissionData = require('./submissionData.json');
const storyData = require('./storyData.json');

// Seeds the database
const seedDatabase = async () => {
    await sequelize.sync({ force: true });

    await User.bulkCreate(userData, {
        individualHooks: true,
        returning: true,
    });

    await Story.bulkCreate(storyData, {
        individualHooks: true,
        returning: true,
    });

    await Submission.bulkCreate(submissionData, {
        individualHooks: true,
        returning: true,
    });

    process.exit(0);
};

seedDatabase();
