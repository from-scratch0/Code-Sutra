let dgram = require('dgram');
let socket = dgram.createSocket('udp4');

// 收消息 在本机41234端口上监听消息
socket.bind(41234, 'localhost');

// 监听对方发来的消息
socket.on('message', function(msg, rinfo) {
    console.log(msg.toString());
    socket.send(Buffer.from(msg), 0, msg.length, rinfo.port, rinfo.address);
});