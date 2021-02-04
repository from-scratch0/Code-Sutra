let ReadStream = require('./ReadStream');
let WriteStream = require('./WriteStream');
let rs = new ReadStream('./1.txt', {
    start:3,
    end:8,
    highWaterMark:3
});
let ws = new WriteStream('./2.txt', {
    highWaterMark:3
});

rs.pipe(ws);