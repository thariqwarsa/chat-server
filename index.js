const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  io.emit('server_send_message', 'server: someone connected!')

  socket.on('user_send_message', msg => {
    io.emit('user_send_message', `user: ${msg}`)
  });

  socket.on('disconnect', () => {
    io.emit('server_send_message', `server: a user disconnected`)
  })
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
