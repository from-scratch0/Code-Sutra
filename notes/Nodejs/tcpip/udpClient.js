let dgram = require('dgram');
let socket = dgram.createSocket('udp4');

// 向对方发送消息
let buf = Buffer.from('珠峰培训');
socket.send(buf, 3, 6, 41234, 'localhost', function() {
    console.log(arguments);
});

socket.on('message', function(msg, rinfo) {
    console.log(msg.toString());
});