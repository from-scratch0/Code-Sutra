let fs = require('fs');

// 递归异步创建目录
function mkdirp(dir) {
    let paths = dir.split('/'); // [a, b, c]
    !function next(index) {
        if(index > paths.length) return;
        let current = paths.slice(0, index).join('/');
        fs.access(current, fs.constants.R_OK, function(err) {
            if(err) {
                fs.mkdir(current, 0o666, ()=>next(index+1)); // next.bind(null,index+1)
            } else {
                next(index+1);
            }
        })
    }(1);
}

mkdirp('a/b/d');
mkdirp('a/b/e');
mkdirp('a/c/f');
mkdirp('a/c/g');
mkdirp('a/h.txt');



