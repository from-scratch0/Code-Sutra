const PENDING =  'pending'; // 初始态
const FULFILLED =  'fulfilled'; // 成功态
const REJECTED =  'rejected'; // 失败态
function Promise(executor){
  let self = this; //先缓存当前promise实例
  self.status = PENDING; //设置状态
  
  self.onResolvedCallbacks = []; //定义存放成功的回调的数组
  
  self.onRejectedCallbacks = []; //定义存放失败回调的数组
  
  // 2.1
  // 当调用此方法的时候，如果promise状态为pending,可以转成成功态；
  // 如果已经是成功态或者失败态了，则什么都不做
  function resolve(value){
    if(value!=null && value.then && typeof value.then == 'function'){
      return value.then(resolve,reject);
    }

    //如果是初始态，则转成成功态
    //为什么要把它用setTimeout包起来
    setTimeout(function(){
      if(self.status == PENDING){
        self.status = FULFILLED;
        self.value = value; // 成功后会得到一个值，这个值不能改
        //调用所有成功的回调
        self.onResolvedCallbacks.forEach(cb => cb(self.value));
      }
    })
  }

  function reject(reason){
    // 如果是初始态，则转成失败态
    setTimeout(function(){
      if(self.status == PENDING){
        self.status = REJECTED;
        self.value = reason; // 失败的原因给了value
        self.onRejectedCallbacks.forEach(cb => cb(self.value));
      }
    });
  }
  
  // 此函数执行可能会异常，需要捕获，如果出错需要用错误对象reject
  try{
    executor(resolve, reject);
  } catch(e) {
    reject(e); //如果这函数执行失败了，则用失败的原因reject这个promise
  };
}

// 2.3
function resolvePromise(promise2, x, resolve, reject) {
  // 2.3.1
  if(promise2 === x){
    return reject(new TypeError('循环引用'));
  }

  let called = false; // promise2是否已经resolve或reject了

  // 2.3.2 x是promise
  if(x instanceof Promise){
    if(x.status == PENDING){
      x.then(function(y){ // 2.3.2.1 y：x的value
        resolvePromise(promise2, y, resolve, reject);
      }, reject);
    } else {
      x.then(resolve, reject);
    }

  // 2.3.3 x是一个thenable对象（有then方法的对象）或函数
  } else if (x!= null &&((typeof x=='object')||(typeof x == 'function'))){
    // 当我们的promise和别的promise进行交互，编写这段代码的时候尽量考虑兼容性，允许别人瞎写
   try{
     let then = x.then;
     if(typeof then == 'function') {
       // 有些promise会同时执行成功和失败的回调
       // 如果promise2已经成功或失败了，则不会再处理了
       then.call(x, function(y){ // y可能仍是promise
          if(called) return;

          called = true;
          resolvePromise(promise2, y, resolve,reject);
       }, function(err){
         if(called) return;
         called = true;
         reject(err);
       });
     } else {
       // 2.3.4 x不是一个thenable对象（没有then或then不是函数），直接把它当成值resolve promise2
       resolve(x);
     }
   } catch(e) { // 2.3.3.2 取then时异常
     if(called) return;
     called = true;
     reject(e);
   }

  } else {
    // 如果X是一个普通值，则用x的值去resolve promise2
    resolve(x);
  }
}

// 2.2
Promise.prototype.then = function(onFulfilled, onRejected){ // 传参：接收promise成功的值或者失败的原因
  // 如果成功和失败的回调没有传函数，则表示这个then没有任何逻辑，只会把值往后抛（值的穿透）
  // 即promise1的值和promise2的值一样，交给promise2 resolve/reject
  // 2.2.1
  onFulfilled = typeof onFulfilled == 'function' ? onFulfilled : function(value) {return value};
  onRejected = typeof onRejected == 'function' ? onRejected : reason => {throw reason};
  
  // 2.2.7 then要返回一个promise
  // 如果当前promise状态已经是成功态了，onFulfilled直接取值
  let self = this;
  let promise2;
  if(self.status == FULFILLED){
    return promise2 = new Promise(function(resolve, reject){
      setTimeout(function(){
        try{
          let x = onFulfilled(self.value); // 可能是value、promise对象、别人的promise
          // 如果获取到了返回值x,会走解析promise的过程
          // resolve和reject控制的是最开始传入的promise2的状态
          resolvePromise(promise2, x, resolve, reject);
        } catch(e) {
          // 如果执行成功的回调过程中出错了，用错误原因把promise2 reject
          reject(e);
        }
      })

    });
  }

  if(self.status == REJECTED){
    return promise2 = new Promise(function(resolve, reject){
      setTimeout(function(){
        try{ 
          let x = onRejected(self.value);
          // promise1失败了，其失败回调返回了一个正常值，则promise2成功
          resolvePromise(promise2, x, resolve, reject);
        }catch(e){
          reject(e);
        }
      })
    });
  }

  // 仍为等待态 推入回调数组
  if(self.status == PENDING){
   return promise2 = new Promise(function(resolve, reject){
     self.onResolvedCallbacks.push(function(){
         try{
           let x = onFulfilled(self.value);
           resolvePromise(promise2, x, resolve, reject);
         }catch(e){
           reject(e);
         }
     });
     self.onRejectedCallbacks.push(function(){
         try{
           let x = onRejected(self.value);
           resolvePromise(promise2, x, resolve, reject);
         }catch(e){
           reject(e);
         }
     });
   });
  }

}

