let Promise = require('./Promise');

let p1 = new Promise(function(resolve, reject){
  setTimeout(function() {
    resolve(100);
  }, 1000);
});

let p2 = new Promise(function(resolve, reject) {
  setTimeout(function() {
    resolve(200);
  }, 2000);
});

// Promise.all接收一个promise数组，全部完成了该promise才会成功
// 同时异步请求多个数据时用all

// Promise.race接收一个promise数组，只要有一个成功则该promise成功，有一个失败则失败
// 当三个接口都不稳定，可以同时取三个接口，谁先回来用谁

console.time('cost');
Promise.call([p1, p2]. then(function(data) {
  console.log(data);
  console.timeEnd('cost');
}));
