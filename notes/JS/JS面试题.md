## 一 概念

### var / let / const

**`var`**

1. 可以重复声明

2. 不能定义常量

3. 不支持块级作用域

**`let`**

1. 不存在变量提升

    `var`命令会发生“变量提升”现象，即变量可以在声明之前使用

   `let`命令所声明的变量一定要在声明后使用，否则报错

2. 暂时性死区

   ES6 明确规定，如果区块中存在`let`和`const`命令，这个区块对这些命令声明的变量，从一开始就形成了封闭作用域。凡是在声明之前就使用这些变量，就会报错

   ES6 规定暂时性死区和`let`、`const`语句不出现变量提升；暂时性死区的本质就是，只要一进入当前作用域，所要使用的变量就已经存在了，但是不可获取，只有等到声明变量的那一行代码出现，才可以获取和使用该变量

3. 不允许重复声明

   `let`不允许在相同作用域内，重复声明同一个变量

4. 块级作用域

   没有块级作用域：内层变量可能会覆盖外层变量；用来计数的循环变量泄露为全局变量

   考虑到环境导致的行为差异太大，应该避免在块级作用域内声明函数，如果确实需要，也应该写成函数表达式，而不是函数声明语句（函数声明类似于`var`，即会提升到作用域的头部）

**`const`**

1. 一旦声明变量，就必须立即初始化
2. `const`实际上保证的是变量指向的那个内存地址所保存的数据不得改动：对于基本类型值（数值、字符串、布尔值）保存在变量指向的那个内存地址，因此等同于常量；但对于复合类型值（主要是对象和数组），变量指向的内存地址，保存的只是一个指向实际数据的指针，`const`只能保证这个指针是固定的（即总是指向另一个固定的地址），至于它指向的数据结构是不是可变的，就完全不能控制了。

ES5 只有两种声明变量的方法：`var`命令和`function`命令。ES6 除了添加`let`和`const`命令，后面章节还会提到，另外两种声明变量的方法：`import`命令和`class`命令。所以，ES6 一共有 6 种声明变量的方法。



### Symbol

ES6 引入`Symbol`的原因：从根本上防止属性名的冲突



### `Set` / `Map` 

**`Set`**

`Set`函数可以接受一个数组（或者具有 iterable 接口的其他数据结构）作为参数，用来初始化

**扩展运算符（`...`）**内部使用`for...of`循环，所以也可以用于 Set 结构

```javascript
// 数组去重
let arr = [3, 5, 2, 2, 5, 5];
let unique = [...new Set(arr)]; // [3, 5, 2]

// 间接使用数组的map和filter方法
let set = new Set([1, 2, 3]);
set = new Set([...set].map(x => x * 2)); // 返回Set结构：{2, 4, 6}

let set = new Set([1, 2, 3, 4, 5]);
set = new Set([...set].filter(x => (x % 2) == 0));// 返回Set结构：{2, 4}

// 实现并集（Union）、交集（Intersect）和差集（Difference）
let a = new Set([1, 2, 3]);
let b = new Set([4, 3, 2]);

// 并集
let union = new Set([...a, ...b]); // Set {1, 2, 3, 4}

// 交集
let intersect = new Set([...a].filter(x => b.has(x))); // set {2, 3}

// （a 相对于 b 的）差集
let difference = new Set([...a].filter(x => !b.has(x))); // Set {1}
```





###  `WeakMap` / `WeakSet`

**`WeakMap`**键只能使用对象：为了保证只有通过键对象的引用来取得值

`WeakMap`支持`get() set() delete() has()`；不支持迭代、`size keys() values() entries()`，即没有办法获取`WekaMap`的所有键或值

**`WeakSet`**中只能添加对象，不能添加原始值；对象只有在其他某个地方能被访问时才能留在弱引用中

`WeakSet`支持`add() has() delete()` ；不支持迭代、`size keys()`

> 因为不能准确知道何时会被回收

