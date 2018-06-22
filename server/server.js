
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
      finance.enqueue({"token" : token, "attended" : false})
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


  class Queue {
        constructor() {
      this.head = undefined;
      this.tail = undefined;
      this.length = 0;
    }
    
     push(data) {
      this.add({ data: data, prev: this.tail, next: undefined });
      return this;
    }
    
    pop() {
      return this.tail && this.remove(this.tail).data;
    }
    
    shift() {
      return this.head && this.remove(this.head).data;
    }
    
    unshift (data) {
      this.add({ data: data, prev: undefined, next: this.head });
      return this;
    }
    
    add(item) {
      if(!item) return undefined;
    
      if(item.prev) item.prev.next = item;
      if(item.next) item.next.prev = item;
    
      if(item.prev == undefined) this.head = item;  // add before head
      if(item.next == undefined) this.tail = item;  // add to end
    
      this.length++;
    
      return item;
    }
    
    remove(item) {
      if(!item) return undefined;
    
      if(this.head == item) this.head = item.next;  // removing head
      if(this.tail == item) this.tail = item.prev;  // removing tail
    
      if(item.prev) item.prev.next = item.next;
      if(item.next) item.next.prev = item.prev;
    
      this.length--;
    
      return item;
    }
    
    concat(queue) {
      if(this.head == undefined) {
        this.head = queue.head;
        this.tail = queue.tail;
        this.length = queue.length;
        return this;
      }
      queue.head.prev = this.tail;
      this.tail.next = queue.head;
      this.tail = queue.tail;
      this.length += queue.length;
      return this;
    }
    
    // Use this to implement sort, insert, filter, take, drop, fold, map
    forEach(func, condition) {
      for(var current = this.head; current; current = current.next) {
        if(condition && !condition(current.data)) break;
        func(current.data);
      }
    }
    
  }





