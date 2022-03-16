const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

function findOcc(arr, key){
    let arr2 = [];
      
    arr.forEach((x)=>{
       if(arr2.some((val)=>{ return val[key] == x[key] })){
         arr2.forEach((k)=>{
           if(k[key] === x[key]){ 
             k["occurrence"]++
           }
        })
       }else{
         let a = {}
         a[key] = x[key]
         a["occurrence"] = 1
         arr2.push(a);
       }
    })
    return arr2
  }

let valuesList = [];

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.broadcast.emit('hi');
    //Consuming events
    io.on('connection', (socket) => {
        socket.on('chat_message', (msg) => {
            //io.emit('chat_message', msg);
          //console.log('message: ' + msg);
          valuesList.push({"value" : msg})
          console.log(findOcc(valuesList, "value"));
          io.emit('chat_message', findOcc(valuesList, "value"))
          //io.emit('chat_message', msg)
        });
      });
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });
server.listen(3000, () => {
  console.log('listening on *:3000');
});