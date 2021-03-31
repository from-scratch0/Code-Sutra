[TOC]

## 异步

异步，简单来说就是一个任务分成两段，先执行第一段，然后转而执行其他任务，做好了准备再回头执行第二段

### 高阶函数

- 可以用于批量生成函数
- 可以用于需要调用多次才执行的函数

[highorder](./highorder.js)

### 异步编程目标

#### 让它更像同步编程

- 回调函数实现
- 事件监听
- 发布订阅
- Promise / A+和生成器函数
- Async / await

#### 回调地域

在需要多个操作的时候，如异步返回值又依赖另一个异步返回值，会导致多个回调函数嵌套，导致代码不够直观

#### 并行结果

如果几个异步操作之间并没有前后顺序之分，但需要等多个异步操作都完成后才能执行后续的任务，无法实现并行节约时间



### 回调`callback`

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

#### 回调函数的问题

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

订阅事件实现了一个事件与多个回调函数的关联

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

Promise就是一个用于保存异步操作结果的容器，当异步操作完成后，保存了值或者错误信息——"承诺"，承诺过一段时间后给出结果，而当异步操作时会用到过一段时间，异步是指可能比较长时间才有结果的才做，例如网络请求、读取本地文件等

##### 解决回调函数问题

Promise 利用了三大技术手段来解决回调地狱：

- 回调函数延迟绑定

  回调函数不是直接声明的，而是在通过后面的 then 方法传入的，即延迟传入

- 回调返回值穿透

  根据 `then` 中回调函数的传入值创建不同类型的Promise, 然后把返回的 Promise 穿透到外层, 以供后续的调用，内部返回的 Promise 后面可以依次完成<u>链式调用</u>

- 错误冒泡

  一旦其中有一个PENDING状态的 Promise 出现错误后状态必然会变为失败, 然后执行 `onRejected`函数，而这个 `onRejected` 执行又会抛错，把新的 Promise 状态变为失败，新的 Promise 状态变为失败后又会执行`onRejected`......就这样一直抛下去，直到用`catch` 捕获到这个错误，才停止往下抛

```
npm i -g promises-aplus-tests
promises-aplus-tests Promise.js
```

##### 引入微任务进行回调

Promise 中的执行函数是同步进行的，但是里面存在着异步操作，在异步操作结束后会调用 resolve 方法，或者中途遇到错误调用 reject 方法，这两者都是作为微任务进入到 `EventLoop` 中

其实就是如何处理回调的问题，总结起来有三种方式：

1. 使用同步回调，直到异步任务进行完，再进行后面的任务
   显然不可取，因为同步的问题非常明显，会让整个脚本阻塞住，当前任务等待，后面的任务都无法得到执行，导致 CPU 的利用率非常低，而且还有另外一个致命的问题，就是无法实现延迟绑定的效果

2. 使用异步回调，将回调函数放在进行<u>宏任务队列</u>的队尾
   执行回调(resolve / reject)的时机应该是在前面所有的宏任务完成之后，倘若现在的任务队列非常长，那么回调迟迟得不到执行，造成应用卡顿

3. 使用异步回调，将回调函数放到<u>当前宏任务中</u>的最后面

Promise A+中规定成功和失败的回调都是微任务，由于浏览器中 JS 触碰不到底层微任务的分配，可以直接拿 `setTimeout`(属于宏任务的范畴) 来模拟，用 `setTimeout`将需要执行的任务包裹

##### 实现

[手写](Promise.js)

Promise 的本质是一个**有限状态机**，存在三种状态:

- PENDING(等待)
- FULFILLED(成功)
- REJECTED(失败)

当创建Promise对象时，它就处于Pending阶段，关联着某个异步操作

=> Fulfilled / Rejected



#### 生成器Generators / yield

- 执行一个函数时，可以在某个点暂停函数的执行，做一些其他工作或携带一些新的值，再返回这个函数继续执行，JavaScript生成器函数即致力于此

- 调用一个生成器函数时，程序会阻塞住，并不会立即执行，而需要手动执行迭代操作（```next```方法），即调用生成器函数会返回一个迭代器，迭代器会遍历每个中断点

- ```next```方法返回一个对象， 有两个属性: `value` 和 `done`；
  ```value```属性是是`yield`后面的结果，Generator函数向外输出数据；```next```方法接受参数，是向Generator函数体内输入数据
  遇到了`return` 后，`done` 会由`false`变为`true`

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

##### 生成器实现机制——协程

协程是一种比线程更加轻量级的存在，协程处在线程的环境中，一个线程可以存在多个协程，可以将协程理解为线程中的一个个任务。不像进程和线程，协程并不受操作系统的管理，而是被具体的应用程序代码所控制。

JS中，一个线程一次只能执行一个协程
比如当前执行 A 协程，另外还有一个 B 协程，如果想要执行 B 的任务，就必须在 A 协程中<u>将JS 线程的控制权转交给 B协程</u>，那么现在 B 执行，A 就相当于处于暂停的状态

