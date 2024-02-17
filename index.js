const express = require("express");
const path = require("path");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);

// Set up middleware, routes, and other configurations

// Socket.io connection handling
const users = {};

io.on("connection", (socket) => {
    socket.on('new-user-joined', (name) => {
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    socket.on('send', (message) => {
        socket.broadcast.emit('receive', { message: message, name: users[socket.id] });
    });
});

// Start the server
http.listen(7003, () => {
    console.log("Socket.IO server running on port 7003");
});
