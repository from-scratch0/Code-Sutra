/*
默认情况下，父进程将会等待被分离的子进程退出
设置 options.detached 为 true 可以使子进程在父进程退出后继续运行
*/

let cp = require('child_process');
let fs = require('fs');
let path = require('path');

let out = fs.openSync(path.join(__dirname, 'msg.txt'), 'w', 0o666);

let sp = cp.spawn('node', ['test4.js'], {
    detached: true,
    stdio: ['ignore', out, 'ignore']
});
//让父进程先退出
sp.unref();

// 在vscode中不行 在cmd中运行