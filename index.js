const app = require('express')();
const http = require('http').Server(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const port = process.env.PORT || 5000;

const randomizeUpdateStatus = () =>
{
  const statusChange = [{
    from: 'open',
    to: 'in_progress'
  },{
    from: 'in_progress',
    to: 'done'
  },{
    from: 'done',
    to: 'in_progress'
  }]
  const randIdx = Math.floor(Math.random() * 3)
  return statusChange[randIdx]
}

const randomizeID = () => Math.floor(Math.random() * 1000)

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {

  socket.on('server_ticket_updated', () => {
    console.log('server_ticket_updated')
    const status = randomizeUpdateStatus();
    return io.sockets.emit('ticket_updated', status)}
  );

  socket.on('take_ticket', (data, callback) => {
    console.log('server_take_ticket', data)
    callback({
        response: 'success',
        error_message: null,
        data: {
          ticket_id: randomizeID(),
          status: 'in_progress',
          agent_id: data.agent_id
        }
      });
    }
  );

  socket.on('send_message', (res, callback) => {
    console.log(res)
    callback({
      response: 'success',
      error_message: null,
      data: {
        message_id: res.ticket_id,
        status: 'delivered'
      }
    })
    return io.sockets.emit('server_send_message', res.message.body)
  })

  socket.on('user_send_message', (msg) => {
    console.log(msg);
    return io.sockets.emit('receive_message', {
      ticket_id: 'T-7117',
      sender: {
        id: 'x',
        name: 'yosy',
        role: 'dokter'
      },
      message: {
        type: 'text',
        body: msg,
      },
      created_at: '2023:12:12',
    })
  })

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