const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const conf = require('./conf.js')


app.get('/', (req, res) => {
  res.sendfile(__dirname + '/public/index.html');
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

http.listen(conf.port, () => {
  console.log(`Server listening at port ${conf.port}.`)
})