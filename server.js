const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const conf = require('./conf.js')

server.listen(conf.port, () => {
  console.log(`Server listening at port ${conf.port}.`)
});

app.get('/', (req, res) => {
  res.sendfile('./public/index.html');
});

app.use(express.static(__dirname + '/public'));

io.on('connection', function(socket) {
  var name = 'U' + (socket.id).toString().substr(1, 4);

  socket.emit('userJoined', name);
  socket.broadcast.emit('newUser', name);

  socket.on('message', function(msg) {
    io.sockets.emit('messageToClients', msg, name);
  });

  socket.on('disconnect', function() {
    socket.emit('userDisconnected', name);
  });
});