
  var express = require('express');
  var app = express();
  var path = require('path');
  var server = require('http').createServer(app);
  const io = require('socket.io')(server);
  var port = process.env.PORT || 3000;
  
  server.listen(port, () => {
    console.log('Server listening at port %d', port);
  });

     
  // Chatroom
  const departments = ["finance","admissions","registration","student affairs", "documentation"];
  let finance = [], admissions = [], registration = [], studentAffairs = [], documentation = [];
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
  
    socket.on('admissions', (data) => {
      // we tell the client to execute 'new message'
      var user = data.username;
    

      var found = admissions.find(function(element) {
        if(element.user === user){
          return true;
         }
          return false ;
      });

      if(!found){
        currentAd+= 1;
        var token  = "A" + (1000 + currentAd);
        admissions.push({"user": user, "token" : token, "attended" : false})
      }
      
      
      io.of('/').sockets[socket.id].emit('admissions', {
        user: user, 
        message: token,
        time: 300000 * admissions.length
      });
      console.log(admissions);
      console.log("Current Number of Admission tokens\n\n");
      console.log(currentAd);
    });

    socket.on('finance', (data) => {
      // we tell the client to execute 'new message'
      var user = data.username;

     

      var found = finance.find(function(element) {
       if(element.user === user){
        return true;
       }
        return false ;
      });

      if(!found){
        currentFin+= 1;
        var token  = "F" + (1000 + currentFin);
        finance.push({"user": user, "token" : token, "attended" : false});

        io.of('/').sockets[socket.id].emit('finance', {
          "user": user, 
          "token": token,
          "time": 300000 * finance.length
        });
      }
    
   

    });

    socket.on('getfinance', (data) => {
      // we tell the client to execute 'new message'
      var object = [];
      finance.forEach((element,index) => {
        object.push({"user" : element.user, "token" : element.token, "timeleft" : index * 300000 })
      });
      io.of('/').sockets[socket.id].emit('getfinance', {
        message: object
      });
      console.log(object);
  
    });

    socket.on('currfinance', (data) => {
      var user = data.username;
      // we tell the client to execute 'new message'
      var i = 0;
      var object = 
      finance.find((element,index) => {
        i = index;
        return element.user == user;
      });
      if(object != null || object != empty){
      io.of('/').sockets[socket.id].emit('getfinance', {
        message: {"user" : object.user, "token" : object.token, "timeleft" : i * 300000 }
      });
    }
      console.log(object);
  
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


 





