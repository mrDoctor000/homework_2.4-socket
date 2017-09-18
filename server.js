const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

server.listen(3000);

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