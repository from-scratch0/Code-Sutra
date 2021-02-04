let http = require('http');
let path = require('path');
let url = require('url');
let zlib = require('zlib');
let fs = require('fs');
let { promisify } = require('util');
let mime = require('mime'); // npm i mime -S

//把一个异步方法转成一个返回promise的方法
let stat = promisify(fs.stat);
/*
客户端向服务器发起请求的时候，会通过accept-encoding告诉服务器我支持的解压缩的格式
Accept-Encoding:gzip, deflate, br
*/
http.createServer(request).listen(8080);
async function request(req, res) {
    // localhost:8080/msg.txt
    let { pathname } = url.parse(req.url);// /msg.txt
    // C:\dev\CodeSutra\notes\Nodejs\静态文件服务器\msg.txt
    let filepath = path.join(__dirname, pathname); 

    try {
        // await is only valid in async function
        let statObj = await stat(filepath);
        // 根据不同的文件内容类型返回不同的Content-Type
        res.setHeader('Content-Type', mime.getType(pathname));

        //为了兼容不同的浏览器，node把所有的请求头全转成了小写
        let acceptEncoding = req.headers['accept-encoding'];

        // 内容协商
        if (acceptEncoding) {
            if (acceptEncoding.match(/\bgzip\b/)) { // 单词边界
                //服务器告诉客户端用什么压缩方法压缩了
                res.setHeader('Content-Encoding', 'gzip');
                fs.createReadStream(filepath).pipe(zlib.createGzip()).pipe(res);
            } else if (acceptEncoding.match(/\bdeflate\b/)) {
                res.setHeader('Content-Encoding', 'deflate');
                fs.createReadStream(filepath).pipe(zlib.createDeflate()).pipe(res);
            } else {
                fs.createReadStream(filepath).pipe(res); // 服务器没有能提供的压缩方法
            }
        } else {
            fs.createReadStream(filepath).pipe(res); // 不支持就不压缩
        }
    } catch (e) { 
        res.statusCode = 404;
        res.end();
    }
}

// localhost:8080/msg.txt

// curl -v -H "Accept-Encoding: deflate" http://localhost:8080/msg.txt
