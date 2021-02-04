let net = require('net');

// 创建一个服务器，监听客户端的连接，当客户端连接上来之后执行监听函数
// socket是一个双工流duplex，可读可写
let server = net.createServer(function(socket) {
    server.maxConnections = 2; // 表示客户端可以连接的总数量
    // 获取当前有多少客户端正在连接服务器
    server.getConnections((err, count) => {
        console.log(`欢迎光临，现在连接的客户端总数量是${count}个，客户端可连接的总数量是${server.maxConnections}`);
    });

    console.log('客户端已经连接');
    console.log(socket.address());
    socket.setEncoding('utf8');

    socket.on('data', function(data) {
        console.log('接收到客户端发过来的数据：%s %s', data, 1);
        socket.write("服务器确认：" + data);
    });

    socket.on('error', function(err) {
        console.log(err);
    });

    // 服务器收到客户端发出的关闭连接请求时会触发end事件
    socket.on('end', function() {
        console.log('end');

        // 一旦调用此方法，则当所有的客户端关闭跟本服务器的连接后，将关闭服务器
        server.unref();
    }); // 在此客户端没有真正关闭，只是开始关闭

    // 执行服务器端的close方法后，将不再接收新的连接，但也不会关闭现有服务器
    // setTimeout(function() {
    //     server.close();
    // }, 5000); // 5秒后会关闭此服务器，不再接收新的客户端

    // 真正关闭时会触发close事件
    socket.on('close', function(hasError) {
        console.log('客户端已关闭', hasError); // hasError为true表示异常关闭，否则表示异常关闭
    });
});
// server.listen(8080, function() {
//     console.log(server.address());
//     console.log('服务器启动成功');
// });

server.on('close', function() {
    console.log('服务器端已关闭');
});

server.on('error', function(err) {
    console.log(err);
});

server.listen(8080, function() {
    console.log(server.address());
    console.log('服务器已启动');
});

// telnet localhost 8080
