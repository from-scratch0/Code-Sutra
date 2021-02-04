// 流动模式 不走缓存
let fs = require('fs');
let ReadStream = require('./ReadStream');
let rs = new ReadStream('1.txt', { // fs.createReadStream
    flags:'r',
    mode:0o666,
    start:3,
    end:7, // 5个 包括结束位置
    autoClose:true,
    highWaterMark:3,
    encoding:'utf8'
})

rs.on('open', () => {
    console.log('open');
});

rs.on('data', data => {
    console.log(data);
});

rs.on('end', () => {
    console.log('end');
});

rs.on('close', () => {
    console.log('close');
});

rs.on('error', (err) => {
    console.error(err);
});