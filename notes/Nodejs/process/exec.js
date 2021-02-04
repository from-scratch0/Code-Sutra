//exec同步执行一个shell命令
let { exec } = require('child_process');
let path = require('path');

//用于使用 shell执行命令
//killSignal 我们可以通过kill命令行向子进程 发射信号 
let p1 = exec('node test1.js a b c ', { 
    maxbuffer: 1024 * 1024, 
    encoding: 'utf8',
    // timeout: 10, 
    cwd: path.join(__dirname, 'test2') 
}, function (err, stdout, stderr) {
    // console.log(err);
    console.log(stdout);
});


//杀死子进程 p1
setTimeout(function () {
    p1.kill();
}, 3000);

