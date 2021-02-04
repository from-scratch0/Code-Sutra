[TOC]

## 异步

### 异步编程目标

让它更像同步编程

- 回调函数实现
- 事件监听
- 发布订阅
- Promise / A+和生成器函数
- Async / await

### 回调callback

所谓回调函数，就是把任务的第二段单独写在一个函数里，等重新执行该任务时，就直接调用这个函数

回调的特点是error first，即回调函数的第一个参数永远是错误对象

```javascript
// 异步读取一个文件
let fs = require('fs');
function read(filename) {
    fs.readFile(filename, 'utf8', function(err, data) {
        throw Error('出错了')；
        if(err) {
            console.log(err);
        } else {
            console.log(data);
        }
    })
}

try {
    let result = read('./1.txt');
} catch(e) {
    console.log('error', e);
}；
// 读取文件时还没执行到回调函数，等文件读完了，try catch已经执行完毕，无法捕捉到错误

let result = read('./1.txt');
console.log(2); // 同步

```

**回调函数的问题**

- 无法捕捉错误 try catch失效
- 不能return 
- 回调地域
  - 难看
  - 难以维护
  - 效率低，因为它们是串行的

```javascript
/*
访问服务器，如请求一个用户列表的HTML页面时，
服务器一方面会读取模板文件，可能是ejs pug jade handlebar
一方面要读取数据，可能在文件或数据库里
它们都很慢，因此都是异步的
*/
fs.readFile('./template.txt', 'utf8', function(err, template) {
    fs.readFile('./data.txt', 'utf8', function(err, data) {
        console.log(template + ' ' + data);
    })
})
```



### 异步流程解决方案

#### 事件发布 / 订阅模型

```javascript
let fs = require('fs');
let EventEmitter = require('events');
let eve = new EventEmitter();
let html = {}; // 存放最终数据 包括template和data

// 监听数据获取成功事件，当事件发生后调用回调函数
eve.on('ready', function(key, value) {
    html[key] = value;
    if(Object.keys(html).length == 2) {
        console.log(html);
    }
});

fs.readFile('./template.txt', 'utf8', function(err, template) {
    // 事件名、传递给回调函数的参数
    eve.emit('ready', 'template', template);
})
fs.readFile('./data.txt', 'utf8', function(err, data) {
    eve.emit('ready', 'data', data);
})
```



#### 哨兵函数

```javascript
let fs = require('fs');

function render(length, callback) {
    let html = {};
    return function(key, value) {
        html[key] = value;
        if(Object.keys(html).length == length) {
            callback(html);
        }
    }
}

let done = render(2, function(html) {
    console.log(html);
});

fs.readFile('./template.txt', 'utf8', function(err, template) {
    // 事件名、传递给回调函数的参数
    eve.emit('ready', 'template', template);
})
fs.readFile('./data.txt', 'utf8', function(err, data) {
    eve.emit('ready', 'data', data);
})
```



#### Promise / Deferred模式

"承诺"，承诺过一段时间后给出结果，而当异步操作时会用到过一段时间，异步是指可能比较长时间才有结果的才做。例如网络请求、读取本地文件等

#### 生成器Generators / yield

- 执行一个函数时，可以在某个点暂停函数的执行，做一些其他工作或携带一些新的值，再返回这个函数继续执行，JavaScript生成器函数即致力于此
- 调用一个生成器函数时，并不会立即执行，而需要手动执行迭代操作（```next```方法），即调用生成器函数会返回一个迭代器，迭代器会遍历每个中断点
- ```next```方法返回值的```value```属性，是Generator函数向外输出数据；```next```方法接受参数，是向Generator函数体内输入数据

```javascript
function *go(a) {
    console.log(1);
    let b = yield a; // 此处b用来供外界输入进来
    console.log(2);
    let c = yield b;
    console.log(3);
    return c;
}

let it = go('a');
let r1 = it.next(); // next第一次执行不需要参数，传参数没有意义
console.log(r1); // { value: 'a', done: false }

let r2 = it.next('B值');
console.log(r2); // { value: 'B值, done: false }

let r3 = it.next();
console.log(r3); // { value: undefined, done: true }
```



### Async / await