```javascript
const a = {};
// 在创建对象时，分配了一块内存，并把这块内存的地址传给 a
m.set(a, 100);
// 执行 set 操作时，实际上是将 a 指向的内存地址和 100 关联起来
// 如果使用这种方式，则不会被回收。因为 {} 有 a 变量在引用它
a = null;
// 将 a 置为空后，m 里的值 100 在垃圾回收时将会被回收

const m = new WeakMap();
m.set({}, 100);
// 由于 {} 没有在其他地方引用，所以在垃圾回收时，这个值也会被回收

const a = "abc";
// 由于基本数据类型在传递时，传递的是值，而不是引用。
m.set(a, 100);
// 所以执行 set 操作时，实际上是将新的 'abc' 和 100 关联起来，而不是原来 a 变量指向的那个
// 那这样就会有问题，m 里存储的永远是没有被引用的键，随时都会被回收
```

**使用场景**

- 缓存计算结果：函数的结果需要被记住，在后续的对同一个对象调用时使用缓存结果
- 如用户访问计数，用户离开时，该用户对象被回收，此时也不需要其访问次数

使用Map时，需要手动清理缓存，否则即使该对象变为不可访问（`=null`），由于该对象是Map中的键，只要Map存在，该对象就依然会在内存中；而使用`WeakMap`，只要外部的引用消失，`WeakMap` 内部的引用，就会自动被垃圾回收清除，对应的缓存结果会随着对象回收一起被清除

> 因为弱引用不会记入到引用计数中去



### '1'.toString()

其实在这个语句运行的过程中做了这样几件事情：

```javascript
var s = new Object('1');
s.toString();
s = null;
```

第一步: 创建Object类实例。注意为什么不是String ？由于Symbol和BigInt的出现，对它们调用new都会报错，目前ES6规范也不建议用new来创建基本类型的包装类。

第二步: 调用实例方法。

第三步: 执行完方法立即销毁这个实例。

整个过程体现了 `基本包装类型`的性质，而基本包装类型恰恰属于基本数据类型，包括Boolean, Number和String。

> 参考:《JavaScript高级程序设计(第三版)》P118



### 0.1+0.2 = 0.3

0.1和0.2在转换成二进制后会无限循环，由于标准位数的限制后面多余的位数会被截掉，此时就已经出现了精度的损失，相加后因浮点数小数位的限制而截断的二进制数字在转换为十进制就会变成0.30000000000000004。

最常见的做法是使用一个很小的“错误舍入”值作为比较的 容差。 这个很小的值经常被称为“机械极小值（machine epsilon）”， 对于 JavaScript 来说这种 number 通常为 Number.EPSILON。

```js
function numbersCloseEnoughToEqual(n1,n2) {
    return Math.abs( n1 - n2 ) < Number.EPSILON;
}

var a = 0.1 + 0.2;
var b = 0.3;

numbersCloseEnoughToEqual( a, b );                    // true
numbersCloseEnoughToEqual( 0.0000001, 0.0000002 );    // false
```



### BigInt

**什么是BigInt?**

> BigInt是一种新的数据类型，用于当整数值大于Number数据类型支持的范围时。这种数据类型允许我们安全地对 `大整数`执行算术操作，表示高分辨率的时间戳，使用大整数id，等等，而不需要使用库。

**为什么需要BigInt?**

在JS中，所有的数字都以双精度64位浮点格式表示，那这会带来什么问题呢？

这导致JS中的Number无法精确表示非常大的整数，它会将非常大的整数四舍五入，确切地说，JS中的Number类型只能安全地表示-9007199254740991(-(2^53-1))和9007199254740991（(2^53-1)），任何超出此范围的整数值都可能失去精度。

```
console.log(999999999999999);  //=>10000000000000000
```

同时也会有一定的安全性问题:

```
9007199254740992 === 9007199254740993;    // → true 居然是true!
```

