let EventEmitter = require('events');
let fs = require('fs');
const { type } = require('os');

class ReadStream extends EventEmitter {
    constructor(path, options) {
        super(path, options);
        this.path = path;
        this.flags = options.flags||'r';
        this.mode = options.mode||0o666;
        this.highWaterMark = options.highWaterMark||64*1024;
        this.pos = this.start = options.start||0;
        this.end = options.end;
        this.encoding = options.encoding;
        this.flowing = null;
        this.buffer = Buffer.alloc(this.highWaterMark); // 不是缓存
        this.buffers = []; // 缓存
        this.length = 0;
        this.open(); // 准备打开文件读取
        // 当给这个实例添加了任意的监听函数时会触发newListener
        this.on('newListener', (type, listener) => {
            //如果监听了data事件，流会自动切换到流动模式
            if(type == 'data') {
                this.flowing = true;
                this.read();
            }
        });
    }

    read(n) {
        let ret;
        // 缓存区数据足够用 并且要读取的字节大于0
        if(0<n<this.length) {
            ret = Buffer.alloc(n);
            let index = 0;
            let b;
            while(null != (b = this.buffers.shift())) {
                for(let i=0;i<b.length;i++) {
                    ret[index++] = b[i];
                    if(index == n) { // 填充完毕
                        b = b.slice(i);
                        this.buffers.unshift(b);
                        this.length -= n;
                        break;
                    }
                }
            }
        }
        if(this.length < this.highWaterMark) {
            fs.read(this.fd, this.buffer, 0, this.highWaterMark, null, (err, bytesRead) => {
                if(bytesRead) {
                    let b;
                    b = this.buffer.slice(0,bytesRead);
                    this.buffers.push(b);
                    // 缓存区的数量加上实际得到的字节数
                    this.length += bytesRead;
                    this.emit('readable');
                } else {
                    this.emit('end');
                }
            });
        }
        
        return ret && this.encoding ? ret.toString(this.encoding):ret;
    }

    /*
    read() {
        if(typeof this.fd != 'number') {
            return this.once('open', () => this.read());
        }
        let howMuchToRead = this.end?Math.min(this.end - this.pos + 1, this.highWaterMark):this.highWaterMark;
        // this.buffer并不是缓存区
        fs.read(this.fd, this.buffer, 0, howMuchToRead, this.pos, (err, bytes) => {
            // bytes是实际读到的字节数
            if(err) {
                if(this.autoClose)
                    this.destroy();
                return this.emit('error', err);
            }
            if(bytes) {
                let data = this.buffer.slice(0, bytes);
                data = this.encoding?data.toString(this.encoding):data;
                this.pos += bytes;
                this.emit('data', data);
                if(this.end && this.pos > this.end) {
                    return this.endFn();
                } else {
                    if(this.flowing)
                        this.read();
                }
            } else {
                return this.endFn();
            }
        })
    }
    */

    open() {
        fs.open(this.path, this.flags, this.mode, (err, fd) => {
            if(err) {
                if(this.autoClose) {
                    this.destroy();
                    return this.emit('error', err);
                }
            }
            this.fd = fd;
            this.emit('open');
            this.read();
        })
    }
    
    endFn() {
        this.emit('end');
        this.destroy();
    }

    destroy() {
        fs.close(this.fd, () => {
            this.emit('close');
        });
    }

    pipe(dest) {
        this.on('data', (data) => {
            let flag = dest.write(data);
            if(!flag) {
                this.pause();
            }
        });
        dest.on('drain', () => {
            this.resume();
        });
    }

    // 监听data时可读流会进入流动模式 当暂停时
    pause() {
        this.flowing = false;
    }

    resume() {
        this.flowing = true;
        this.read();
    }
}

module.exports = ReadStream;