// catch原理就是只传失败的回调
// then 方法的语法糖
Promise.prototype.catch = function(onRejected){
  return this.then(null, onRejected);
}

// 测试用例
Promise.deferred = Promise.defer = function(){
  let defer = {};
  defer.promise = new Promise(function(resolve,reject) {
    defer.resolve = resolve;
    defer.reject = reject;
  });
  return defer;
}

// 传入参数为一个空的可迭代对象，则直接进行resolve
// 如果参数中有一个promise失败，那么Promise.all返回的promise对象失败
// 在任何情况下，返回的promise的完成状态的结果都是一个数组
Promise.all = function(promises) {
    return new Promise(function(resolve, reject) {
        let result = [];
        let len = promises.length;
        if(len === 0) {
            resolve(result);
            return;
        }
        
        const done = function(index, data) {
            result[index] = data;
            if(++index == len) resolve(result);
        };

        for(let i = 0; i < len; i++) {
            // 不直接 promise[i].then, 因为promise[i]可能不是一个promise
            Promise.resolve(promise[i]).then(function(data) {
                done(i, data);
            }).catch(err => {
                reject(err);
            });
        }
    });
}

Promise.race = function(promises){
  return new Promise(function(resolve,reject) {
    let len = promises.length;
    if(len === 0) return;

    for(let i = 0; i < len; i++){
        Promise.resolve(promise[i]).then(data => {
            resolve(data);
            return;
        }).catch(err => {
            reject(err);
            return;
        });
        // Promise.resolve(promise[i]).then(resolve, reject);
    }
  });
}

// 返回一个立刻成功的promise
// 1.传参为一个 Promise, 则直接返回它
// 2.传参为一个 thenable 对象，返回的 Promise 会跟随这个对象，采用它的最终状态作为自己的状态
// 3.其他情况，直接返回以该值为成功状态的promise对象
// 别人提供给你一个方法，需要你传入一个promise,但你只有一个普通的值，你就可以通过这个方法把这个普通的值(string number object)转成一个promise对象
Promise.resolve = function(value){
    if(value instanceof Promise) return value;
    return new Promise(function(resolve, reject) {
        if(value && value.then && typeof value.then === 'function') {
            // value状态变为成功会调用resolve，将新Promise的状态变为成功，反之亦然
            value.then(resolve, reject);
        } else {
            resolve(value);
        }
    });
}

// 返回一个立刻失败的promise
// 传入的参数会作为一个 reason 原封不动地往下传
Promise.reject = function(reason){
  return new Promise(function(resolve,reject){
    reject(reason);
  });
}

// 无论当前Promise是成功还是失败，调用finally之后都会执行finally中传入的函数，并且将值原封不动的往下传
Promise.prototype.finally = function(cb) {
    this.then(value => {
      return Promise.resolve(cb()).then(() => {
        return value;
      })
    }, error => {
      return Promise.resolve(cb()).then(() => {
        throw error;
      })
    })
  }

module.exports = Promise;


function Event() {
    this.event = {};
}
Event.prototype.on = function (type,callBack) {
    if(this.event[type]){
        this.event[type].push(callBack);
    }else{
        this.event[type] = [callBack];
    }
};
Event.prototype.emit = function (type,...data) {
    this.event[type].forEach((item)=>item(...data));
};
let event = new Event();
function fn1(){
   console.log('吃饭');
}
function fn2(){
    console.log('工作');
}
event.on('我的一天',fn1);
event.on('我的一天',fn2);
event.emit('我的一天');