**如何创建并使用BigInt？**

要创建BigInt，只需要在数字末尾追加n即可。

```
console.log( 9007199254740995n );    // → 9007199254740995nconsole.log( 9007199254740995 );     // → 9007199254740996
```

另一种创建BigInt的方法是用BigInt()构造函数、

```
BigInt("9007199254740995");    // → 9007199254740995n
```

简单使用如下:

```
10n + 20n;    // → 30n10n - 20n;    // → -10n+10n;         // → TypeError: Cannot convert a BigInt value to a number-10n;         // → -10n10n * 20n;    // → 200n20n / 10n;    // → 2n23n % 10n;    // → 3n10n ** 3n;    // → 1000nconst x = 10n;    ++x;          // → 11n--x;          // → 9nconsole.log(typeof x);   //"bigint"
```

**值得警惕的点**

1. BigInt不支持一元加号运算符, 这可能是某些程序可能依赖于 + 始终生成 Number 的不变量，或者抛出异常。另外，更改 + 的行为也会破坏 asm.js代码。
2. 因为隐式类型转换可能丢失信息，所以不允许在bigint和 Number 之间进行混合操作。当混合使用大整数和浮点数时，结果值可能无法由BigInt或Number精确表示。

```
10 + 10n;    // → TypeError
```

1. 不能将BigInt传递给Web api和内置的 JS 函数，这些函数需要一个 Number 类型的数字。尝试这样做会报TypeError错误。

```
Math.max(2n, 4n, 6n);    // → TypeError
```

1. 当 Boolean 类型与 BigInt 类型相遇时，BigInt的处理方式与Number类似，换句话说，只要不是0n，BigInt就被视为truthy的值。

```
if(0n){//条件判断为false}if(3n){//条件为true}
```

1. 元素都为BigInt的数组可以进行sort。
2. BigInt可以正常地进行位运算，如|、&、<<、>>和^



### 执行上下文、作用域链

- 环境定义了变量或函数有权访问的其它数据。每个执行环境都有一个相关联的**变量对象**，环境中定义的所有变量和函数都保存在这个对象中。
- 作用域链的作用是保证执行环境里有权访问的变量和函数是有序的，作用域链的变量只能向上访问，变量访问到 `window`对象即被终止，作用域链向下访问变量是不被允许的。
- 简单的说，作用域就是变量与函数的可访问范围，即作用域控制着变量与函数的可见性和生命周期



## 二 检测

### instanceof判断基本数据类型

能。比如下面这种方式:

```javascript
class PrimitiveNumber {  
    static [Symbol.hasInstance](x) {    
        return typeof x === 'number'  
    }
}
console.log(111 instanceof PrimitiveNumber) // true
```

如果你不知道Symbol，可以看看MDN上关于hasInstance的解释

其实就是自定义instanceof行为的一种方式，这里将原有的instanceof方法重定义，换成了typeof，因此能够判断基本数据类型。

### Object.is和===

Object在严格等于的基础上修复了一些特殊情况下的失误，具体来说就是+0和-0，NaN和NaN。源码如下：

```javascript
function is(x, y) {  
    if (x === y) {    
        //运行到1/x === 1/y的时候x和y都为0，但是1/+0 = +Infinity， 1/-0 = -Infinity, 是不一样的    
        return x !== 0 || y !== 0 || 1 / x === 1 / y;  
    } else {    
        //NaN===NaN是false,这是不对的，我们在这里做一个拦截，x !== x，那么一定是 NaN, y 同理    
        //两个都是NaN的时候返回true    
        return x !== x && y !== y;  
    }
}
```



## 三 转换

### [] == ![]

解析:

== 中，左右两边都需要转换为数字然后进行比较。

[]转换为数字为0。

![] 首先是转换为布尔值，由于[]作为一个引用类型转换为布尔值为true,

因此![]为false，进而在转换成数字，变为0。

0 == 0 ， 结果为true



