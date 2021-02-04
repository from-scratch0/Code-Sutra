let fs = require('fs');
let path = require('path');

/*
异步的先序深度优先遍历
a a/b a/b/d a/b/e a/c a/c/f a/c/g a/h.txt
*/

function preDeep(dir, callback) {
    console.log(dir);
    fs.readdir(dir, (err, files) => {
        !function next(i) {
            if(i >= files.length) return callback();
            let child = path.join(dir, files[i])
            fs.stat(child, (err, stat) => {
                if(stat.isDirectory()) {
                    preDeep(child, () => next(i+1));
                } else {
                    console.log(child);
                    next(i+1);
                }
            });
        }(0);
    });
}

// preDeep('a', () => {
//     console.log('遍历完毕');
// });

/*
同步的广度优先先序遍历
a a/b a/c a/h.txt a/b/d a/b/e a/c/f a/c/g
*/

function wideSync(dir) {
    let arr = [dir]; 
    while(arr.length > 0) {
        let current = arr.shift(); // 取得队列最左边的那个元素
        console.log(current);
        let stat = fs.statSync(current);
        if(stat.isDirectory()) {
            let files = fs.readdirSync(current);
            files.forEach(item => {
                arr.push(path.join(current, item));
            });
        }
    }
}

wideSync('a');