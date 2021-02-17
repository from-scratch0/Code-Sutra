//---------------------------------------------HTTP服务
const express = require('express');
const path = require('path');
const app = express();

app.get('/', function(req,res) {
    res.sendFile(path.resolve(__dirname, 'index.html'));
});


//----------------------------------------------websocket服务
let WSServer = require('ws').Server;
let wsServer = new WSServer({port: 8888});

//监听客户端的连接，当客户端连接上服务器之后执行相应回调
// socket：插座 每个客户端连接上服务器之后都会创建一个唯一的socket对象，代表该客户端
wsServer.on('connection', function(socket) {
    console.log('客户端已经连接');
    // 监听客户端发来的
    socket.on('message', function(message) {
        console.log(message);
        socket.send('server:' + message);
    });
});

// 核心：connection 连接 message 发消息