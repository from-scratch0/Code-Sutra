

## 应用程序

Koa应用程序是一个包含一组中间件函数的对象，是按照类似堆栈的方式组织和执行的

```javascript
const Koa = require('koa');
const app = new Koa();
//koa推荐 async 
//ctx context是koa提供一个对象，包括一些常见的方法和属性
app.use(async function (ctx, next) {
    console.log(1);
    await next();
    console.log(2);
});
app.use(async function (ctx, next) {
    console.log('a');
});
app.listen(8080);
```



## 获取请求参数

```javascript
const Koa = require('koa');
const app = new Koa();
// 获取koa的请求参数
// ctx属性：request response（koa封装） req res（node原生）
app.use(function (ctx, next) {
    console.log(ctx.method);
    console.log(ctx.url);
    console.log(ctx.headers);
    console.log(ctx.querystring);//查询字符串
    console.log(ctx.query);
    /**
     * 1. 字符串 Buffer
     * 2. 对象
     * 3. 流
     */
    //res.end res.write.
    //ctx.res.write('hello'); 在koa里不能直接通过 这种写入响应体
    ctx.body = ctx.headers; //ctx.response.body = ctx.headers;;
});
app.listen(8080);
```



## 获取请求体

[获取请求体](querystring.js)

[解析请求体 koa-better-body](koa-better-body.js)

[原理](body.js)



## cookie、session

```javascript
ctx.cookies.get(name, [options]); // 读取上下文请求中的cookie
ctx.cookies.set(name, value, [options]); // 在上下文中写入cookie
```



```
npm i koa-session
```

```javascript
const Koa = require('koa');
const session = require('koa-session');
const app = new Koa();
app.keys = ['fromscratch'];
app.use(session({}, app));
app.use(async (ctx) => {
    let visit = ctx.session.visit;
    if(visit) {
        visit = visit + 1;
    } else {
        visit = 1;
    }
    ctx.session.visit = visit;
    ctx.body = `这是你的第${visit}次访问`;
});
app.listen(3000);
```



## 模板引擎

```
npm i koa-views ejs -S
```

```javascript
const Koa = require('koa');
const views = require('koa-views');
const path = require('path');
const app = new Koa();
app.use(views(path.join(__dirname, './views'), {
    extension: 'ejs'
}));

app.use(async ctx => {
    await ctx.render('index', {name: 'fromscratch'});
});

app.listen(3000);
```



## 静态资源中间件

```
npm i --save koa-static
```

```javascript
const static = require('koa-static');
const app new Koa();
app.use(static(path.join(__dirname, 'public')));
app.use(async(ctx) => {
    ctx.body = 'Not Found';
});
```



## Koa实现

```javascript
// 洋葱结构

const Koa = require('./koa');
const app = new Koa();
//koa推荐 是async 
//ctx context是koa提供一个对象，包括一些常见的方法和属性
app.use(async function (ctx, next) {
    console.log(1);
    await next();
    console.log(2);
});
app.use(async function (ctx, next) {
    console.log(3);
    await next();
    console.log(4);
});
app.use(async function (ctx, next) {
    console.log('5');
    ctx.res.end('ok');
});
//13542
app.listen(8080);
```

[koa](koa.js)

```javascript
class Koa {
    constructor() {
        this.middleware = [];
    }
    use(fn) {
        this.middleware.push(fn);
    }
    listen(port) {
        let middleware = this.middleware;
        require('http').createServer((req, res) => {
            let ctx = { req, res };
            // koa2.0 3.0
            // dispatch(0);
            // function dispatch(idx) {
            //     middleware[idx](ctx, () => next(idx + 1));
            // }
            // [1,2,3]
            // koa1.0原理
            (middleware.reduceRight((val, item) => {
                return item.bind(null, ctx, val);
            }, (function () { })))()
        }).listen(port);
    }
}
module.exports = Koa;
```

