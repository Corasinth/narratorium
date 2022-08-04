const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
// const routes = require('./controllers/index');
const sequelize = require('./config/connection');
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer,{
    cors: {origin:'*'}
});

const PORT = process.env.PORT || 3001;

// app.use(routes);

io.on("connection", (socket) => {
    console.log('Checking to see if a connection is active');
    //placeholder event handling for testing -- change names later
    socket.on('event', (event) => {
        console.log(event);
        io.emit('event', `Someone has triggered an event: ${event}`);
    })
});

sequelize.sync({force: false}).then(() => httpServer.listen(PORT, ()=>{
    console.log(`Now listening to port ${PORT}`)
}));