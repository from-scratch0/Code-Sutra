// 创建http服务器
// http服务器是继承自tcp服务器的 http协议是应用层协议 是基于tcp的
// 对请求和响应进行了包装
// req 可读流
// res 可写流
let http = require('http');
let url = require('url'); // 实现路径解析

let server = http.createServer();
// 当客户端连接上服务器之后执行回调
server.on('connection', function(socket) {
    console.log('客户端连接');
});

// 服务器监听客户端的请求，当有请求到来的时候执行回调
// git bash: curl -v -data "name=fromscratch" -X POST http://localhost:8080
/*
> POST / HTTP/1.1
> Host: localhost:8080
> User-Agent: curl/7.68.0
> Accept: *
> Content-Length: 16
> Content-Type: application/x-www-form-urlencoded
>
} [16 bytes data]
*/
// req代表客户端的连接，server服务器把客户端的请求信息进行解析，然后放在req上面
// res代表响应，如果希望向客户端回应消息，需要通过res
server.on('request', function(req, res) {
    console.log(req.method); // 获取请求方法名
    let urlObj = url.parse(req.url, true); // true:query是一个对象
    // parse方法用来把字符串转换成对象
    // stringify方法用来把对象转换成字符串
    console.log(urlObj); // 请求路径 req.protocal 请求协议
    console.log(url.format(urlObj));
    // let { pathname, query} = url.parse(req.url, true);
    console.log(req.headers); // 请求头对象
    
    let result = [];
    req.on('data', function(data) {
        result.push(data);
    });

    req.on('end', function() {
        let r = Buffer.concat(result); // 请求体
        console.log(r.toString());
        res.end(r);
    })
});
// 只要客户端向服务器发送消息 每次都会触发request事件

server.on('close', function(req, res) {
    console.log('服务器关闭');
});

server.on('error', function(err) {
    console.log('服务器错误');
});

server.listen(8080, function() {
    console.log('server started at http://localhost:8080');
});

// curl -v http://localhost:8080
// curl --help