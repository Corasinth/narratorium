//Limit Values
const charLimit = 100;
const delLimit = 100;
// Import packages
const { createServer } = require("http");
const { Server } = require("socket.io");
const express = require("express");
const session = require('express-session');
const exphbs = require('express-handlebars');
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const path = require("path");

// Import modules
const routes = require('./controllers/index');
const sequelize = require('./config/connection');
const { Op } = require("sequelize");

//Import models 
const { User, Story, Submission } = require('./models/index');
const { findByPk } = require("./models/user");
const { response } = require("express");
const { NONE } = require("sequelize");
const { use } = require("./controllers/index");

// Initialize packages
const app = express();
const hbs = exphbs.create();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: ['https://admin.socket.io/'],
        credentials: true
    }
});
const PORT = process.env.PORT || 3001;

// Set up sessions
const sess = {
    secret: "i love cats",
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 900000,
    },
    store: new SequelizeStore({ db: sequelize })
};
app.use(session(sess))

// Set up handlebars
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// Set up middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Set up routes
app.use(routes);


// Set up sockets
io.on("connection", async (socket) => {
    console.log(socket.id)
    socket.on('viewStory', async (story_id, response) => {
        try {
            const storyData = await Story.findByPk(story_id, {
                include: [{
                    model: Submission,
                    separate: true,
                    order: [['position', 'ASC']]
                }],
            });
            io.emit('displayStory', storyData)
        } catch (err) {
            response ({
                status: err
            })
        }
    })
    //Takes in title and creates a new story
    socket.on('addStory', async (storyname, response) => {
        try {
            const storyData = await Story.create({ storyname });
            response({
                status: storyData
            })
            // io.emit('displayStory', storyData)
        } catch (err) {
            console.log(err)
            io.emit('error', err)
        }
    })
    //Takes in story_id and renames the story title 
    socket.on('renameStory', async (newName, story_id, user_id, response) => {
        try {
            let userData = await User.findOne({
                where: {
                    id: user_id
                }
            })
            if (!(userData.character_limit === charLimit && userData.delete_limit === delLimit)) {
                response({
                    status: 'fail'
                })
                return;
            }
            await Story.update({ storyname: newName }, {
                where: {
                    id: story_id
                }
            })
            await User.update({ character_limit: 0, delete_limit: 0 }, {
                where: {
                    id: user_id
                }
            })
            const storyData = await Story.findByPk(story_id, {
                include: [{
                    model: Submission,
                    separate: true,
                    order: [['position', 'ASC']]
                }],
            });
            io.emit('displayStory', storyData)
            response({
                status: newName
            });

        } catch (err) {
            response({
                status: err
            })
        }
    })

    //Takes in submission, position, and user, and updates the database accordingly
    socket.on('submission', async (submission, position, user_id, story_id, response) => {
        console.log(`Recieved submission of ${submission} at position ${position} from user ${user_id} in story ${story_id}`);
        let submissionArray = submission.split(' ');
        try {
            //Updates the position of every of word in the story after the submission position, by an amount equal to the # of words inserted, 
            await Submission.increment({ position: submissionArray.length }, {
                where: {
                    position: { [Op.gt]: position }
                }
            });
            const userData = await User.findOne({
                where: {
                    id: user_id
                }
            })
            const currentCharLimit = userData.character_limit - submissionArray.length
            if (currentCharLimit < 0 ) {
                response ({
                    status: false
                })
                return;
            } 
            // Updates the users daily limit to ensure database is up to date
            await User.decrement('character_limit', {
                by: submission.length,
                where: {
                    id: user_id
                }
            });
            //For each word in the submission, creates a new table entry and an appropriate position
            for (let submission of submissionArray) {
                //Check that the create parameters are correct
                position++
                await Submission.create({ submission, position, user_id, story_id });
            }
            const storyData = await Story.findByPk(story_id, {
                include: [{
                    model: Submission,
                    separate: true,
                    order: [['position', 'ASC']]
                }],
            });
            io.emit('displayStory', storyData)
            // x()
            console.log(currentCharLimit)
            response({
                status: [true, currentCharLimit]
            })
        } catch (err) {
            response({
                status: err
            })
        };
    });
    //Takes in the position of the word deleted and adjusts the database accordingly.
    socket.on('deletion', async (position, user_id, story_id, response) => {
        console.log(`Delete word ${position}`)
        try {
            const userData = await User.findOne({
                where: {
                    id: user_id
                }
            })
            const currentDelLimit = userData.delete_limit - 1
            if (currentDelLimit < 0 ) {
                response ({
                    status: false
                })
                return;
            } 
            await Submission.destroy({
                where: {
                    position: position
                }
            });
            await Submission.increment('position', {
                by: -1,
                where: {
                    position: { [Op.gt]: position }
                }
            });

            const storyData = await Story.findByPk(story_id, {
                include: [{
                    model: Submission,
                    separate: true,
                    order: [['position', 'ASC']]
                }],
            });

            await User.decrement('delete_limit', {
                by: 1,
                where: {
                    id: user_id
                }
            });
            io.emit('displayStory', storyData)
            // x()
            response({
                status: [true, currentDelLimit]
            })
        } catch (err) {
            response({
                status: err
            })
        };
    })
    socket.on('newDayDetection', async (user_id, response) => {
        try {
            let currentDate = new Date(Date.now()).toISOString();
            let currentDay = currentDate[8] + currentDate[9]
            let currentMonth = currentDate[5] + currentDate[6]
            const userData = await User.findOne({
                where: {
                    id: user_id
                }
            })
            //Checks if it needs to update the users limits, and if so send back the reset limits.
            if (userData.last_logged_in === null || `${userData.last_logged_in[8]}${userData.last_logged_in[9]}` < currentDay || `${userData.last_logged_in[5]}${userData.last_logged_in[6]}` < currentMonth) {
                await User.update({ character_limit: charLimit, delete_limit: delLimit, last_logged_in: currentDate }, {
                    where: {
                        id: {
                            [Op.gt]: 0
                        }
                    }
                });
                response({
                    status: [charLimit, delLimit]
                })
            } else {
                response({
                    status: [userData.character_limit, userData.delete_limit]
                })
            }
        } catch (err) {
            response({
                status: err
            })
        }
    })
});

// async function x() {
//     const submissionsData = await Submission.findAll()
//     io.emit("test", submissionsData)
// }

// Sync database and start listening
sequelize.sync({ force: false }).then(() => httpServer.listen(PORT, () => {
    console.log(`Now listening to port ${PORT}`)
}));