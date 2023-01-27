const app = require('express')();
const http = require('http').Server(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {

  socket.on('server_ticket_updated', () => {
    console.log('server_ticket_updated')
    return io.sockets.emit('ticket_updated', {
      from: 'open',
      to: 'in_progress'
    })}
  );

  socket.on('disconnect', () => {
    io.emit('server_log', `a user disconnected`)
  })
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});

// {
//   response: 'success|error'
//   error_message: 'something wrong',
//   data: null
// }

// create_ticket ON
// send_message ON
// receive_message EMIT
// take_ticket ON
// ticket_updated EMIT