### (a == 1 && a == 2)

其实就是“对象转原始类型”的应用。

```javascript
var a = {  
    value: 0,  
    valueOf: function() {    
        this.value++;    
        return this.value;  
    }
};
console.log(a == 1 && a == 2);//true
```



## 四 闭包

**本质**

闭包产生的本质就是，当前环境中存在指向父级作用域的引用。

### 表现形式

1. 返回一个函数
2. 作为函数参数传递

```javascript
var a = 1;
function foo(){  
    var a = 2;  
    function baz(){    
        console.log(a);  
    }  
    bar(baz);
}
function bar(fn){  
    // 这就是闭包  
    fn();
}
foo(); // 输出2，而不是1
```

3. 在定时器、事件监听、Ajax请求、跨窗口通信、Web Workers或者任何异步中，只要使用了回调函数，实际上就是在使用闭包
4. IIFE(立即执行函数表达式)创建闭包, 保存了全局作用域window和 当前函数的作用域

```javascript
var a = 2;
(function IIFE(){  
    // 输出2  
    console.log(a);
})();
```

### 循环输出问题

```javascript
for(var i = 1; i <= 5; i ++){  
    setTimeout(function timer(){    
        console.log(i)  
    }, 0)
}
```

为什么会全部输出6？如何改进，让它输出1，2，3，4，5？(方法越多越好)

因为setTimeout为宏任务，由于JS中单线程eventLoop机制，在主线程同步任务执行完后才去执行宏任务，因此循环结束后setTimeout中的回调才依次执行，但输出i的时候当前作用域没有，往上一级再找，发现了i,此时循环已经结束，i变成了6。因此会全部输出6。

解决方法：

1、利用IIFE(立即执行函数表达式)当每次for循环时，把此时的i变量传递到定时器中

```javascript
for(var i = 1;i <= 5;i++){  
    (function(j){    
        setTimeout(function timer(){      
            console.log(j)    
        }, 0)  
    })(i)
}
```

2、给定时器传入第三个参数, 作为timer函数的第一个函数参数

```javascript
for(var i=1;i<=5;i++){  
    setTimeout(function timer(j){    
        console.log(j)  
    }, 0, i)
}
```

3、使用ES6中的let

```javascript
for(let i = 1; i <= 5; i++){  
    setTimeout(function timer(){    
        console.log(i)  
    },0)
}
```

let使JS发生革命性的变化，让JS有函数作用域变为了块级作用域，用let后作用域链不复存在，代码的作用域以块级为单位，以上面代码为例:

```javascript
// i = 1
{  
    setTimeout(function timer(){    
        console.log(1)  
    },0)
}
// i = 2
{  
    setTimeout(function timer(){    
        console.log(2)  
    },0)
}
// i = 3...
```

因此能输出正确的结果



## 六 继承

### 原型链

- 每个对象都会在其内部初始化一个属性，就是 `prototype` (原型)，指向**原型对象**，原型对象的用途是包含可以由特定类型的所有实例共享的属性和方法；当访问一个对象的属性时，如果这个对象内部不存在这个属性，那么就会去 `prototype` 里找这个属性，这个`prototype` 又会有自己的 `prototype` ，于是就这样一直找下去，也就是原型链的概念
- 当函数经过new调用时，这个函数就成为了**构造函数**，返回一个全新的实例对象，这个实例对象有一个**proto**属性，指向<u>构造函数的原型对象</u>
- 关系：`instance.constructor.prototype = instance.__proto__`
- 特点：`JavaScript` 对象是通过引用来传递的，我们创建的每个新对象实体中并没有一份属于自己的原型副本。当我们修改原型时，与之相关的对象也会继承这一改变当我们需要一个属性的时， `Javascript` 引擎会先看当前对象中是否有这个属性， 如果没有的,就会查找他的 `Prototype` 对象是否有这个属性，如此递推下去，一直检索到 `Object`内建对象



