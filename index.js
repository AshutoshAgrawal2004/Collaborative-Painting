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
var usercount = 0;

function newConnection(socket) {
  for(cp of currentpaint) {
    socket.emit('sentpaint', cp);
  }
  usercount++
  console.log(usercount);
  io.emit('usercount', {
    uc: usercount
  });
  socket.on('painting', data => {
    socket.broadcast.emit('sentpaint', data);
    currentpaint.push(data);
  });
  socket.on('disconnect', () => {
    usercount--
    socket.broadcast.emit('usercount', {
      uc: usercount
    });
  })
}