const io = require('socket.io-client');

strings = {
  'connected': '[sys][time]%time%[/time]: Вы успешно соединились к сервером как [user]%name%[/user].[/sys]',
  'userJoined': '[sys][time]%time%[/time]: Пользователь [user]%name%[/user] присоединился к чату.[/sys]',
  'messageSent': '[out][time]%time%[/time]: [user]%name%[/user]: %text%[/out]',
  'messageReceived': '[in][time]%time%[/time]: [user]%name%[/user]: %text%[/in]',
  'userSplit': '[sys][time]%time%[/time]: Пользователь [user]%name%[/user] покинул чат.[/sys]',
};

document.addEventListener('DOMContentLoaded', (event) => {
  var socket;

  if (navigator.userAgent.toLowerCase().indexOf('chrome') != -1) {
    socket = io.connect('http://46.182.31.65:8080', { 'transports': ['xhr-polling'] });
  } else {
    socket = io.connect('http://46.182.31.65:8080');
  }

  socket.on('connect', () => {
    socket.on('message', msg => {
      document.querySelector('#log').innerHTML += strings[msg.event]
        .replace(/\[([a-z]+)\]/g, '<span class="$1">')
        .replace(/\[\/[a-z]+\]/g, '</span>')
        .replace(/\%time\%/, msg.time)
        .replace(/\%name\%/, msg.name)
        .replace(/\%text\%/, unescape(msg.text)
          .replace('<', '&lt;')
          .replace('>', '&gt;')) + '<br>';

      document.querySelector('#log').scrollTop = document.querySelector('#log').scrollHeight;
    });

    document.querySelector('#input').addEventListener('keypress', event => {
      if (event.which == '13') {
        socket.send(escape(document.querySelector('#input').value));
        document.querySelector('#input').value = '';
      }
    });

    document.querySelector('#send').addEventListener('click', event => {
      socket.send(escape(document.querySelector('#input').value));
      document.querySelector('#input').value = '';
    });
  });
  socket.on('disconnect', () => {
    socket.disconnect();
  });
});