### 继承方法

**第一种: 借助call**

```javascript
function Parent1(){    
     this.name = 'parent1';  
 }  
function Child1(){    
    Parent1.call(this);    
    this.type = 'child1'  
}  
console.log(new Child1);
```

这样写的时候子类虽然能够拿到父类的属性值，但是问题是父类原型对象中一旦存在方法那么子类无法继承

**第二种: 借助原型链**

```javascript
function Parent2() {    
    this.name = 'parent2';    
    this.play = [1, 2, 3]  
}  
function Child2() {    
    this.type = 'child2';  
}  
Child2.prototype = new Parent2();  
console.log(new Child2());
```

看似没有问题，父类的方法和属性都能够访问，但实际上有一个潜在的不足

```javascript
var s1 = new Child2();  
var s2 = new Child2();  
s1.play.push(4);  
console.log(s1.play, s2.play);
```

只改变了s1的play属性，s2也跟着变了，因为两个实例使用的是同一个原型对象

**第三种：将前两种组合**

```javascript
function Parent3 () {    
    this.name = 'parent3';    
    this.play = [1, 2, 3];  
}  
function Child3() {   
    Parent3.call(this);    
    this.type = 'child3';  
}  
Child3.prototype = new Parent3();  
var s3 = new Child3();  
var s4 = new Child3();  
s3.play.push(4);  
console.log(s3.play, s4.play);
```

可以看到控制台之前的问题都得以解决。但是这里又徒增了一个新问题，那就是Parent3的构造函数会多执行了一次（`Child3.prototype = new Parent3();`）。这是我们不愿看到的。那么如何解决这个问题？

**第四种: 组合继承的优化1**

```javascript
function Parent4 () {    
     this.name = 'parent4';    
     this.play = [1, 2, 3];  
 }  
function Child4() {    
    Parent4.call(this);    
    this.type = 'child4';  
}  
Child4.prototype = Parent4.prototype;
```

这里让将父类原型对象直接给到子类，父类构造函数只执行一次，而且父类属性和方法均能访问，但是我们来测试一下：

```javascript
var s3 = new Child4();  
var s4 = new Child4();  
console.log(s3)
```

子类实例的构造函数是Parent4，显然这是不对的，应该是Child4

**第五种(最推荐使用): 组合继承的优化1**

```javascript
function Parent5 () {    
    this.name = 'parent5';    
    this.play = [1, 2, 3];  
}  
function Child5() {    
    Parent5.call(this);    
    this.type = 'child5';  
}  
Child5.prototype = Object.create(Parent5.prototype); Child5.prototype.constructor = Child5;
//给子类的构造函数重写原型prototype
  // 以前：subClass.prototype = new superClass();
  //让子类的prototype 等于父类的一个实例,其实是新构建的一个实例，其原型等于父类的原型而已
  //另外还要覆盖constructor,让constructor指向subClass,否则 constructor会指向superClass
```

这是最推荐的一种方式，接近完美的继承，它的名字也叫做**寄生组合继承**

### ES6的extends被编译后的JavaScript代码

ES6的代码最后都是要在浏览器上能够跑起来的，这中间就利用了babel这个编译工具，将ES6的代码编译成ES5让一些不支持新语法的浏览器也能运行

```javascript
function _possibleConstructorReturn (self, call) {         
    // ...        
    return call && (typeof call === 'object' || typeof call === 'function') ? call : self; }
function _inherits (subClass, superClass) {     
    // ...    
    //       
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {                         
            value: subClass,                         
            enumerable: false,                         
            writable: true,                         
            configurable: true                 
        }         
    }); 
    // subClass.__proto__ = superClass
    //让子类的__proto__等于父类，这一步是为了让子类继承父类的静态属性
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
var Parent = function Parent () {        
    // 验证是否是 Parent 构造出来的 this        
    _classCallCheck(this, Parent);
};
var Child = (function (_Parent) {        
    _inherits(Child, _Parent);        
    function Child () {                
        _classCallCheck(this, Child);                
        return _possibleConstructorReturn(this, (Child.__proto__ || Object.getPrototypeOf(Child)).apply(this, arguments));        
    }        
    return Child;
}(Parent));
```