对于协程来说，它并不受操作系统的控制，完全由用户自定义切换，因此并没有进程/线程上下文切换的开销，这是高性能的重要原因

##### Generator和异步——`thunk`版本

**`thunk` **函数的核心逻辑是接收一定的参数，生产出定制化的函数，然后使用定制化的函数去完成功能。`thunk`函数的实现会比单个的判断函数复杂一点点，但就是这一点点的复杂，大大方便了后续的操作。

以文件操作为例，

```javascript
// thunk函数——绑定回调函数
const readFileThunk = (filename) => {
  return(callback) => {
    fs.readFile(filename, callback);
  }
}

const gen = function*() {
  const data1 = yield readFileThunk('001.txt');
  console.log(data1.toString());
  const data2 = yield readFileThunk('002.txt');
  console.log(data2.toString);
};

// 执行
let g = gen();
// 第一步: 调用next，让它开始执行
// next返回值中value值是yield后面的结果，在这里即thunk函数生成的定制化函数，里面需要传一个回调函数作为参数
g.next().value((err, data1) => {
  // 第二步: 拿到上一次得到的结果，调用next, 将结果作为参数传入，程序继续执行。
  // 同理，value传入回调
  g.next(data1).value((err, data2) => {
    g.next(data2);
  })
})

// 001.txt的内容
// 002.txt的内容
```

```javascript
// 封装
function run(gen){
  const next = (err, data) => {
    let res = gen.next(data);
    if(res.done) return;
    res.value(next);
  }
  next();
}
run(g);
```

##### Generator和异步——Promise版本

```javascript
const readFilePromise = (filename) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, (err, data) => {
      if(err) {
        reject(err);
      } else {
        resolve(data);
      }
    })
  }).then(res => res);
}

const gen = function*() {
  const data1 = yield readFilePromise('001.txt')
  console.log(data1.toString())
  const data2 = yield readFilePromise('002.txt')
  console.log(data2.toString)
}


// 执行
let g = gen();
function getGenPromise(gen, data) {
  return gen.next(data).value;
}
getGenPromise(g).then(data1 => {
  return getGenPromise(g, data1);
}).then(data2 => {
  return getGenPromise(g, data2)
})
```

```javascript
// 封装
function run(g) {
  const next = (data) => {
    let res = g.next();
    if(res.done) return;
    res.value.then(data => {
      next(data);
    })
  }
  next();
}
```

##### co

核心原理就是封装的Promise情况下的执行代码，只不过源码会各种边界情况做了处理

```javascript
const co = require('co');
let g = gen();
co(g).then(res =>{
  console.log(res);
});
// 001.txt的内容
// 002.txt的内容
// 100
```



#### `Async` / `await`

**`async`** 是一个通过异步执行并隐式**返回 Promise 作为结果**的函数

```javascript
async function func() {
  return 100;
}
console.log(func());
// Promise {<resolved>: 100}
```

**`await`**

以一段代码为例：

```javascript
async function test() {
  console.log(100);
  let x = await 200;
  console.log(x);
  console.log(200);
}
console.log(0);
test();
console.log(300);
```

首先代码同步执行，打印出`0`，然后将`test`压入执行栈，打印出`100`, 下面注意了，遇到了关键角色**await**。

放个慢镜头:

```javascript
await 100;
```

1. **被 JS 引擎转换成一个 Promise**:

```javascript
let promise = new Promise((resolve,reject) => {
   resolve(100);
});
```

这里调用了 resolve，resolve的任务**进入微任务队列**

然后，JS 引擎将暂停当前协程的运行，把线程的执行权交给父协程

2. 回到父协程中，父协程的第一件事情就是**对`await`返回的`Promise`调用`then`, 来监听**这个 Promise 的状态改变 

```javascript
promise.then(value => {
  // 相关逻辑，在resolve执行之后来调用(执行next方法)
    // 3. 将线程的执行权交给test协程
    // 4. 把value值传递给test协程
})
```

然后往下执行，打印出`300`。

根据`EventLoop`机制，当前主线程的宏任务完成，现在检查微任务队列，发现还有一个Promise的 resolve，执行，现在父协程在`then`中传入的回调执行

3. **将线程的执行权交给`async`函数协程**（`promise.then`执行next方法）

4. **把value值传递给test协程**

   test 接收到父协程传来的200，赋值给 a ，然后依次执行后面的语句，打印`200`、`200`。

`async/await`**由 generator + yield 控制流程 + promise 实现回调**，实现了同步方式编写异步代码的效果

> `Generator`是对协程的一种实现，虽然语法简单，但引擎在背后做了大量的工作。用`async/await`写出的代码也更加优雅、美观，相比于之前的`Promise`不断调用then的方式，语义化更加明显，相比于`co + Generator`性能更高，上手成本也更低



**`forEach` 中用 await** 

利用`for...of`就能轻松解决

```javascript 
async function test() {
  let arr = [4, 2, 1]
  for(const item of arr) {
	const res = await handle(item)
	console.log(res)
  }
	console.log('结束')
}
```

