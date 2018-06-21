var PORT = 8080;
var express = require('express');
const server = express()
  .use((req, res) => console.log("device connected") )
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));
  const io = require('socket.io')(server);

  io.on('connection', (socket) => {
    console.log('Client connected');
    socket.on('disconnect', () => console.log('Client disconnected'));
  });

  setInterval(() => io.emit('time', new Date().toTimeString()), 1000);


