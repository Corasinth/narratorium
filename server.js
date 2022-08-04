const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
// const routes = require('./controllers/index');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer,{});

const PORT = process.env.PORT || 3001;

// app.use(routes);

io.on("connection", (socket) => {
  // ...
});

httpServer.listen(PORT, ()=>{
    console.log(`Now listening to port ${PORT}`)
});