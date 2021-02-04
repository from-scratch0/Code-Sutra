let fs = require('fs');
let ReadStream = require('./ReadStream');

let rs = new ReadStream('1.txt', { // fs.createReadStream
    start:0,
    highWaterMark:3,
    encoding:'utf8'
});

rs.on('readable', function() {
    console.log(rs.length); // 3
    let char = rs.read(1);
    console.log(char);
    console.log(rs.length); // 2
    setTimeout(() => {
        console.log(rs.length);
    }, 500) // 5
});