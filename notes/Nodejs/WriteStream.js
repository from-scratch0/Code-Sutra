let fs = require('fs');
let EventEmitter = require('events');

class WriteStream extends EventEmitter{
    constructor(path, options) {
        super(path, options);
        this.path = path;
        this.flags = options.flags || 'w';
        this.mode = options.mode || 0o666;
        this.start = options.start || 0;
        this.pos = this.start; // 文件的写入索引
        this.encoding = options.encoding || 'utf8';
        this.autoClose = options.autoClose;
        this.highWaterMark = options.highWaterMark || 16*1024;

        this.buffers = []; // 缓冲区
        this.writing = false; // 表示内部正在写入数据
        this.length = 0; // 表示缓存区字节的长度
        this.open();
    }
    open() {
        fs.open(this.path, this.flags, this.mode, (err, fd) => {
            if(err) {
                if(this.autoClose) {
                    this.destroy();
                }
                this.emit('error', err);
            }
            this.fd = fd;
            this.emit('open');
        });
    }

    // 如果底层已经在写入数据的话，则必须要将当前写入的数据放在缓冲区里
    write(chunk, encoding, cb) {
        chunk = Buffer.isBuffer(chunk)?chunk:Buffer.from(chunk, this.encoding);
        let len = chunk.length;
        this.length += len; // 缓存区的长度加上当前写入的长度
        let ret = this.length < this.highWaterMark;

        if(this.writing) { // 表示正在向底层写数据，则当前数据必须放在缓存区里
            this.buffers.push({
                chunk,
                encoding,
                cb
            });
            
        } else { // 直接调用底层的写入方法进行写入
            // 在底层写完当前数据后要清空缓存区
            this.writing = true;
            this._write(chunk, encoding, () => this.clearBuffer());
        }
        return ret;
    }

    clearBuffer() {
        let data = this.buffers.shift(); // 取出缓存区中的第一个buffer
        if(data) {
            this._write(data.chunk, data.encoding, () => this.clearBuffer());
        } else {
            // 缓存区清空了
            this.writing = false;
            this.emit('drain');
        }
    }

    _write(chunk, encoding, cb) {
        if(typeof this.fd != 'number') {
            return this.once('open', () => this._write(chunk, encoding, cb));
        }
        fs.write(this.fd, chunk, 0, chunk.length, this.pos, (err, bytesWritten) => {
            if(err) {
                if(this.autoClose) {
                    this.destroy();
                    this.emit('error', err);
                }
            }
            this.pos += bytesWritten;
            this.length -= bytesWritten;
            cb && cb();
        })
    }

    destroy() {
        fs.close(this.fd, () => {
            this.emit('close');
        })
    }
}

module.exports = WriteStream;