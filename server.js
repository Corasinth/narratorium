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
        maxAge: 900000
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
    let storyString = ""
    socket.on('viewStory', async (story_id) => {
        try {
            const storyData = await Story.findByPk(story_id, {
                include: [{
                    model: Submission,
                    separate: true,
                    order: [['position', 'ASC']]
                }],
            });
            // const testData = await Submission.findAll()
            // io.emit('testEvent', testData)
            io.emit('displayStory', storyData)
        } catch (err) {
            io.emit('error', err)
        }
    })
    //Takes in title and creates a new story
    socket.on('addStory', async (storyname, response) => {
        try{
            const storyData = await Story.create({storyname});
            response({
                status: storyData
            })
            io.emit('displayStory', storyData)
        } catch (err) {
            console.log(err)
            io.emit('error', err)
        }
    })
    //Takes in story_id and renames the story title 
    socket.on('renameStory', async (newName, story_id, response) => {
        try {
            console.log(`Recieved request to rename story ${story_id}, to ${newName}`);
            await Story.update({ storyname: newName }, {
                where: {
                    id: story_id
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
            io.emit('error', err)
        }
    })

    //Takes in submission, position, and user, and updates the database accordingly
    socket.on('submission', async (submission, position, user_id, story_id) => {
        console.log(`Recieved submission of ${submission} at position ${position} from user ${user_id} in story ${story_id}`);
        let submissionArray = submission.split(' ');
        try {
            //Updates the position of every of word in the story after the submission position, by an amount equal to the # of words inserted, 
            const incrementPosition = await Submission.increment({ position: submissionArray.length }, {
                where: {
                    position: { [Op.gte]: position }
                }
            });
            //For each word in the submission, creates a new table entry and an appropriate position
            for (let submission of submissionArray) {
                //Check that the create parameters are correct
                const submissionData = await Submission.create({ submission, position, user_id, story_id });
                position++
            }
            const storyData = await Story.findByPk(story_id, {
                include: [{
                    model: Submission,
                    separate: true,
                    order: [['position', 'ASC']]
                }],
            });
            io.emit('displayStory', storyData)
        } catch (err) {
            console.log(err)
            io.emit('error', err)
        };
    });
    //Takes in the position of the word deleted and adjusts the database accordingly.
    socket.on('deletion', async (word_id) => {
        console.log(`Delete word ${word_id}`)
        try {
            const positionData = await Submission.findOne({
                attributes: ['position'],
                where: { id: word_id }
            });
            const position = positionData.get({ plain: true }).position;

            const submissionData = await Submission.destroy({
                where: {
                    id: word_id
                }
            });

            if (!submissionData) {
                //TODO Error handling
            }

            const incrementPosition = await Submission.increment('position', {
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
            io.emit('displayStory', storyData)
        } catch (err) {
            io.emit('error', err)
        };
    })
});

// Sync database and start listening
sequelize.sync({ force: false }).then(() => httpServer.listen(PORT, () => {
    console.log(`Now listening to port ${PORT}`)
}));