# 手动实现

### 3. 手动实现instanceof

核心: 原型链的向上查找。

```javascript
function myInstanceof(left, right) {    
    //基本数据类型直接返回false    
    if(typeof left !== 'object' || left === null) return false; 
    //getProtypeOf是Object对象自带的一个方法，能够拿到参数的原型对象    
    let proto = Object.getPrototypeOf(left);    
    
    while(true) {        
        //查找到尽头，还没找到        
        if(proto == null) return false;        
        //找到相同的原型对象        
        if(proto == right.prototype) return true;        
        proto = Object.getPrototypeof(proto);    
    }
}
```

测试:

```javascript
console.log(myInstanceof("111", String)); //false
console.log(myInstanceof(new String("111"), String));//true
```



### 11. map

- 参数：接受两个参数，一个是回调函数，一个是回调函数的this值(可选)。

其中，回调函数被默认传入三个值，依次为当前元素、当前索引、整个数组。

- 创建一个新数组，其结果是该数组中的每个元素都调用一个提供的函数后返回的结果
- 对原来的数组没有影响

```javascript
let nums = [1, 2, 3];
let obj = {val: 5};
let newNums = nums.map(function(item,index,array) {  
    return item + index + array[index] + this.val;   
}, obj);
console.log(newNums);//[7, 10, 13]
```

**手写map**

```javascript
Array.prototype.map = function(callbackFn, thisArg) {  
    // 处理数组类型异常  
    if (this === null || this === undefined) {    
        throw new TypeError("Cannot read property 'map' of null or undefined");  
    }  
    // 处理回调类型异常  
    if (Object.prototype.toString.call(callbackfn) != "[object Function]") {
        throw new TypeError(callbackfn + ' is not a function')  
    }  
    
    // 草案中提到要先转换为对象  
    let O = Object(this);  
    let T = thisArg; // 回调函数的this值 
    
    let len = O.length >>> 0;  
    let A = new Array(len);  
    for(let k = 0; k < len; k++) {    
        // in 表示在原型链查找；如果用 hasOwnProperty 是有问题的，它只能找私有属性    
        if (k in O) {      
            let kValue = O[k];      
            // 依次传入this, 当前项，当前索引，整个数组      
            let mappedValue = callbackfn.call(T, KValue, k, O);      
            A[k] = mappedValue;    
        }  
    }  
    return A;
}
```

`length >>> 0`, 字面意思是指"右移 0 位"，但实际上是把前面的空位用0填充，这里的作用是保证len为数字且为整数，举几个特例：

```javascript
null >>> 0  //0
undefined >>> 0  //0
void(0) >>> 0  //0
function a (){};  a >>> 0  //0
[] >>> 0  //0
var a = {}; a >>> 0  //0
123123 >>> 0  //123123
45.2 >>> 0  //45
0 >>> 0  //0
-0 >>> 0  //0
-1 >>> 0  //4294967295
-1212 >>> 0  //4294966084
```



### 12. reduce

- 参数: 接收两个参数，一个为回调函数，另一个为初始值

  回调函数中四个默认参数，依次为积累值、当前值、当前索引、整个数组

```javascript
let nums = [1, 2, 3];// 多个数的加和
let newNums = nums.reduce(function(preSum,curVal,index,array) {  
    return preSum + curVal; //返回值会成为下一次函数执行的时候的preSum
}, 0);
console.log(newNums);//6
```

不传默认值会自动以第一个元素为初始值，然后从第二个元素开始依次累计

**手写reduce**

```javascript
Array.prototype.reduce  = function(callbackfn, initialValue) {    
    if (this === null || this === undefined) {    
        throw new TypeError("Cannot read property 'reduce' of null or undefined");  
    }  
    if (Object.prototype.toString.call(callbackfn) != "[object Function]") {   
        throw new TypeError(callbackfn + ' is not a function')  
    }  
    
    let O = Object(this);  
    let len = O.length >>> 0;  
    let k = 0;  
    let accumulator = initialValue; 
    // 如果初始值不传，第一次执行函数的时候 accumulator = 第一个元素 curVal = 第二个元素
    if (accumulator === undefined) {   
        for(; k < len ; k++) {           
            if (k in O) {        
                accumulator = O[k];        
                k++;        
                break;      
            }    
        }    
        // 循环结束还没退出，就表示数组全为空    
        throw new Error('Each element of the array is empty');  
    }  
    
    for(;k < len; k++) {    
        if (k in O) {           
            accumulator = callbackfn.call(undefined, accumulator, O[k], k, O);   
        }  
    }  
    return accumulator;
}
```

其实是从最后一项开始遍历，通过原型链查找跳过空项



### 13. push / pop

