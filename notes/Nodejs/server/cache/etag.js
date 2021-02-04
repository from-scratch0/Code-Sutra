let http = require('http');
let url = require('url');
let path = require('path');
let fs = require('fs');
let mime = require('mime');
let crypto = require('crypto');

http.createServer(function (req, res) {
    let { pathname } = url.parse(req.url, true);

    let filepath = path.join(__dirname, pathname);
    fs.stat(filepath, (err, stat) => {
        if (err) {
            return sendError(req, res);
        } else {
            let ifNoneMatch = req.headers['if-none-match'];
            let out = fs.createReadStream(filepath); // 文件大于内存 入流
            let md5 = crypto.createHash('md5');

            out.on('data', function (data) {
                md5.update(data);
            });

            out.on('end', function () { 
                let etag = md5.digest('hex');
                // let etag = `${stat.size}`;
                if (ifNoneMatch == etag) {
                    res.writeHead(304);
                    res.end('');
                } else {
                    return send(req, res, filepath, etag);
                }
            });

        }
    });
}).listen(8080);
function sendError(req, res) {
    res.end('Not Found');
}
function send(req, res, filepath, etag) {
    res.setHeader('Content-Type', mime.getType(filepath));
    //第一次服务器返回的时候，会把文件的内容算出来一个标识，发给客户端
    //客户端看到etag之后，也会把此标识符保存在客户端，下次再访问服务器的时候，发给服务器
    res.setHeader('ETag', etag);
    fs.createReadStream(filepath).pipe(res);
}