'use strict';
var osc = require('node-osc');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const socketio = require('socket.io')(http);
const PORT = 9266;

var oscServer = new osc.Server(9696, '192.168.1.2');
// var client = new osc.Client('127.0.0.1', 3333);
console.log("start up");
// console.log(oscServer);


app.use(express.static('docs'));
var server = app.listen(PORT, function(){
    console.log("Node.js is listening to PORT:" + server.address().port);
    var io = socketio.listen(server);

    oscServer.on('message', function (msg) {
        // console.log('Message:');
        // console.log(msg);
        io.emit('frag',msg);

    });
});


