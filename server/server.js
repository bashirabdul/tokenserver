
  var express = require('express');
  var app = express();
  var path = require('path');
  var server = require('http').createServer(app);
  const io = require('socket.io')(server);
  var Queue = require('queue.js');
  var port = process.env.PORT || 3000;
  
  server.listen(port, () => {
    console.log('Server listening at port %d', port);
  });
  
    
  // Chatroom
  const departments = ["finance","admissions","registration","student affairs", "documentation"];
  let finance = new Queue(), admissions = new Queue(), registration = new Queue(), studentAffairs = new Queue(), documentation = new Queue();
let currentFin = 0, currentAd = 0, currentReq = 0, currentSA = 0, currentDoc = 0; 
  var numUsers = 0;
  
  io.on('connection', (socket) => {
    var addedUser = false;
    console.log("user connnected");
  
    // when the client emits 'new message', this listens and executes
    socket.on('new message', (data) => {
      // we tell the client to execute 'new message'
      socket.broadcast.emit('new message', {
        username: socket.username,
        message: data
      });
    });
  
    socket.on('finance', (data) => {
      // we tell the client to execute 'new message'
      var token  = "F" + (1000 + currentFin);
      finance.enqueue('{"token" : token, "attended" : false}')
      io.of('/').sockets[socket.id].emit('finance', {
        message: token
      });
      console.log(finance.peek());
    });
    // when the client emits 'add user', this listens and executes
    socket.on('add user', (username) => {
      if (addedUser) return;
  console.log("added user");
      // we store the username in the socket session for this client
      socket.username = username;
      ++numUsers;
      addedUser = true;
      socket.emit('login', {
        numUsers: numUsers
      });
      // echo globally (all clients) that a person has connected
      socket.broadcast.emit('user joined', {
        username: socket.username,
        numUsers: numUsers
      });
    });
  
    // when the user disconnects.. perform this
    socket.on('disconnect', () => {
      if (addedUser) {
        --numUsers;
  
        // echo globally that this client has left
        socket.broadcast.emit('user left', {
          username: socket.username,
          numUsers: numUsers
        });
      }
    });
  });







