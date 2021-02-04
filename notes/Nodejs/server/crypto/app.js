let crypto = require('crypto');
let path = require('path');

let rs = require('fs').createReadStream(path.join(__dirname, 'msg.txt'), {
    highWaterMark: 2
});

let md5 = crypto.createHash('md5');

rs.on('data', function (data) {
    md5.update(data); // update可以执行多次
});

rs.on('end', function () {
    let md5Val = md5.digest('hex');
    res.setHeader('Content-MD5', md5Val);
});