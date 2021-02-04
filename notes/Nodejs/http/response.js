// 如何向客户端写入响应信息
let http = require('http');

/*
< HTTP/1.1 200 OK
< Date: Sat, 23 Jan 2021 07:41:50 GMT
< Connection: keep-alive
< Transfer-Encoding: chunked 分块传输
< Content-Length: 16
<
{ [16 bytes data]
100    32  100    16  100    16    432    432 --:--:-- --:--:-- --:--:--   888
name=fromscratch
*/
let server = http.createServer(function(req, res) {
    res.statusCode = 200; // 设置响应码
    res.sendDate = false; // Date响应头默认会设置，可以设置为false
    res.setHeader('Content-Type', 'text/html;charset=utf8'); // 设置响应头
    console.log(res.getHeader('Content-Type')); // 获取响应头
    console.log('headersSent1', res.headersSent); // 响应头是否已发送过
    res.removeHeader('Content-Type'); // 删除响应头

    // 写响应头
    // writeHead一旦调用会立刻向客户端发送 setHeader不会
    res.writeHead(200, '成功啦', {
        'Content-Type': 'text/html;charset=utf8'
    });
    console.log('headersSent1', res.headersSent); 
    // 当调用writeHead 或调用write方法时才会向客户端发送响应头

    res.write('hello');
    res.write('world');

    res.end();
    // Error: write after end
});
server.listen(8080);