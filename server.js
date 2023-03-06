const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/client.html');
});

io.on('connection', (socket) => {
  const userId = socket.handshake.headers.user_id
  
  io.emit('user_connected', {
    sender_id: 'SERVER',
    message: `User ${userId} is connected!`
  });
  
  socket.on('send_message', data => {
    io.emit('receive_message', data);
  });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
