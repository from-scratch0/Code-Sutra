let MyPromise = require('./Promise');
let p1 = new MyPromise(function(resolve, reject) {
    setTimeout(function() {
        let num = Math.random();
        if(num < .5) {
            resolve(num);
        } else {
            reject('失败');
        }
    })
});

// 值的穿透
let p2 = p1.then(data => { return data; });
p2.then(function(data) {
    console.log(data);
}, function(err) {
    console.error(err);
});