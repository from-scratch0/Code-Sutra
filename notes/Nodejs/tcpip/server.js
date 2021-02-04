// resume pause
let net = require('net');
let path = require('path');
let ws = require('fs').createWriteStream(path.join(__dirname, 'msg.txt'));

let server = net.createServer(function(socket) {
    socket.pause();
    // 客户端的超时时间
    socket.setTimeout(3*1000);
    // err: write after end 在文件关闭后再次写入

    socket.on('timeout', function() {
        console.log('timeout');
        // 默认情况下，当可读流读到末尾时会关闭可写流
        socket.pipe(ws, { end: false});
    });
});

server.listen(8080);