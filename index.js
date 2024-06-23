const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

let users = {};

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
    console.log("a user connected!");

    socket.on("set nickname", (nickname) => {
        users[socket.id] = nickname;
        io.emit("user list", Object.values(users));
        socket.broadcast.emit("user connected", `${nickname} has joined the chat`);
    });

    socket.on("disconnect", () => {
        if (users[socket.id]) {
            socket.broadcast.emit("user disconnected", `${users[socket.id]} has left the chat`);
            delete users[socket.id];
            io.emit("user list", Object.values(users));
        }
        console.log("user disconnected!");
    });

    socket.on("chat message", (msg) => {
        socket.broadcast.emit("chat message", { user: users[socket.id], msg });
    });

    socket.on("typing", () => {
        socket.broadcast.emit("typing", users[socket.id]);
    });

    socket.on("stop typing", () => {
        socket.broadcast.emit("stop typing", users[socket.id]);
    });
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});
