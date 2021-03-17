let Promise = require('./Promise');
let p1 = new Promise(function(resolve,reject){
//reject(10000000);
//pending
setTimeout(function(){
let num = Math.random();//生成一个随机数
    console.log(num);
    if(num>.5){
    //如果这个promise 成功了，会调用成功的回调 fulfilled
    resolve(num);
}else{
    //如果这个promise失败了，会调用失败的回调 rejected
    reject('小失败');
}
},2000);
});

p1.then(function(value){
console.log('成功1=',value);
throw Error('成功回调出错'); // 到失败2
}, function(reason){
console.log('失败1=',reason);
}).then(function(value){
console.log('成功2=',value);
}, function(reason){
console.log('失败2=',reason);
});

// promise-chain
//成功回调后的值会被用来resolve当前的promise
//成功的回调里又返回了一个新的promise
//成功的回调里返回的promise还不是我自己写Promise
//如果成功的回调里返回了一个promise,那么promise2要以promise的resovle结果来resolve自己
let p2 = p1.then(function(data){
return new Promise(function(resolve,reject){
    setTimeout(function(){
    resolve(new Promise(function(resolve,reject){
        setTimeout(function(){
        resolve(data+100);
        },1000);


let p3 = p1.then(function(data) {
console.log(data);
// x是promise时
return new MyPromise(function(resolve, reject) {
    resolve(100);
});
})

// 循环调用
let p4 = p1.then(function(data) {
console.log(data);
return p4;  
});

new Promise(function() {

}).then(function() {
console.log('买包');
}) // 永远不执行then

// https://segmentfault.com/a/1190000002452115