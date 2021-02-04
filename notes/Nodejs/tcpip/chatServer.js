// 写一个聊天室 可以设置昵称 
// 广播 b：内容  此客户端想要向所有的其他客户端广播
// 私聊 c：对方的用户名：内容  想向指定用户名发消息
// 列出在线用户列表 l  表示列出所有的在线用户信息列表
// 修改昵称 n：新名字  表示此客户端想修改自己的名称
const net = require('net');

let clients = {};

let server = net.createServer(function(socket) {
    socket.setEncoding('utf8');

    let key = socket.remoteAddress + socket.remotePort;
    clients[key] = {
        nickname: '匿名', // 默认
        socket
    };

    server.getConnections((err, count) => {
        socket.write('欢迎光临本聊天室，现在在线人数是' + count + '位，你的地址是' + key + '\r\n');
    });

    let username;

    socket.on('data', function(data) {
        data = data.replace(/\r\n/, '');
        let type = data.slice(0,1); // 第一个字符
        switch (type) {
            case 'b': // 广播
                let text = data.slice(2);
                broadcast(text);
                break;
            case 'c': // 私聊
                let values = data.split(':');
                let toUser = values[1];
                let toText = value[2];
                sendTo(toUser, text);
                break;
            case 'l': // 在线用户列表
                list();
                break;
            case 'n': // 改昵称
                let newName = data.slice(2);
                let oldUserObj = clients[key];
                oldUserObj.nickname = newName;
                socket.write('你的用户名已经修改为' + newName + '\r\n');
                break;
            default:
                socket.write('此命令不能识别，请重新输入！\r\n');
                break;
        }

        // if(username) {
        //     broadcast(username, `${username}:${data}`); // 正常发言
        // } else {
        //     if(clients[data]) {
        //         socket.write('你的用户名已经被人用了，请你换一个新的用户名\r\n');
        //     } else {
        //         username = data; // 把用户输入的信息当成用户名
        //         clients[username] = socket; // 缓存用户的socket 方便以后广播用
        //         broadcast(username, `欢迎${username}加入聊天室`); // 向所有的客户端发送信息
        //     }
        // }
    });

    socket.on('end', function() {
        // broadcast(username, `欢送${username}离开聊天室`);
        socket.destroy(); // 销毁此socket
        delete clients[key]; // 不用再向其广播
    });

    function broadcast(text) {
        let {nickname} = clients[key]; // 解构
        for(let user in clients) {
            if(clients.hasOwnProperty(user) && user != key) {
                clients[user].socket.write(`${nickname}:${text}`);
            }
        }
    }

    function sendTo(toUser, text) {
        let toUserObj;
        for(let user in clients) {
            // 当对象中此key对应的对象的用户名和私聊对象用户名相同
            if(toUserObj.nickname == toUser) {
                toUserObj = clients[user];
                break;
            }
        }
        if(toUserObj) {
            let {nickname} = clients[key];
            toUserObj.socket.write(`${nickname}:${text}\r\n`);
        } else {
            socket.write(`用户名不正确或者对方已经下线！\r\n`);
        }
    }

    function list() {
        let result = '在线用户列表：\r\n';
        for(let user in clients) {
            result += clients[user].nickname + '\r\n';
        }
        socket.write(result);
    }
    
});


server.listen(8080, () => {
    console.log('TCP聊天室已经启动成功，信息是', server.address());
});