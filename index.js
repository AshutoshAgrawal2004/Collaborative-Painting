console.log('socket server is running');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000
const server = app.listen(port);
app.use(express.static('public'));
console.log('listening at ' + port);
var socket = require('socket.io');
var io = socket(server);
io.sockets.on('connection', newConnection);
var currentpaint = [];
setInterval(() => {
  currentpaint = [];
}, 60 * 5 * 1000);

function newConnection(socket) {
  console.log(socket.id);
  for(cp of currentpaint) {
    socket.emit('sentpaint', cp);
  }
  socket.on('painting', data => {
    console.log(data);
    socket.broadcast.emit('sentpaint', data);
    currentpaint.push(data);
  });
}