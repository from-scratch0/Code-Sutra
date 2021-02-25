// const EventEmitter = require("events");
function EventEmitter() {
    this.events = {}; // 所有的事件监听函数保存在此对象
    this._maxListeners = 5; // 指定给一个时间类型增加的监听函数数量最多有多少个
}

EventEmitter.prototype.setMaxListeners = function(maxListeners) {
    this._maxListeners = maxListeners;
}

// 给指定事件绑定事件处理函数 arg1: 事件类型 arg2: 事件监听函数
EventEmitter.prototype.on = 
EventEmitter.prototype.addListener = function(type, listener) {
    if(this.events[type]) {
        this.events[type].push(listener);

        if(!this.events[type].warned) {
            if(this._maxListeners > 0 && this.events[type].length > this._maxListeners) {
                this.events[type].warned = true;
                console.error(`MaxListenersExceededWarning: Possible EventEmitter memory leak detected. ${this.events[type].length} 响 listeners added to ${type}. Use emitter.setMaxListeners() to increase limit`);
            }
        }
    } else {
        // 如果以前没有添加到此事件的监听函数 则赋一个数组
        this.events[type] = [listener];
    }
}

EventEmitter.prototype.once = function(type, listener) {
    // 用完即焚
    let wrapper = (...rest) => {
        listener.apply(this,rest); // 先让原始的监听函数执行
        this.removeListener(type,wrapper);
    }
    this.on(type,wrapper);
}

EventEmitter.prototype.removeListener = function(type,listener) {
    if(this.events[type]) {
        this.events[type] = this.events[type].filter(l=>l!=listener)
    }
}

EventEmitter.prototype.removeAllListeners = function(type) {
    delete this.events[type];
}

EventEmitter.prototype.emit = function(type, ...rest) {
    this.events[type] && this.events[type].forEach(listener => {listener.apply(this,rest)});
}

EventEmitter.prototype.listeners = function(event) {
    return this.events[event];
}

module.exports = EventEmitter;