```javascript
Array.prototype.push = function(...items) {  
    let O = Object(this);  
    let len = this.length >>> 0;  
    let argCount = items.length >>> 0;  
    // 2 ** 53 - 1 为JS能表示的最大正整数  
    if (len + argCount > 2 ** 53 - 1) {    
        throw new TypeError("The number of array is over the max value restricted!")  }  
    
    for(let i = 0; i < argCount; i++) {    
        O[len + i] = items[i];  
    }  
    let newLength = len + argCount;  
    O.length = newLength;  
    return newLength;
}
```

```javascript
Array.prototype.pop = function() {  
    let O = Object(this);  
    let len = this.length >>> 0;  
    if (len === 0) {    
        O.length = 0;    
        return undefined;  
    }  
    
    len --;  
    let value = O[len];  
    delete O[len];  
    O.length = len;  
    return value;
}
```



### 14. filter

参数: 一个函数参数

这个函数接受一个默认参数，就是当前元素

这个作为参数的函数返回值为一个布尔类型，决定元素是否保留

filter方法返回值为一个新的数组，这个数组里面包含参数里面所有被保留的项

```javascript
let nums = [1, 2, 3];
// 保留奇数项
let oddNums = nums.filter(item => item % 2);
console.log(oddNums);
```

**手写filter**

```javascript
Array.prototype.filter = function(callbackfn, thisArg) {    
    if (this === null || this === undefined) {    
        throw new TypeError("Cannot read property 'filter' of null or undefined");  
    }    
    if (Object.prototype.toString.call(callbackfn) != "[object Function]") {   
        throw new TypeError(callbackfn + ' is not a function')  
    }  
    
    let O = Object(this);  
    let len = O.length >>> 0;  
    let resLen = 0;  
    let res = [];  
    for(let i = 0; i < len; i++) {    
        if (i in O) {      
            let element = O[i];      
            if (callbackfn.call(thisArg, O[i], i, O)) {        
                res[resLen++] = element;      
            }    
        }  
    }  
    return res;
}
```



### 15. splice

- `splice(position, count)` 表示从 position 索引的位置开始，删除count个元素

- `splice(position, 0, ele1, ele2, ...) `表示从 position 索引的元素后面插入一系列的元素

- `splice(postion, count, ele1, ele2, ...)` 表示从 position 索引的位置开始，删除 count 个元素，然后再插入一系列的元素

- 返回值为被删除元素组成的数组

**手写splice**

```javascript
Array.prototype.splice = function(startIndex, deleteCount, ...addElements)  { 
    let argumentsLen = arguments.length;  
    let array = Object(this);  
    let len = array.length >>> 0; 
    let deleteArr = new Array(deleteCount);  
    
    // 参数的清洗工作  
    startIndex = computeStartIndex(startIndex, len);  
    deleteCount = computeDeleteCount(startIndex, len, deleteCount, argumentsLen);  
    
    // 判断 sealed 对象和 frozen 对象, 即 密封对象 和 冻结对象
if (Object.isSealed(array) && deleteCount !== addElements.length) {  
    throw new TypeError('the object is a sealed object!')
} else if(Object.isFrozen(array) && (deleteCount > 0 || addElements.length > 0)) {  
    throw new TypeError('the object is a frozen object!')
}
    
    // 拷贝删除的元素  
    sliceDeleteElements(array, startIndex, deleteCount, deleteArr);  
    // 移动删除元素后面的元素  
    movePostElements(array, startIndex, len, deleteCount, addElements);  
    
    // 插入新元素  
    for (let i = 0; i < addElements.length; i++) {    
        array[startIndex + i] = addElements[i];  
    }  
    array.length = len - deleteCount + addElements.length;  
    return deleteArr;
}

// 拷贝删除的元素
const sliceDeleteElements = (array, startIndex, deleteCount, deleteArr) => {
    for (let i = 0; i < deleteCount; i++) {    
        let index = startIndex + i;    
        if (index in array) {      
            let current = array[index];      
            deleteArr[i] = current;    
        }  
    }
};

// 移动删除元素后面的元素
const movePostElements = (array, startIndex, len, deleteCount, addElements) =>{  
    // 1. 添加的元素和删除的元素个数相等
    if (deleteCount === addElements.length) 
        return;
    
    // 2. 删除的元素比新增的元素多，后面的元素整体向前挪动
    if(deleteCount > addElements.length) {                
        // 一共需要挪动 len - startIndex - deleteCount 个元素    
        for (let i = startIndex + deleteCount; i < len; i++) {      
            let fromIndex = i;        
            let toIndex = i - (deleteCount - addElements.length); // 将要挪动到的目标位置      
            if (fromIndex in array) {        
                array[toIndex] = array[fromIndex];      
            } else {        
                delete array[toIndex];      
            }    
        }    
        
        // 把后面的元素向前挪，相当于数组长度减小了，需要删除冗余元素    
        // 目前长度为 len + addElements - deleteCount    
        for (let i=len - 1; i>=len + addElements.length - deleteCount; i--) { 
            delete array[i];    
        }  
    }
    
    // 3. 删除的元素比新增的元素少，那么后面的元素整体向后挪动  
    if(deleteCount < addElements.length) {      
        // 从后往前遍历    
        for (let i = len - 1; i >= startIndex + deleteCount; i--) {      
            let fromIndex = i;           
            let toIndex = i + (addElements.length - deleteCount);      
            if (fromIndex in array) {        
                array[toIndex] = array[fromIndex];      
            } else {        
                delete array[toIndex];     
            }    
        }  
    }
}

// 非法的startIndex或者负索引
const computeStartIndex = (startIndex, len) => {  
    // 处理索引负数的情况  
    if (startIndex < 0) {    
        return startIndex + len > 0 ? startIndex + len: 0;  
    }   
    return startIndex >= len ? len: startIndex;
}

// 非法的deleteCount
const computeDeleteCount = (startIndex, len, deleteCount, argumentsLen) => {
    // 删除数目没有传，默认删除startIndex及后面所有的  
    if (argumentsLen === 1)     
        return len - startIndex; 
    // 删除数目过小  
    if (deleteCount < 0)     
        return 0;  
    // 删除数目过大  
    if (deleteCount > len - deleteCount)     
        return len - startIndex;  
    return deleteCount;
}
```

