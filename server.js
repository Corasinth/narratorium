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

io.on("connection", (socket) => {
    console.log(socket.id)
    let storyString = 'There once was a house in New Orleans they called the rising sun.'
    io.emit('displayStory', storyString)
//Takes in submission, position, and user, and updates the database accordingly
    socket.on('submission', async (submission, position, username, storyname) => {
        console.log(`Recieved submission of ${submission} at position ${position} from user ${user}`);
        let submissionArray = submission.split(' ');
        try {
            const user = await User.findOne({
                where: {
                    name: username
                }
            })
            for (let word of submissionArray) {
                await Submission.create(word, position, user_id)
            }
            const story = await Story.findOne({
                where: {
                    storyname: storyname
                }
            })
            //Add code to turn submission table into full story
        } catch (err) {
            io.emit('error', err)
        }
        io.emit('displayStory', storyString)
    });
//Takes in the position of the word deleted and adjusts the database accordingly.
    socket.on('deletion', async (position) => {
        console.log(`Deleted the word at position ${position}`)
        





        io.emit('displayStory', storyString)
    })

});



// io.on('connection', (socket) => {
//     console.log('hello')
//     console.log(socket)
//     console.log(`=======================User with id ${socket.id} connected.=======================`);
//     //placeholder event handling for testing -- change names later
//     // socket.on('event', (event) => {
//     //     console.log(event);
//     //     io.emit('event', `Someone has triggered an event: ${event}`);
//     // })
//     // socket.on('test', () => {
//     //     console.log('I am active')
//     // })
// });

// Sync database and start listening
sequelize.sync({force: false}).then(() => httpServer.listen(PORT, ()=>{
    console.log(`Now listening to port ${PORT}`)
}));