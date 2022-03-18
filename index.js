const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

function findOcc(arr) {
    const valueOccurrences = {};

    for (const element of arr) {
        if (valueOccurrences[element]) {
            valueOccurrences[element] += 1;
        } else {
            valueOccurrences[element] = 1;
        }
    }
    return valueOccurrences
}

let valuesList = [];

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.broadcast.emit('hi');
    //Consuming events
    io.on('connection', (socket) => {
        socket.on('chat_message', (msg) => {
            valuesList.push(msg)
            io.emit('chat_message', findOcc(valuesList, "value"))
        });
    });
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});
server.listen(3020, () => {
    console.log('listening on *:3020');
});