> **密封对象**是不可扩展的对象，而且已有成员的[[Configurable]]属性被设置为false，这意味着不能添加、删除方法和属性。但是属性值是可以修改的。
>
> **冻结对象**是最严格的防篡改级别，除了包含密封对象的限制外，还不能修改属性值。



### 16. sort

参数: 一个用于比较的函数，它有两个默认参数，分别是代表比较的两个元素。

举个例子:

```javascript
let nums = [2, 3, 1];
//两个比较的元素分别为a, b
nums.sort(function(a, b) {  
    if(a > b) return 1;  
    else if(a < b) return -1;  
    else if(a == b) return 0;
})
```

- 当比较函数返回值大于0，则 a 在 b 的后面，即a的下标应该比b大

  反之，则 a 在 b 的后面，即 a 的下标比 b 小

  整个过程就完成了一次升序的排列

- 比较函数不传的时候，将数字转换为字符串，然后根据字母unicode值进行升序排序，也就是根据字符串的比较规则进行升序排序



### 17. new

1. 新生成了一个对象
2. 链接到原型
3. 绑定 this
4. 返回新对象

做了三件事情:

- 让实例可以访问到私有属性
- 让实例可以访问构造函数原型(`constructor.prototype`)所在原型链上的属性
- 如果构造函数返回的结果不是引用数据类型

**手写new**

```js
function newFactory() { // ctor, ...args
    if(typeof ctor !== 'function'){      
        throw 'newOperator function the first param must be a function';    
    } 
    // 创建一个空的对象
    let obj = new Object();
    // 获得构造函数
    let ctor = [].shift.call(arguments);
    // 链接到原型
    obj.__proto__ = ctor.prototype;
    // 绑定 this，执行构造函数
    let res = ctor.apply(obj, arguments); // ...args
    // 确保 new 出来的是个对象
    let isObject = typeof res === 'object' && typeof res !== null;    
    let isFunction = typoof res === 'function';    
    return isObect || isFunction ? res : obj;
}
```

对于创建一个对象来说，更推荐使用字面量的方式创建对象（无论性能上还是可读性）

因为使用 `new Object()` 的方式创建对象需要通过作用域链一层层找到 `Object`，但是使用字面量的方式就没这个问题

```js
function Foo() {}
// function 就是个语法糖
// 内部等同于 new Function()
let a = { b: 1 }
// 这个字面量内部也是使用了 new Object()
```

对于 `new` 来说，还需要注意下运算符优先级。

```js
function Foo() {
    return this;
}
Foo.getName = function () {
    console.log('1');
};
Foo.prototype.getName = function () {
    console.log('2');
};

new Foo.getName();   // -> 1
new Foo().getName(); // -> 2

```

```js
// 相当于
new (Foo.getName());
(new Foo()).getName();
```



### 18. bind

1. 对于普通函数，绑定this指向
2. 对于构造函数，要保证原函数的原型对象上的属性不能丢失

```javascript
Function.prototype.bind = function (context, ...args) {    
    // 异常处理    
    if (typeof this !== "function") {      
        throw new Error("Function.prototype.bind - what is trying to be bound is not callable");    
    }    
    // 保存this的值，它代表调用 bind 的函数    
    var self = this;    
    var fNOP = function () {};   
    var fbound = function () {        
        self.apply(this instanceof self ?             
                   this :             
                   context, args.concat(Array.prototype.slice.call(arguments)));    
    }    
    fNOP.prototype = this.prototype;    
    fbound.prototype = new fNOP(); 
    
    // 也可以用 Object.create 来处理原型:
    fbound = Object.create(this.prototype);
    
    return fbound;
}
```



