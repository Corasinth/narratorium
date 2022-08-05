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