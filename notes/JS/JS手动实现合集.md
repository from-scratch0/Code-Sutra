# 手动实现

### instanceof

核心：原型链的向上查找，右边变量的原型prototype在左边变量的原型链上

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

测试：

```javascript
console.log(myInstanceof("111", String)); //false
console.log(myInstanceof(new String("111"), String));//true
```



### Object.create

```javascript
Object.create = function create(prototype) {
	if (prototype === null || typeof prototype !== 'object') {
        throw new TypeError(`Object prototype may only be an Object: ${prototype}`);
    }
    
    // 先创建一个空的函数
  	function Temp() {};
    Temp.__proto__ = prototype;
    // 返回这个函数的实例
    return new Temp;
}
```



### map

- 参数：接受两个参数，一个是回调函数，一个是回调函数的this值(可选)。

其中，回调函数被默认传入三个值，依次为当前元素、当前索引、整个数组。

- 创建一个新数组，其结果是该数组中的每个元素都调用一个提供的函数后返回的结果
- 对原来的数组没有影响（纯）

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
        throw new TypeError(callbackfn + ' is not a function');  
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
            let mappedValue = callbackfn.call(T, kValue, k, O);      
            A[k] = mappedValue;    
        }  
    }  
    return A;
}
```

`length >>> 0`, 字面意思是指"右移 0 位"，但实际上是把前面的空位用0填充，这里的作用是<u>保证len为数字且为整数</u>，举几个特例：

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



### reduce

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



### 用reduce实现map



### push / pop

不纯

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



### filter

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



### splice

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



### sort

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



### new

1. 新生成了一个对象
2. 链接到原型
3. 绑定 this，执行构造函数
4. 返回新对象

做了三件事情:

- 让实例可以访问到私有属性
- 让实例可以访问构造函数原型(`constructor.prototype`)所在原型链上的属性
- 如果构造函数返回的结果不是引用数据类型

**手写new**

```js
function newFactory() { // ctor, ...args
    // 获得构造函数
    let ctor = [].shift.call(arguments);
    if(typeof ctor !== 'function'){      
        throw 'newOperator function the first param must be a function';    
    } 
    
    let obj = new Object();
    
    obj.__proto__ = ctor.prototype;
    
    let res = ctor.apply(obj, arguments); 
    // let obj = Object.create(ctor.prototype);
    
    // 确保 new 出来的是个对象
    let isObject = typeof res === 'object' && typeof res !== null;    
    let isFunction = typeof res === 'function';    
    return isObject || isFunction ? res : obj;
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
// 相当于
new (Foo.getName());
(new Foo()).getName();
```



### bind

1. 对于普通函数，绑定this指向
2. 对于构造函数，要保证原函数的原型对象上的属性不能丢失

```javascript
Function.prototype.bind = function (context, ...args) {        
    if (typeof this !== "function") {      
        throw new Error("Function.prototype.bind - what is trying to be bound is not callable");    
    }    
        
    let self = this; // 保存this的值，它代表调用bind的函数   
    let fNOP = function () {};   
    let fbound = function () {
        // 匿名函数中的this是由当初绑定的位置触发决定的 （总之不是要处理的函数）
        self.apply(this instanceof self ? this : context, args.concat(Array.prototype.slice.call(arguments)));    
    }    
    fNOP.prototype = this.prototype;    
    fbound.prototype = new fNOP(); 
    // fbound = Object.create(this.prototype);
    
    return fbound;
}
```



### call / apply

```javascript
Function.prototype.call = function (context, ...args) {  
    let context = context || window;  
    context.fn = this;
	!/^(object|function)$/i.test(typeof context) ? context = Object(context) : null;
    
    let result = eval('context.fn(...args)');
    // let result = context['fn'](...args); 
    
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



### 数组去重

1. 如果数组的后面元素包含当前项，数组最后一项元素替换掉当前项元素，并删除最后一项元素

   ```javascript
   for(let i = 0; i < arr.length - 1; i++) { // 遍历
     let item = arr[i]; 
     let remainArgs = arr.slice(i+1); // 从i+1项开始截取数组中剩余元素，包括i+1位置的元素
     if (remainArgs.indexOf(item) > -1) { // 数组的后面元素 包含当前项
       arr[i] = arr[arr.length - 1]; // 用数组最后一项替换当前项
       arr.length--; // 删除数组最后一项
       i--; // 仍从当前项开始比较
     }
   }
   ```

2. 容器存储

   ```javascript
   let obj = {};
   for (let i=0; i < arr.length; i++) {
     let item = arr[i]; // 取得当前项
     if (typeof obj[item] !== 'undefined') {
       // obj 中存在当前属性，删除当前项
       arr[i] = arr[arr.length-1];
       arr.length--;
       i--;
     }
     obj[item] = item; 
   }
   obj = null; // 垃圾回收
   ```

3. 基于正则

   ```javascript
   arr.sort((a,b) => a-b);
   arrStr = arr.join('@') + '@';
   let reg = /(\d+@)\1*/g,
       newArr = [];
   arrStr.replace(reg, (val, group1) => {
    // newArr.push(Number(group1.slice(0, group1.length-1)));
    newArr.push(parseFloat(group1));
   })
   ```

4. `Set`

   扩展运算符（`...`）内部使用`for...of`循环，所以也可以用于 Set 结构

   ```javascript
   const items = new Set([1, 2, 3, 4, 5, 5, 5, 5]);
   items.size; // 5
   
   // 去除数组的重复成员
   [...new Set(array)];
   
   // 去除字符串里面的重复字符
   [...new Set('ababbc')].join(''); // "abc"
   ```

   ``` javascript
   function dedupe(array) {
     return Array.from(new Set(array));
   }
   
   dedupe([1, 1, 2, 3]) // [1, 2, 3]
   ```

   



### 浅拷贝

**手动实现**

```javascript
const shallowClone = (target) => {  
    if (typeof target === 'object' && target !== null) {    
        const cloneTarget = Array.isArray(target) ? []: {};    
        for (let prop in target) {      
            if (target.hasOwnProperty(prop)) {
                // 遍历对象自身可枚举属性（不考虑继承属性和原型对象）
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

const deepClone = (target, map = new WeakMap()) => {  
    if(!isObject(target)) return target;  
    let type = getType(target);  
    let cloneTarget;  
    if(!canTraverse[type]) {    
        // 处理不能遍历的对象    
        return handleNotTraverse(target, type); 
    } else {    
        // 保证对象的原型不丢失 
        let ctor = target.constructor;    
        cloneTarget = new ctor();  
    }  
    
    if(map.get(target)) return target;  
    map.set(target, true); 
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

### 节流 & 防抖

防抖和节流的作用都是防止函数多次调用，区别在于，假设一个用户一直触发这个函数，且每次触发函数的间隔小于wait，防抖的情况下只会调用一次，而节流的情况会每隔一定时间（参数wait）调用函数

#### 节流

**核心思想**：如果在定时器的时间范围内再次触发，则不予理睬，等当前定时器完成，才能启动下一个定时器任务，即**间隔执行**，每隔一段时间执行一次，目的是<u>频繁触发中缩减频率</u>

**适用场景**：

- 拖拽：固定时间内只执行一次，防止超高频次触发位置变动
- 缩放：监控浏览器resize
- 动画：避免多次触发动画引起性能问题

```javascript
// 定时器
function throttle(fn, interval) {  
    let flag = true;  
    return funtion(...args) {        
        if (!flag) return;    
        flag = false;    
        setTimeout(() => {      
            fn.apply(this, args);      
            flag = true;    
        }, interval);  
    };
}
```


```javascript
// 时间戳
const throttle = function(fn, interval) {  
    let last = 0;  
    return function (...args) {        
        let now = +new Date();    
        // 还没到时间    
        if(now - last < interval) return;    
        last = now;    
        fn.apply(this, args);
    }
}
```

#### 防抖

**核心思想**：每次事件触发则删除原来的定时器，建立新的定时器，**延迟执行**，目的是<u>频繁触发中只执行一次</u>。跟王者荣耀回城功能类似，你反复触发回城功能，那么只认最后一次，从最后一次触发开始计时

**适用场景**：

- 按钮提交：防止多次提交按钮，只执行最后一次提交
- 服务器验证：表单验证需要服务器配合，只执行一段连续输入事件的最后一次，还有搜索联想词功能类似，希望用户输入完最后一个字才调用查询接口

```javascript
function debounce(fn, delay) {  
    let timer = null;  
    return function anonymous(...args) {    
        let context = this;    
        if(timer) clearTimeout(timer);    
        timer = setTimeout(function() {      
            fn.apply(context, args);    
        }, delay);  
    }
}
```

有立即选项的防抖

```javascript
function debounce (func, wait = 50, immediate = true) {
  let timer, context, args;

  // 延迟执行函数
  const later = () => setTimeout(() => {
    timer = null
    // 延迟执行的情况下，函数会在延迟函数中执行
    // 使用到之前缓存的参数和上下文
    if (!immediate) {
      func.apply(context, args);
      context = args = null;
    }
  }, wait)

  // 返回实际调用的函数
  return function(...params) {
    // 如果没有创建延迟执行函数就创建一个
    if (!timer) {
      timer = later();
      // 如果是立即执行，调用函数；否则缓存参数和上下文
      if (immediate) {
        func.apply(this, params)
      } else {
        context = this;
        args = params;
      }
    } else {
      // 延迟函数重新计时
      clearTimeout(timer)
      timer = later()
    }
  }
}
```

#### 加强版节流

可以把防抖和节流放到一起，因为防抖有时候触发的太频繁会导致一次响应都没有，我们希望到了固定的时间必须给用户一个响应

```javascript
const throttle = function throttle(func, wait = 500) {
    let previous = 0,
        timer = null;
    return function anonymous(...params) {
        let now = +new Date(),
            remaining = wait - (now - previous);
        if (remaining <= 0) { // 到时间了
            clearTimeout(timer);
            timer = null; // 后续可以通过判断timer是否为null，而判断是否有定时器
            previous = now;
            func.call(this, ...params);
        } else if (!timer) {
            timer = setTimeout(() => {
                clearTimeout(timer);
                timer = null; // // 确保每次执行完的时候timer都清0，回到初始状态
                previous = +new Date();
                func.call(this, ...params);
            }, remaining);
        }
    };
};
```



### 大数相加

```javascript
function bigNumSum(a, b) {
    let cur = 0;
    while(cur < a.length || cur < b.length) {
        if(!a[cur]) {
            a = '0' + a;
        } else if(!b[cur]) {
            b = '0' + b;
        }
        cur++;
    }

    let flag = 0;
    let res = [];

    for(let i = a.length - 1; i >=0; i--) {
        let sum = flag + +a[i] + +b[i];
        flag = (sum > 9) ? 1 : 0;
        res[i] = sum % 10;

        if(flag == 1) res.unshift(1);
    }

    return res.join('');;
}

console.log(bigNumSum('123456789', '1234'));
```



### 实现加法

```javascript
function twoSum(a, b) {
  if (a === 0) return b;
  if (b === 0) return a;
  const res = a ^ b;

  return twoSum(res, (a & b) << 1);
}

// test

a = twoSum("" + Math.pow(2, 20), "" + Math.pow(2, 20));

console.log(a === Math.pow(2, 21));
```