### 18. call / apply

```javascript
Function.prototype.call = function (context, ...args) {  
    var context = context || window;  
    context.fn = this;  
    
    var result = eval('context.fn(...args)');  
    
    delete context.fn;  
    return result;
}
```



```javascript
Function.prototype.apply = function (context, args) {  
    let context = context || window;  
    context.fn = this;  
    let result = eval('context.fn(...args)');  
    delete context.fn  
    return result;
}
```



### 浅拷贝

**手动实现**

```javascript
const shallowClone = (target) => {  
    if (typeof target === 'object' && target !== null) {    
        const cloneTarget = Array.isArray(target) ? []: {};    
        for (let prop in target) {      
            if (target.hasOwnProperty(prop)) {
                cloneTarget[prop] = target[prop];      
            }    
        }    
        return cloneTarget;  
    } else {    
        return target;  
    }
}
```



### 深拷贝

```javascript
JSON.parse(JSON.stringify());
```

局限性：

- 无法解决循环引用的问题

  创建一个WeakMap，记录下已经拷贝过的对象，如果说已经拷贝过，那直接返回它

- 无法拷贝一些特殊的对象，诸如 RegExp, Date, Set, Map等

- 无法拷贝函数

**手动实现**

```javascript
const getType = obj => Object.prototype.toString.call(obj);

const isObject = (target) => (
    typeof target === 'object' || typeof target === 'function'
) && target !== null;

// 可遍历对象
const canTraverse = {  
    '[object Map]': true,  
    '[object Set]': true,  
    '[object Array]': true,  
    '[object Object]': true,  
    '[object Arguments]': true,
};

const mapTag = '[object Map]';
const setTag = '[object Set]';
// 不可遍历对象
const boolTag = '[object Boolean]';
const numberTag = '[object Number]';
const stringTag = '[object String]';
const symbolTag = '[object Symbol]';
const dateTag = '[object Date]';
const errorTag = '[object Error]';
const regexpTag = '[object RegExp]';
const funcTag = '[object Function]';

const deepClone = (target, map = new Map()) => {  
    if(!isObject(target)) return target;  
    let type = getType(target);  
    let cloneTarget;  
    if(!canTraverse[type]) {    
        // 处理不能遍历的对象    
        return handleNotTraverse(target, type);  
    } else {    
        // 这波操作相当关键，可以保证对象的原型不丢失！    
        let ctor = target.constructor;    
        cloneTarget = new ctor();  
    }  
    
    if(map.get(target)) return target;  
    map.put(target, true); 
     //处理Map
    if(type === mapTag) {    
        target.forEach((item, key) => {      
            cloneTarget.set(deepClone(key, map), deepClone(item, map));    
        });  
    }  
    //处理Set
    if(type === setTag) {      
        target.forEach(item => {      
            cloneTarget.add(deepClone(item, map));    
        });  
    }  
    // 处理数组和对象  
    for (let prop in target) {    
        if (target.hasOwnProperty(prop)) {        
            cloneTarget[prop] = deepClone(target[prop], map);    
        };  
    }  
    return cloneTarget;
}

const handleRegExp = (target) => {  
    const { source, flags } = target;  
    return new target.constructor(source, flags);
}

const handleFunc = (func) => {  
    // 箭头函数直接返回自身 不是类的实例 不存在原型
    if(!func.prototype) return func;  
    
    const bodyReg = /(?<={)(.|\n)+(?=})/m;  
    const paramReg = /(?<=\().+(?=\)\s+{)/;  
    const funcString = func.toString();  
    // 分别匹配 函数参数、函数体  
    const param = paramReg.exec(funcString);  
    const body = bodyReg.exec(funcString);  
    if(!body) return null;  
    if (param) {    
        const paramArr = param[0].split(',');    
        return new Function(...paramArr, body[0]);  
    } else {    
        return new Function(body[0]);  
    }
}

const handleNotTraverse = (target, tag) => {  
    const Ctor = target.constructor;  
    switch(tag) {  
        // ES6后不推荐使用 new 基本类型() 这种写法
        case boolTag: return new Object(Boolean.prototype.valueOf.call(target)); 
        case numberTag:return new Object(Number.prototype.valueOf.call(target)); 
        case stringTag:return new Object(String.prototype.valueOf.call(target));
        case symbolTag:return new Object(Symbol.prototype.valueOf.call(target)); 
        case errorTag:     
        case dateTag: return new Ctor(target);    
        case regexpTag: return handleRegExp(target);    
        case funcTag: return handleFunc(target);    
        default: return new Ctor(target);  
    }
}
```

