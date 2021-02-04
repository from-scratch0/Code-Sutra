let crypto = require('crypto');
let path = require('path');
let fs = require('fs');

// 生成密钥
// $ openssl genrsa -out rsa_private.key 1024
let key = fs.readFileSync(path.join(__dirname, 'rsa_private.key'));

// 密码123 加盐算法
let hmac = crypto.createHmac('sha1', key);
hmac.update('123');
let result = hmac.digest('hex');
console.log(result);