核心是`_inherits`函数，可以看到它采用的依然也是第五种方式——寄生组合继承方式，同时证明了这种方式的成功。不过这里加了一个`Object.setPrototypeOf(subClass, superClass)`，这是用来继承父类的静态方法，这也是原来的继承方式疏忽掉的地方

> 面向对象的设计一定是好的设计吗？

不一定。从继承的角度说，这一设计是存在巨大隐患的。

> 继承的最大问题在于：无法决定继承哪些属性，所有属性都得继承。

当然你可能会说，可以再创建一个父类啊，把加油的方法给去掉，但是这也是有问题的，一方面父类是无法描述所有子类的细节情况的，为了不同的子类特性去增加不同的父类， 代码势必会大量重复，另一方面一旦子类有所变动，父类也要进行相应的更新， 代码的耦合性太高，维护性不好。

如何来解决继承的诸多问题呢？

用组合，这也是当今编程语法发展的趋势，比如golang完全采用的是**面向组合**的设计方式

顾名思义，面向组合就是先设计一系列零件，然后将这些零件进行拼装，来形成不同的实例或者类

```javascript
function drive(){  
    console.log("wuwuwu!");
}
function music(){  
    console.log("lalala!")
}
function addOil(){  
    console.log("哦哟！")
}
let car = compose(drive, music, addOil);
let newEnergyCar = compose(drive, music);
```

代码干净，复用性也很好，这就是面向组合的设计方式



## 六 arguments（类数组）转化为数组

常见的类数组还有：

- 用`getElementByTagName`/`ClassName/Name()`获得的`HTMLCollection`
- 用`querySlector`获得的`nodeList`

必要时需要我们将它们转换成数组从而使用数组方法

1. 借方法 Array.prototype.slice.call()

```javascript
function sum(a, b) {  
    let args = Array.prototype.slice.call(arguments);
    console.log(args.reduce((sum, cur) => sum + cur));//args可以调用数组原生的方法啦
}
sum(1, 2);//3
```

​	Array.prototype.concat.apply()

```javascript
function sum(a, b) {  
    let args = Array.prototype.concat.apply([], arguments);
}
```

2. Array.from()

```javascript
function sum(a, b) {  
    let args = Array.from(arguments);  
}
```

这种方法也可以用来转换Set和Map

3. ES6展开运算符

```javascript
function sum(a, b) {  
    let args = [...arguments];  
}
```



## 七 forEach中return

在forEach中用return不会返回，函数会继续执行

```javascript
let nums = [1, 2, 3];
nums.forEach((item, index) => {  
    return; //无效
})
```

中断方法：

1. 使用try监视代码块，在需要中断的地方抛出异常

2. 官方推荐方法（替换方法）：用every和some替代forEach函数

   every在碰到return false的时候，中止循环

   some在碰到return ture的时候，中止循环



## 八 数组检索

**方法一：array.indexOf**

> 此方法判断数组中是否存在某个值，如果存在，则返回数组元素的下标，否则返回-1。

```javascript
var arr=[1,2,3,4];
var index=arr.indexOf(3);
```

**方法二：array.includes(searcElement[,fromIndex])**

> 此方法判断数组中是否存在某个值，如果存在返回true，否则返回false

**方法三：array.find(callback[,thisArg])**

> 返回数组中满足条件的第一个元素的**值**，如果没有，返回 `undefined`

```javascript
var arr=[1,2,3,4];
var result = arr.find(item =>{    
    return item > 3
});
```

**方法四：array.findeIndex(callback[,thisArg])**

> 返回数组中满足条件的第一个元素的**下标**，如果没有找到，返回 `-1`



