const io = require('socket.io');

const chat = document.querySelector('.chat');
const content = chat.querySelector('.messages-content');
const loading = content.querySelector('.loading')
const box = chat.querySelector('.message-box');
const input = box.querySelector('.message-input')
const submit = box.querySelector('.message-submit');
const status = chat.querySelector('.message-status');

function messageStatus(event) {
  const message = document.createElement('div');
  message.className = 'message message-status';
  const span = document.createElement('span');
  span.className = 'message-text';
  span.textContent = event;

  message.appendChild(span);

  return message;
}

function getMessage(data, name) {
  const date = new Date();
  const time = date.getHours() + ':' + date.getMinutes();

  const message = document.createElement('div');
  message.className = 'message';
  const span = document.createElement('span');
  span.className = 'message-text';
  span.textContent = name + ' : ' + data;
  const timeMes = document.createElement('div');
  timeMes.className = 'timestamp';
  timeMes.textContent = time;

  message.appendChild(span);
  message.appendChild(timeMes);

  return message;
}

document.addEventListener('DOMContentLoaded', (event) => {
  var socket = io.connect('http://localhost:3000');

  socket.on('connect', () => {
    submit.setAttribute('disabled', false);

    socket.on('newUser', userName => {
      var newUser = messageStatus(userName + 'подключился к сети!');
      content.appendChild(newUser);

      //document.querySelector('textarea').value = document.querySelector('textarea').value + userName + ' connected!\n';
    });

    socket.on('userJoined', userName => {
      var userJoined = messageStatus("Ты подключился к чату. Твой username: " + userName);
      content.appendChild(userJoined);

      //document.querySelector('textarea').value = document.querySelector('textarea').value + 'You\'r username:  ' + userName + '\n';
    });

    document.querySelector('#form').addEventListener('submit', () => {
      var message = document.querySelector('#input').value;
      socket.emit('message', message);
      document.querySelector('#input').value = '';
    });

    socket.on('messageToClient', (msg, name) => {
      var message = getMessage(msg, name);
      content.appendChild(message);

      //document.querySelector('textarea').value = document.querySelector('textarea').value + name + ' : ' + msg + '\n';
    });

    socket.on('userDisconnected', name => {
      var userDisconnected = messageStatus(name + 'отключился :(');
      content.appendChild(userDisconnected);
    })

    socket.on('disconnect', () => {
      socket.disconnect();
    });
  });
});