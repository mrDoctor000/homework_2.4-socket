const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const conf = require('./conf.js')

server.listen(conf.port);

io.on('connection', function(socket) {
  var ID = (socket.id).toString().substr(0, 5);
  var time = (new Date).toLocaleTimeString();

  socket.json.send({ 'event': 'connected', 'name': ID, 'time': time });
  socket.broadcast.json.send({ 'event': 'userJoined', 'name': ID, 'time': time });

  socket.on('message', function(msg) {
    var time = (new Date).toLocaleTimeString();
    socket.json.send({ 'event': 'messageSent', 'name': ID, 'text': msg, 'time': time });
    socket.broadcast.json.send({ 'event': 'messageReceived', 'name': ID, 'text': msg, 'time': time })
  });

  socket.on('disconnect', function() {
    var time = (new Date).toLocaleTimeString();
    io.sockets.json.send({ 'event': 'userSplit', 'name': ID, 'time': time });
  });
});

const rest = express.Router();

rest.get('/', (req, res) => {
  res.send('./index.html');
});

app.use('/', rest);