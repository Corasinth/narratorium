const express = require("express");
// const session = require('express-session');
const exphbs = require('express-handlebars');
const hbs = exphbs.create();
const app = express();
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, 'public')));

const { createServer } = require("http");
const { Server } = require("socket.io");
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const {create} = require("express-handlebars");

const routes = require('./controllers/index');
const sequelize = require('./config/connection');
const httpServer = createServer(app);
const io = new Server(httpServer,{
    cors: {origin:'*'}
});

const PORT = process.env.PORT || 3001;

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

const hbs = create(/* {helpers} */);
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", "./views");

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static("./public"));

app.use(routes);

// io.on("connection", (socket) => {
//     console.log('Checking to see if a connection is active');
//     //placeholder event handling for testing -- change names later
//     socket.on('event', (event) => {
//         console.log(event);
//         io.emit('event', `Someone has triggered an event: ${event}`);
//     })
// });

app.get('/', async (req, res) => {
    res.render('homepage');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/signup', (req, res) => {
    res.render('signup');
});

app.get('/storypage', (req, res) => {
    res.render('storypage');
});
  

sequelize.sync({force: false}).then(() => httpServer.listen(PORT, ()=>{
    console.log(`Now listening to port ${PORT}`)
}));