## 九 数组扁平化

需求：多维数组=>一维数组

**1. 调用ES6中的flat方法**

```javascript
ary = arr.flat(Infinity);
```

**2. replace + split**

```javascript
ary = str.replace(/(\[|\])/g, '').split(',')
```

**3. replace + JSON.parse**

```javascript
str = str.replace(/(\[|\]))/g, '');
str = '[' + str + ']';
ary = JSON.parse(str);
```

**4. 普通递归**

```javascript
let result = [];
let fn = function(ary) {  
    for(let i = 0; i < ary.length; i++) {    
        let item = ary[i];    
        if (Array.isArray(ary[i])){      
            fn(item);    
        } else {      
            result.push(item);    
        }  
    }
}
```

**5. 利用reduce函数迭代**

```javascript
function flatten(ary) {    
    return ary.reduce((pre, cur) => {        
        return pre.concat(Array.isArray(cur) ? flatten(cur) : cur);    
    }, []);
}
let ary = [1, 2, [3, 4], [5, [6, 7]]];
console.log(flatten(ary))
```

**6. 扩展运算符**

```javascript
//只要有一个元素有数组，那么循环继续
while (ary.some(Array.isArray())) {  
    ary = [].concat(...ary);
}
```



## 十九 this

this的指向，是在函数被调用的时候确定的，也就是执行上下文被创建时确定的

在函数执行过程中，this一旦被确定，就不可更改了

1. **call/apply/bind显式绑定**

2. **全局上下文**

   全局上下文默认this指向window, 严格模式下指向undefined

3. **函数中**

   如果调用者函数，被某一个对象所拥有，那么该函数在调用时，内部的this指向该对象

   如果函数独立调用-，那么该函数内部的this，则指向undefined，非严格模式中自动指向全局对象

4. **对象、方法的形式调用**

5. **new + 构造函数**

   new操作符调用构造函数时，this其实指向的是这个新创建的实例对象

6. **箭头函数**

   只取决于它外面第一个非箭头函数的this

7. **DOM事件绑定(特殊)**

   `onclick`和`addEventerListener`中 this 默认指向绑定事件的元素

   IE比较奇异，使用attachEvent，里面的this默认指向window

> 优先级: new > call、apply、bind > 对象.方法 > 直接调用



## 二十 浅拷贝

```javascript
let arr = [1, 2, 3];
let newArr = arr;
newArr[0] = 100;
console.log(arr);//[100, 2, 3]
```

这是直接赋值的情况，不涉及任何拷贝

当改变newArr的时候，由于是同一个引用，arr指向的值也跟着改变

```javascript
let arr = [1, 2, {val: 4}];
let newArr = arr.slice();

newArr[0] = 100;
newArr[2].val = 1000;
console.log(arr);//[ 1, 2, { val: 1000 } ]
```

这里newArr是arr浅拷贝后的结果，newArr和arr现在引用的已经不是同一块空间，这就是**浅拷贝**

但是这又会带来一个潜在的问题:

改变了newArr改变了第二个元素的val值，arr也跟着变了

浅拷贝只能拷贝一层对象，如果有对象的嵌套，那么浅拷贝将无能为力

**1. 手动实现**

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

**2. Object.assign**

但是需要注意的是，Object.assgin() 拷贝的是对象的属性的引用，而不是对象本身。

```javascript
let obj = { name: 'sy', age: 18 };
const obj2 = Object.assign({}, obj, {name: 'sss'});
console.log(obj2);//{ name: 'sss', age: 18 }
```

**3. concat浅拷贝数组**

```javascript
let arr = [1, 2, 3];
let newArr = arr.concat();
newArr[1] = 100;
console.log(arr);//[ 1, 2, 3 ]
```

**4. slice浅拷贝**

**5. ...展开运算符**

```javascript
let arr = [1, 2, 3];
let newArr = [...arr];//跟arr.slice()是一样的效果
```


