let fs = require('fs');

// 为了实现节约内存的拷贝 读一点写一点
const BUFFER_SIZE = 3; // 缓存大小 3个字节
function copy(src, target) {
    fs.open(src, 'r', 0o666, function(err, readFd) {
        fs.open(target, 'w', 0o666,function(err, writeFd) {
            let buff = Buffer.alloc(BUFFER_SIZE);
            !function next() {
                fs.read(readFd, buff, 0, BUFFER_SIZE, null, function(err, bytesRead, buffer) {
                    if(bytesRead > 0) fs.write(writeFd, buff, 0, bytesRead, null, next)
                })
            }();
        })
    })
}

copy('1.txt', '2.txt');
