const app = require('express')();
const http = require('http').Server(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const port = process.env.PORT || 5000;

// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/index.html');
// });

io.on('connection', (socket) => {
  socket.on('create_ticket', msg => {
    console.log('create_ticket')
    // {
    //   response: 'success|error'
    //   error_message: null,
    //   data: {
    //     ticket_id: 'x'
    //   }
    // }
  });

  socket.on('send_message', msg => {
    console.log('send_message')
    // {
    //   response: 'success|error'
    //   error_message: null,
    //   data: {
    //     message_id: 'x', 
    //     status: 'delivered|failed'
    //   }
    // }
  });

  socket.emit('receive_message', msg => {
    console.log('receive_message')
  });

  socket.on('take_tikcet', msg => {
    console.log('take_tikcet')
    // {
    //   response: 'success|error'
    //   error_message: null,
    //   data: {
    //     ticket_id: 'xx',
    //     status: 'in_progress',
    //     agent_id: 'xx'
    //   }
    // }
  });

  socket.on('ticket_updated', msg => {
    console.log('ticket_updated')
  });

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