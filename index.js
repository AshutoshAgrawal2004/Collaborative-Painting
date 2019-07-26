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

function newConnection(socket) {
  console.log(socket.id);
  socket.on('painting', data => socket.broadcast.emit('sentpaint', data));
  socket.on('changepaint', data => socket.broadcast.emit('changecol', data));
  socket.on('changestroke', data => socket.broadcast.emit('changestrk', data));
}