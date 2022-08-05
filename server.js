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

//Import models 
const {User, Story, Submission } = require('./models/index');
const { findByPk } = require("./models/user");

// Initialize packages
const app = express();
const hbs = exphbs.create();
const httpServer = createServer(app);
const io = new Server(httpServer,{
    cors: {origin:'*'}
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
    store: new SequelizeStore({db: sequelize})
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
    socket.on('viewStory', (storyName) => {
        try {
            let storyData = await Story.findOne({
                where: {
                    storyname:storyName
                }
            })
            //Add code to assemble story, current values are temporary
            let storyString = "There is a house in New Orleans they call the Rising Sun."

const testData = await Submission.findAll()
io.emit('testEvent', testData)
            
            // io.emit('displayStory', storyString)
        } catch (err) {
            io.emit('error', err)
        }
    })
//Takes in submission, position, and user, and updates the database accordingly
    socket.on('submission', async (submission, position, username, storyname) => {
        console.log(`Recieved submission of ${submission} at position ${position} from user ${user}`);
        let submissionArray = submission.split(' ');
        try {
            //Updates the position of every of word in the story after the submission position, by an amount equal to the # of words inserted, 
            let updatedSubmissionData = await Submission.update({
                position: this.position+submissionArray.length
            }, 
            {
                where: {
                    position: {
                        [OP.gte]: position
                    }
                }
            })
            console.log(updatedSubmissionData);
            //Identifies the user
            const user = await User.findOne({
                where: {
                    name: username
                }
            })
            const user_id = user.id
            //For each word in the submission, creates a new table entry and an appropriate position
            for (let word of submissionArray) {
                await Submission.create(word, position, user_id)
                position++
            }
            const story = await Story.findOne({
                where: {
                    storyname: storyname
                }
            })
            //Add code to turn submission table into full story

const testData = await Submission.findAll()
io.emit('testEvent', testData)

            // io.emit('displayStory', storyString)
        } catch (err) {
            io.emit('error', err)
        };
    });
//Takes in the position of the word deleted and adjusts the database accordingly.
    socket.on('deletion', async (position) => {
        console.log(`Deleted the word at position ${position}`)
       try {
        const submissionData = await Submission.destroy({
            where: {
                position: position
            }
        })
        //Decrements each position greater than the position deleted--requires deleting a single word at a time
        const newSubmissionData = await Submission.update({
            postion: this.position-1
        }, 
        {
            where: {
                position: {
                    [OP.gt]: position 
                }
            }
        })
        console.log(newSubmissionData)
       } catch (err) {
        io.emit('error', err)
       };

const testData = await Submission.findAll()
io.emit('testEvent', testData)

        // io.emit('displayStory', storyString)
    })

});

// Sync database and start listening
sequelize.sync({force: false}).then(() => httpServer.listen(PORT, ()=>{
    console.log(`Now listening to port ${PORT}`)
}));