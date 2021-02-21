const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
app.use(cookieParser());
app.listen(8080); // 异步
/**
 * Set-Cookie:name=fromscratch; Domain=localhost; Path=/
 * domain 就是指定此cookie是属于哪些域名的
 * C:\Windows\System32\drivers\etc\hosts win8 win10不能直接改 需拷到桌面再拷回去
 */
app.get('/write', function (req, res) {
    // 方法实现
    res.cookie = function (key, val, options) {
        let { domain, path, maxAge, expires, httpOnly, secure } = options;
        let parts = [`${key}=${val}`];
        if (domain) {
            parts.push(`Domain=${domain}`);
        }
        if (path) {
            parts.push(`Path=${path}`);
        }
        if (maxAge) {
            parts.push(`Max-Age=${maxAge}`);
        }
        if (expires) {
            parts.push(`Expires=${expires.toUTCString()}`);
        }
        if (httpOnly) {
            parts.push(`httpOnly`); // 无值 出现即为true
        }
        if (secure) {
            parts.push(`Secure`);
        }
        let cookie = parts.join('; ');
        res.setHeader('Set-Cookie', cookie);
    }
    
    res.cookie('name', 'zfpx', {
        httpOnly: true, //不允许客户端通过浏览器的cookie访问
        secure: true, // HTTPS
        maxAge: 10 * 1000,
        path: '/read2',
        domain: 'localhost',
        expires: new Date(Date.now() + 10 * 1000)
    });
    res.end('ok');
});

app.get('/read', function (req, res) {
    res.send(req.cookies);
});

app.get('/read1', function (req, res) {
    res.send(req.cookies);
});

app.get('/read1/1', function (req, res) {
    res.send(req.cookies);
});