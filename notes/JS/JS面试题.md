## 一 概念

### '1'.toString()为什么可以调用？

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



### 5.0.1+0.2为什么不等于0.3？

0.1和0.2在转换成二进制后会无限循环，由于标准位数的限制后面多余的位数会被截掉，此时就已经出现了精度的损失，相加后因浮点数小数位的限制而截断的二进制数字在转换为十进制就会变成0.30000000000000004。



### 6.如何理解BigInt?

#### 什么是BigInt?

> BigInt是一种新的数据类型，用于当整数值大于Number数据类型支持的范围时。这种数据类型允许我们安全地对 `大整数`执行算术操作，表示高分辨率的时间戳，使用大整数id，等等，而不需要使用库。

#### 为什么需要BigInt?

在JS中，所有的数字都以双精度64位浮点格式表示，那这会带来什么问题呢？

这导致JS中的Number无法精确表示非常大的整数，它会将非常大的整数四舍五入，确切地说，JS中的Number类型只能安全地表示-9007199254740991(-(2^53-1))和9007199254740991（(2^53-1)），任何超出此范围的整数值都可能失去精度。

```
console.log(999999999999999);  //=>10000000000000000
```

同时也会有一定的安全性问题:

```
9007199254740992 === 9007199254740993;    // → true 居然是true!
```

#### 如何创建并使用BigInt？

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

#### 值得警惕的点

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



## 二 检测

### 2. instanceof能否判断基本数据类型？

能。比如下面这种方式:

```
class PrimitiveNumber {  static [Symbol.hasInstance](x) {    return typeof x === 'number'  }}console.log(111 instanceof PrimitiveNumber) // true
```

如果你不知道Symbol，可以看看MDN上关于hasInstance的解释。

其实就是自定义instanceof行为的一种方式，这里将原有的instanceof方法重定义，换成了typeof，因此能够判断基本数据类型。

### 4. Object.is和===的区别？

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

### 1. [] == ![]结果是什么？为什么？

解析:

== 中，左右两边都需要转换为数字然后进行比较。

[]转换为数字为0。

![] 首先是转换为布尔值，由于[]作为一个引用类型转换为布尔值为true,

因此![]为false，进而在转换成数字，变为0。

0 == 0 ， 结果为true



### 5. 如何让if(a == 1 && a == 2)条件成立？

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

### 如何解决下面的循环输出问题？

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
for(let i = 1; i <= 5; i++){  setTimeout(function timer(){    console.log(i)  },0)}
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



## 六 JS如何实现继承

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
    //看到没有        
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {                         
            value: subClass,                         
            enumerable: false,                         
            writable: true,                         
            configurable: true                 
        }         
    });         
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

核心是_inherits函数，可以看到它采用的依然也是第五种方式——寄生组合继承方式，同时证明了这种方式的成功。不过这里加了一个`Object.setPrototypeOf(subClass, superClass)`，这是用来继承父类的静态方法，这也是原来的继承方式疏忽掉的地方

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



## 六 函数的arguments（类数组）转化为数组

常见的类数组还有：

- 用`getElementByTagName`/`ClassName/Name()`获得的`HTMLCollection`
- 用`querySlector`获得的`nodeList`

必要时需要我们将它们转换成数组从而使用数组方法

1. Array.prototype.slice.call()

```javascript
function sum(a, b) {  
    let args = Array.prototype.slice.call(arguments);
    console.log(args.reduce((sum, cur) => sum + cur));//args可以调用数组原生的方法啦
}
sum(1, 2);//3
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

4. 利用concat+apply

```javascript
function sum(a, b) {  
    let args = Array.prototype.concat.apply([], arguments);
}
```



## 七 forEach中return有效果吗？如何中断forEach循环？

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



## 八 JS判断数组中是否包含某个值

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



## 九 JS中flat——数组扁平化

需求:多维数组=>一维数组

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

   如果函数独立调用，那么该函数内部的this，则指向undefined，非严格模式中自动指向全局对象

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





## 十 内存机制

### 24. 数据是如何存储的

一言以蔽之: 基本数据类型用栈存储，引用数据类型用堆存储

对于赋值操作，原始类型的数据直接完整地赋值变量值，对象数据类型的数据则是复制引用地址



