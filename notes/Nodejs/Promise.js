const PENDING = 'pending'; // 初始态
const FULFILLED = 'fulfilled'; // 成功态
const REJECTED = 'rejected'; // 失败态

function Promise(executor) {
    let self = this; // 先缓存当前promise实例
    self.status = PENDING; // 设置状态
    // 定义存放成功的回调的数组
    self.onResolvedCallbacks = [];
    // 定义存放失败回调的数组
    self.onRejectedCallbacks = [];

    // 文档2.1
    // 当调用此方法的时候，如果promise状态为pending的话可以转成成功态，如果已经是成功态或者失败态则什么都不做
    function resolve(value) { // 2.1.1
        // 如果是初始态，则转成成功态
        if(self.status == PENDING) {
            self.status = FULFILLED;
            self.value = value; // 成功后会得到不能更改的值
            // 调用所有成功的回调
            self.onResolvedCallbacks.forEach(callback => callback(self.value));
        }
    }
    function reject(reason) { // 2.1.2
        // 如果是初始态，则转成失败态
        if(self.status == PENDING) {
            self.status = REJECTED;
            self.value = reason; // 失败的原因给了value
            // 调用所有失败的回调
            self.onRejectedCallbacks.forEach(callback => callback(self.value));
        }
    }
    try{
        // 因为此函数执行可能会异常，所以需要捕获，如果出错了，需要用错误对象reject
        executor(resolve, reject);
    } catch(e) {
        // 如果此函数执行失败了，则用失败的原因reject这个promise
        reject(e);
    };
}

// onFilfilled,onRejected是用来接收promise成功的值或者失败的原因
Promise.prototype.then = function(onFulfilled, onRejected) {
    // 2.2.1 如果成功和失败的回调没有传，则表示这个then没有任何逻辑，只会把值往后抛
    onFulfilled = typeof onFulfilled == 'function' ? onFulfilled : value => value;
    onRejected = typeof onRejected == 'function' ? onRejected : reason => { throw reason; };

    let self = this;
    let promise2;
    // 如果当前promise状态已经是成功态，onFullfilled直接取值
    if(self.status == FULFILLED) {
        return promise2 = new Promise(function(resolve, reject) {
            try{
                let x = onFulfilled(self.value);
                // 如果获取到了返回值x，会走解析promise的过程
                resolvePromise(promise2, x, resolve, reject);
            } catch(e) {
                // 如果执行成功的回调过程中出错了，用错误原因把promise2 reject
                reject(e);
            }
        });
    }
    if(self.status == REJECTED) {
        let x = onRejected(self.value);
        resolvePromise(promise2, x, resolve, reject);
    }
    if(self.status == PENDING) {
        self.onResolvedCallbacks.push(function() {
            let x = onFulfilled(self.value);
            resolvePromise(promise2, x, resolve, reject);
        });
        self.onRejectedCallbacks.push(function() {
            let x = onRejected(self.value);
        });
    }
}

module.exports = Promise;