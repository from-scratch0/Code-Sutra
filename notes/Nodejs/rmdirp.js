let path = require('path');
let fs = require('fs');

// 递归删除非空目录

/*
// 获取一个目录下的所有文件和目录
fs.readdir();
// 删除一个文件
fs.unlink(path);
// 删除一个空目录
fs.rmdir('a/b/c')
*/

function rmdirpSync(dir) {
    let files = fs.readdirSync(dir);
    files.forEach(function(file) {
        let current = dir+'/'+ file;
        let child = fs.statSync(current);
        if(child.isDirectory()) {
            rmdirpSync(current);
        } else {
            fs.unlinkSync(current);
        }
    });
    // 把目录下的文件删除后要删除自己
    fs.rmdirSync(dir);
}

rmdirpSync('a');

function rmdir(dir) {
    return new Promise(function(resolve, reject) {
        fs.stat(dir,  (err, stat) => {
            if(err) return reject(err);
            if(stat.isDirectory()) {
                fs.readdir(dir, (err, files) => {
                    if(err) return reject(err);
                    // 先删除当前目录的子文件夹或文件 再删除自己
                    Promise.all(files.map(item => rmdir(path.join(dir, item)))).then(() => {
                        fs.rmdir(dir, resolve);
                    });
                });
            } else {
                fs.unlink(dir, resolve);
            }
        });
    });
}

rmdir('a').then(data => {
    console.log(data);
}, function(err) {
    console.error(err);
});