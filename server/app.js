// const express = require('express')
"use strict";
import express from 'express';
import path from 'path';
const app = express()

import socket from 'socket.io';

app.use(express.static('public'));

app.use(express.static('client'));

// webpack will serve public/index.html for get '/'

// temp for testing
app.get('/home', function(req, res) {
  console.log('here is the dirname', __dirname);
    res.sendFile(path.join(__dirname + '/../client/index.html'));
});

const server = app.listen(8000, function () {
  console.log('Example app listening on port 8000!')
});

const io = socket.listen(server);

io.on('connection', function (socket) {
  console.log("sockets work!");
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
}); 