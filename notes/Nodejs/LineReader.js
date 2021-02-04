/*
写一个类，传入一个文件路径的到类的实例
监听它的newLine事件，当此行读取器每次读到一行时，就发射newLine事件，读到结束时发射end事件
*/
let EventEmitter = require('events');
let util = require('util');
let fs = require('fs');

const NEW_LINE = 0x0A; // /n 换行
const RETURN = 0x0D; // /r 回车

function LineReader(path, encoding) {
    EventEmitter.call(this);
    this.encoding = encoding || 'utf8';
    this._reader = fs.createReadStream(path);
    // 当给一个对象添加一个新的监听函数时会触发newListener事件
    this.on('newListener', (type, listener) => {
        // 如果说你添加了newLine和监听，那么就开始读取文件内容并按行发射数据
        if(type == 'newLine') {
            // 当监听了一个可读流的readable事件，流会调用底层的读取文件的API方法填充缓存区，
            // 填充满之后向外发射readable事件
            let buffers = []; // 默认64K
            this._reader.on('readable', () => {
                let char; // Buffer 是一个只有一个字节的Buffer
                while(null != (char = this._reader.read(1)) ) {
                    switch (char[0]) {
                        case NEW_LINE:
                            this.emit('newLine', Buffer.from(buffers).toString(this.encoding));
                            buffers.length = 0;
                            break;
                        case RETURN:
                            this.emit('newLine', Buffer.from(buffers).toString(this.encoding));
                            buffers.length = 0;
                            // 往后再度一个字节
                            let nChar = this._reader.read(1);
                            if(nChar[0] != NEW_LINE) {
                                buffers.push(nChar[0]);
                            }
                            break;
                        default:
                            buffers.push(char[0]);
                    }
                }
            });

            // 当
            this._reader.on('end', () => { 
                this.emit('newLine', Buffer.from(buffers).toString(this.encoding));
                this.emit('end');
            });
        }
    });
}
util.inherits(LineReader, EventEmitter);

module.exports = LineReader;