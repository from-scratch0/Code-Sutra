// parser方法解析请求对象，其实就是请求信息，然后解析出请求头，再传给请求监听函数
let fs = require('fs');
let path = require('path');
let { StringDecoder } = require('string_decoder');

let decoder = new StringDecoder(); //把buffer转成字符串 可以保不乱码
// 流读一点少一点
// 总请求长度是130K，请求头部分是70K，请求体是60K
// 1 64K
// 2 64K   
// 3 2K
function parser(requestStream, requestListener) { // 流对象解析为req 回调函数
    function onReadable() {
        let buf;
        let buffers = [];
        while (null != (buf = requestStream.read())) {
            buffers.push(buf);
            let result = Buffer.concat(buffers);

            let str = decoder.write(result); //把buffer转成字符串

            if (str.match(/\r\n\r\n/)) { // 回车换行 请求头和请求体之间的空行
                let values = str.split(/\r\n\r\n/); // 数组
                
                // 请求头
                let headers = values.shift(); 
                let headerObj = parseHeader(headers);
                Object.assign(requestStream, headerObj);

                // 已经解析出请求头 跳出循环
                requestStream.removeListener('readable', onReadable); 

                // 多拿出的请求体要“吐出” 以使data拿到完整的请求体
                let body = values.join('\r\n\r\n');
                requestStream.unshift(Buffer.from(body)); // unshift

                // 解析完成调用callback
                return requestListener(requestStream); 
            }
        }
    }

    requestStream.on('readable', onReadable);
}

function parseHeader(headerStr) {
    let lines = headerStr.split(/\r\n/);
    let startLine = lines.shift(); // 请求行
    let starts = startLine.split(' ');
    let method = starts[0];
    let url = starts[1];
    let protocal = starts[2];
    let protocalName = protocal.split('/')[0];
    let protocalVersion = protocal.split('/')[1];

    let headers = {};
    lines.forEach(line => {
        let row = line.split(': ');
        headers[row[0]] = row[1];
    });

    return { headers, method, url, protocalName, protocalVersion };
}

let rs = fs.createReadStream(path.join(__dirname, 'req.txt')); // 请求数据
parser(rs, function (req) { // 解析请求数据
    console.log(req.method); // POST
    console.log(req.url); // /User
    console.log(req.headers);
    
    req.on('data', function (data) {
        console.log(data.toString());
    });
    req.on('end', function () {
        console.log('请求处理结束，开始响应 res.end()');
    });
});

// 基于TCP服务器构建HTTP服务器 将socket拆成2个对象，一个请求一个响应