let EventEmitter = require('./events'); // myEvents: './events'
let util = require('util');
function Bell() {
    EventEmitter.call(this); // 继承私有属性
}
util.inherits(Bell, EventEmitter);
	// Object.setPrototypeOf(ctor.prototype, superCtor.prototype);
	// ctor.prototype.__proto__ = superCtor.prototype;
	// 进行原型继承 继承公有属性
let bell = new Bell();

function studentInClassroom(roomNumber,things) {
    console.log(`学生带着${things}进${roomNumber}教室`);
}
function teacherInClassroom(roomNumber,things) {
    console.log(`讲师带着${things}进${roomNumber}教室`);
}

bell.setMaxListeners(5); // 不限制
bell.addListener('响', studentInClassroom);
bell.on('响', studentInClassroom);
// bell.on('响', studentInClassroom);
// bell.on('响', studentInClassroom);
// bell.on('响', studentInClassroom);
// bell.on('响', studentInClassroom);
// bell.on('响', studentInClassroom);
// bell.on('响', studentInClassroom);
// bell.on('响', studentInClassroom);
// bell.on('响', studentInClassroom);
// bell.on('响', studentInClassroom);
bell.once('响', teacherInClassroom);

bell.emit('响','107','书');
console.log('=======================');
bell.emit('响','107','书');
