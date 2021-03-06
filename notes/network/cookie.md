## Cookie

HTTP1.0中协议是无状态的，但在WEB应用中，在多个请求之间共享会话是非常必要的

cookie是为了辨别用户身份，进行会话跟踪而存储在**客户端**上的数据，本质上就是浏览器里面存储的一个很小的文本文件，内部以键值对的方式来存储(在chrome开发者面板的Application这一栏可以看到)

向同一个域名下发送请求，都会携带相同的 Cookie，服务器拿到 Cookie 进行解析，便能拿到客户端的状态。而服务端可以通过响应头中的`Set-Cookie`字段来对客户端写入`Cookie`



### cookie处理流程

第一次客户端向服务端发起请求

服务器通过响应头```Set-Cookie```向客户端种植```Cookie``` 属性之间用分号空格分隔

客户端再次向服务器发起请求时会带上```Cookie```请求头

服务器通过读取请求头中的```Cookie```并进行响应



### 属性

生存周期 作用域 安全相关

| 属性             | 说明                                                         |
| ---------------- | ------------------------------------------------------------ |
| ```name=value``` | 键值对，要保存的Key/Value                                    |
| ```Expires```    | 过期时间（s），在该时间点后失效                              |
| ```Max-Age```    | 最大失效时间（s），在多少时间后失效，从浏览器收到报文开始计算 |
| ```Domain```     | 域名，默认当前域名                                           |
| ```Path```       | 表示cookie影响到的路径，路径不匹配时，浏览器不发送该cookie，```/```表示域名下任意路径都允许使用cookie |
| ```Secure```     | 带上secure时，cookie在HTTP中无效，在HTTPS中才有效            |
| ```HttpOnly```   | 若设置了该属性，则只能通过HTTP协议传输，通过程序（JS脚本）将无法读取到cookie信息，防止XSS攻击产生 |
| ```SameSite```   | 可以设置为三个值，`Strict`、`Lax`和`None`                    |

> 对于 CSRF 攻击的预防，也有`SameSite`属性

`SameSite`可以设置为三个值，`Strict`、`Lax`和`None`。

**a.** 在`Strict`模式下，浏览器完全禁止第三方请求携带Cookie。比如请求`sanyuan.com`网站只能在`sanyuan.com`域名当中请求才能携带 Cookie，在其他网站请求都不能。

**b.** 在`Lax`模式，就宽松一点了，但是只能在 `get 方法提交表单`况或者`a 标签发送 get 请求`的情况下可以携带 Cookie，其他情况均不能。

**c.** 在`None`模式下，也就是默认模式，请求会自动携带上 Cookie。



### cookie使用

```javascript
// 原生实现

let http = require('http');
let server = http.createServer(function (req, res) {
    if (req.url == '/write') {//向客户端写入cookie
        res.setHeader('Set-Cookie', "name=fromscratch");
        res.end('write ok');
    } else if (req.url == '/read') {
        //客户端第二次请求的时候会向服务器发送   Cookie
        let cookie = req.headers['cookie'];
        res.end(cookie);
    } else {
        res.end('Not Found');
    }
}).listen(8080);
```

```javascript
// express实现

const express = require('express');
const cookieParser = require('cookie-parser'); // 中间件
const app = express();

app.use(cookieParser('fromscrach')); // 传入密钥

app.get('/write', function(req, res) {
    // signed=true  基于值和密钥签了个名，一旦值被改掉则签名验证会失败。防篡改
    res.cookie('name', 'fromscratch', {signed: true});
    res.end('write ok');
});

app.get('/read', function(req, res) {
    // let cookie = req.headers['cookie']; // express未封装cookie解析
    res.send(req.cookies); // 只能读到未签名的值
    console.log(req.signedCookies); // 读签名的值
    // console.log(decodeURIComponent());
});

app.listen(8080);
```



### cookie实现登录

[权限控制](cookie/cookieApp.js)



### cookie原理

[cookie原理](cookie/cookie.js)



### 使用注意事项

**Cookie缺点**

