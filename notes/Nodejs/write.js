let fs = require('fs');
let WriteStream = require('./WriteStream');
// fs.createWriteStream
let ws = new WriteStream('write.txt', {
    flags:'w',
    mode:0o666,
    start:0,
    encoding:'utf8',
    autoClose:true, // 当流写完之后自动关闭文件
    highWaterMark:3
});
let n = 9;

ws.on('error', (err) => {
    console.log(err);
});

function write() {
    let flag = true;
    while(flag && n>0) {
        flag = ws.write(n + "", 'utf8', () => {console.log('ok')});
        n--;
        console.log(flag);
    }
    ws.once('drain', () => {
        console.log('drain');
        write();
    });   
}
// ws.on('drain', write); // 放外面的话
write();