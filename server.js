var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);


app.get('/', (req, res) => {
  res.sendfile('index.html');
});

io.on('connection', (socket) => {
  console.log('a user connected');

  var ID = (socket.id).toString().substr(0, 5);
  var time = (new Date).toLocaleTimeString();

  socket.json.send({ 'event': 'connected', 'ID': ID, 'time': time });
  socket.broadcast.json.send({ 'event': 'userConnected', 'ID': ID, 'time': time });

})

io.on('disconnect', () => {
  console.log('a user disconnect')
})