1. 容量缺陷：Cookie 的体积上限只有`4KB`，只能用来存储少量的信息

2. 性能缺陷：Cookie 紧跟域名，不管域名下面的某一个地址需不需要这个 Cookie ，请求都会携带上完整的 Cookie，这样随着请求数的增多，其实会造成巨大的性能浪费的，因为请求携带了很多不必要的内容

   可以通过`Domain`和`Path`指定**作用域**来解决

3. 安全缺陷：由于 Cookie 以纯文本的形式在浏览器和服务器中传递，很容易被非法用户截获，然后进行一系列的篡改，在 Cookie 的有效期内重新发送给服务器，这是相当危险的

   **在`HttpOnly`为 false 的情况下，Cookie 信息能直接通过 JS 脚本来读取**

- 可能被客户端篡改，使用前验证合法性
- 不要存储敏感数据，比如用户密码、账户余额
- 使用```httpOnly```保证安全
- 尽量减少```cookie```的体积
- 设置正确的```domain```和```path```，减少数据传输



## Session

session是另一种记录客户状态的机制，不同的是cookie保存在客户端浏览器上，而session保存在服务器上

客户端浏览器访问服务器时，服务器把客户端信息以某种形式记录在服务器上，即session，客户端浏览器再次访问时只需要从该session中查找该客户的状态就可以了



### cookie和session区别

- cookie数据存放在客户的浏览器上，session数据放在服务器上
- cookie不是很安全，别人可以分析存放在本地的cookie并进行cookie欺骗，考虑安全应该使用session
- session会在一定时间内保存在服务器上，当访问量增多，会较占用服务器的性能，考虑减轻服务器性能时应当使用cookie
- 单个cookie保存的数据不能超过4K，很多浏览器都限制一个站点最多保存20个cookie

> 将登陆信息等重要信息存放在session、其他信息如果需要保留，可以放在cookie中



### session处理流程与实现

1. 用户向服务器发送用户名密码等信息
2. 服务器通过验证后在服务器端生成全局唯一标识符```session_id```，在服务器内存里开辟此```session_id```对应的数据存储空间（可自定义），保存相关数据，如用户角色，登录时间等
3. 将```session_id```作为全局唯一标识符通过```cookie```发送给客户端
4. 以后客户端再次访问服务器时会把```session_id```通过请求头中的```cookie```发送给服务器
5. 服务器再通过```session_id```把此标识符在服务器端的数据取出


[基于cookie模拟session](cookie/session.js)



### session中间件

``` 
npm i express-session
```

| 参数              | 描述                                                         |
| ----------------- | ------------------------------------------------------------ |
| name              | 设置cookie中，保存session的字段名称，默认connect.sid         |
| store             | session的存储方式，默认在内存中，也可以使用redis、mongodb等  |
| secret            | 通过设置secret字符串，计算hash值存放在cookie中，使产生的signedCookie防篡改 |
| cookie            | 设置存放session id的cookie的相关选项，默认（default:{ path: '/', httpOnly: true, secure: false, maxAge: null }） |
| genid             | 产生一个新的session_id时使用的函数，默认使用uid2包           |
| rolling           | 每个请求都重新设置一个cookie，默认false                      |
| saveUninitialized | 指无论有无session cookie，每次请求都设置个session cookie，默认给个标识为connect.sid |
| resave            | 指每次请求都重新设置session cookie，例如若cookie是10 min过期，每次请求都再设置10 min |



### session使用

[session in express](cookie/sessionApp.js)



### 自定义存储位置

[自定义session存储位置](cookie/session-store.js)



## Token

用于身份验证，无状态，不需要保存在服务器中，保存在客户端中

用只有服务器才知道的秘钥，对数据做一个签名，把签名和数据一起作为token，不能被伪造

1. 用户名和密码发送给服务器
2. 服务器验证通过后，返回token
3. 客户端带上token发送需要权限的请求
4. 服务器验证token并返回数据

能够防止CSRF

`Access-Control-Allow-Origin: *`只要有了通过验证的token，数据和资源就能够在任何域上请求