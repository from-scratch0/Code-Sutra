/**
 * 1. 写爬虫
 * 2. node做中间层
 */
let http = require('http');

let options = {
    host: 'localhost',
    port: 8080,
    method: 'POST',
    headers: {
        //"Content-Type": 'application/x-www-form-urlencoded',
        "Content-Type": 'application/json'
    }
}

//请求并没有真正发出 req也是一个流对象，是一个可写流
let req = http.request(options);

//当服务器端把请求体发回来的时候，或者说客户端接收到服务器端响应的时候触发
req.on('response', function (res) {
    console.log(res.statusCode);
    console.log(res.headers);
    let result = [];
    res.on('data', function (data) {
        result.push(data);
    });
    res.on('end', function (data) {
        let str = Buffer.concat(result);
        console.log(str.toString());
    });
});

// 向请求体里写数据
// req.write('name=fromscratch&age=23');
req.write('{"name":"fromscatch"}');
// 结束写入请求体，只有在调用end的时候才会真正向服务器发请求
req.end();