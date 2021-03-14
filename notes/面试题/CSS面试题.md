# 概念类

## 语法

### 1. 伪类、伪元素

`css`引入伪类和伪元素概念是为了**格式化文档树以外的信息**。伪类和伪元素是用来修饰不在文档树中的部分。

**伪类** 当元素处于某个<u>状态</u>时添加对应样式 —— 根据用户行为而动态变化

**伪元素** 创建不在文档树中的元素，并为其添加样式



### 2. 选择器

**选择器优先级**



### 3. ```flex: 1```完整写法

```flex```属性是```flex-grow```, ```flex-shrink``` 和 ```flex-basis```, 默认值为```0 1 auto```

> http://www.ruanyifeng.com/blog/2015/07/flex-grammar.html



### 4. ```display: none```和 ```visibility:hidden```的区别



### 5.  ```em rem vh vw calc() line-height``` 百分比

**```em```**作为font-size的单位时，其代表父元素的字体大小，作为其他属性单位时，代表自身字体大小

`rem`：相对单位，可理解为”`root em`”, 相对根节点html的字体大小来计算

`vw`：viewpoint width，视窗宽度，1vw等于视窗宽度的1%。

`vh`：viewpoint height，视窗高度，1vh等于视窗高度的1%。

`vmin`：取当前`vw`和`Vh`中较小的那一个值， `vmax`：取当前`Vw`和`Vh`中较大的那一个值

`vw`、`vh` 与 % 百分比的区别：

- % 是相对于父元素的大小设定的比率，`vw`、`vh` 是视窗大小决定的。
- `vw`、`vh` 优势在于能够直接获取高度，而用 % 在没有设置 body 高度的情况下，是无法正确获得可视区域的高度的，所以这是挺不错的优势。

`calc()`: CSS3中新增的一个函数, 用于动态计算宽/高, 语法非常简单，加 （+）、减（-）、乘（*）、除（/），使用数学表达式来表示

- 使用“+”、“-”、“*” 和 “/”四则运算；
- 可以使用百分比、`px`、`em`、rem等单位；
- 可以混合使用各种单位进行计算；
- 表达式中有“+”和“-”时，其前后必须要有空格，如"width: `calc`(12%+5em)"这种没有空格的写法是错误的；



### 6. 清除浮动 原因 方法 原理

**原因**：父元素因为子级元素浮动引起的内部高度为0的问题

**4种方式**：

1. 父级`div`定义`height`
2. 额外标签法：在有浮动的父级元素的末尾插入了一个没有内容的块级元素div 并添加样式`clear:both`。
3. 利用伪元素：父级div定义 伪类:after，我们可以写一个`.clearfix` 工具样式，当需要清除浮动时，就为其加上这个类 `.clearfix:after { display: block; clear :both; content: '';}`。
4. 父级添加`overflow`属性：包含浮动元素的父标签添加样式`overflow`为`hidden`或`auto`，通过触发BFC方式，实现清除浮动

> https://juejin.im/post/59e7190bf265da4307025d91



### 7. ```vertical-align ```有哪些值？它在什么情况下才能生效？

vertical-align属性值：

- 线类：baseline、top、middle、bottom
- 文本类：text-top、text-bottom
- 上标下标类：sub、super
- 数值百分比类：20px、2em、20%等（对于基线往上或往下偏移）

> 负值相对于基线往下偏移，正值往上偏移，事实上`vertical-align: base-line`等同于`vertical-align: 0`。这个负值真的是 CSS 神器！vertical-align生效前提：

- 内联元素span、strong、`em`、`img`、button、input等
- display值为inline、inline-block、inline-table或table-cell的元素
- 需要注意浮动和绝对定位会让元素块状化，因此此元素绝对不会生效



### 8. BFC(块格式化上下文)

格式化上下文, 它是页面中的一块渲染区域,并且有一套渲染规则,它决定了其子元素将如何定位,以及和其他元素的关系和相互渲染作用 BFC 即 Block Formatting Contexts (块级格式化上下文)，它属于上述定位方案的普通流。

**触发BFC**

只要元素满足下面任一条件即可触发

- 根元素(`<html>`)
- 浮动元素（元素的 float 不是 none）
- 绝对定位元素（元素的 position 为 absolute 或 fixed）
- 行内块元素（元素的 display 为 inline-block）
- overflow 值不为 visible 的块元素

> [10 分钟理解 BFC 原理](https://zhuanlan.zhihu.com/p/25321647)



## 细节拓展

### 1. ```css```解析规则

**从右向左解析**

若从左向右的匹配，发现不符合规则，需要进行回溯，会损失很多性能。

若从右向左匹配，先找到所有的最右节点，对于每一个节点，向上寻找父节点直到找到根元素或者满足条件的匹配规则，则结束这个分支的遍历。

两种匹配规则的性能差别很大，是因为从右向左的匹配在第一步就筛选掉了大量的不符合条件的最右节点（叶子节点），而从左向右的匹配规则的性能都浪费在了失败的查找上面。

> http://www.cnblogs.com/zhaodongyu/p/3341080.html



### 2. ```rem```

rem布局的本质是**等比缩放**，一般是基于宽度

基础知识：

1. 默认浏览器设置的字体大小为16px
2. ```viewport```属性 width、height、initial-scale、maximum-scale、minimum-scale、user-scalable，分别表示宽度、高度、初始缩放比例、最大缩放比例、最小缩放比例、是否允许用户缩放

```
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1.0, user-scalable=no">
```

3. ```dpr```是设备像素比，是```css```里面1px所能显示的像素点的个数，值越大，显示的越精细```window.devicePixelRatio```获取到当前设备的```dpr```。

**rem实现适配的原理**：

- 核心思想：百分比布局可实现响应式布局，而rem相当于百分比布局。
- 实现原理：动态获取当前视口宽度width，除以一个固定的数n，得到rem的值。表达式为rem = width / n。
- 通过此方法，rem大小始终为width的n等分。

计算方案：

1. 通过```dpr```设置缩放比，实现布局视口大小

```
var scale = 1 / devicePixelRatio;  
document.querySelector('meta[name="viewport"]').setAttribute('content','initial-scale='+ scale + ', maximum-scale=' + scale + ', minimum-scale=' + scale + ', user-scalable=no');
```

1. 动态计算html的font-size

```
// 设置根元素字体大小。此时为宽的100等分
document.documentElement.style.fontSize = ocument.documentElement.clientWidth / 100 + 'px';
```

实际开发过程中，可以使用 ```lib-flexible```库，但是如果每次写的时候都要手动去计算有点太过麻烦了，我们可以通过在```webpack```中配置 ```px2rem-loader``` 或者```pxrem-loader```，主要原理就是需要自己配置``` px```转```rem```的计算规则，在编辑的时候直接计算转成rem。所以在开发的时候直接按照设计稿的尺寸写```px```，编译后会直接转化成rem

> [Rem布局的原理解析](https://zhuanlan.zhihu.com/p/30413803)
>
> [移动端页面开发适配 rem布局原理](https://segmentfault.com/a/1190000007526917)
>
> [使用Flexible实现手淘H5页面的终端适配](https://www.w3cplus.com/mobile/lib-flexible-for-html5-layout.html)



### 3. ```css``` modules

**作用**:  避免```css```相互覆盖，CSS Modules 加入了局部作用域和模块依赖 

CSS的规则是全局的，任何一个组件的样式规则，对整个页面有效，产生局部作用域的唯一方法，就是使用一个独一无二的class名字，不会与其他选择器重名，这就是CSS Modules的**实现原理**：将每个类名编译成独一无二的哈希值

> [CSS Modules 用法教程](http://www.ruanyifeng.com/blog/2016/06/css_modules.html)



### 4. ```postcss```

> [PostCSS 是个什么鬼东西？](https://segmentfault.com/a/1190000003909268)
>
> [precss](https://github.com/jonathantneal/precss)
>
> [postcss-cssnext](https://github.com/MoOx/postcss-cssnext/)



# 实现类

> **CSS顺序**：
>  控制显示隐藏
>  控制位置
>  margin padding大小
>  内容样式
>  边框
>  其它

### 实现固定宽高比的```div```

利用`padding`百分比的计算方法：`padding`设置为百分比，是以元素的宽度乘以`100%`从而得到的`padding`值的



> [常见CSS布局的实现](https://github.com/funnycoderstar/blog/issues/125)

### 水平垂直居中

```html
<body>
    <div class="wrap">
        <div class="center"></div>
    </div>
</body>
```

1. **flex布局**：<u>父元素</u> `display: flex; justify-content: center; slign-items: center`

   ```html
   <style>
       .wrap {
           display: flex;
           justify-content: center;
           align-items: center;
           width: 100%;
           height: 300px;
           background-color: red;
       }
       .content {
           width: 50%;
           height: 100px;
           background-color: blue;
       }
   </style>
   ```

2. **使用定位 + `translate`** ：<u>子元素</u> `position: absolute` + `transform: translate(-50%, -50%)` 

   ```html
   <style>
       .wrap {
           width: 100%;
           height: 500px;
           border:1px solid red;
       }
       .content {
           position: absolute;
           left: 50%;
           top: 250px;
           /* translate是基于元素本身的宽高去计算百分比的，所以同样适用于宽度和高度都不固定的情况 */
           transform: translate(-50%, -50%);
           width: 200px;
           height: 200px;
           border: 1px solid green;
       }
   </style>
   ```

3. **使用定位**：<u>父元素</u> `position: relative` <u>子元素</u> `position: absolute` + `let: 0; right: 0; top: 0; bottom: 0; margin: auto`

   ```html
   <style>
       .wrap {
           width: 100%;
           height: 300px;
           background-color: red;
           position: relative;
       }
       .content {
           position: absolute;
           left: 0;
           right: 0;
           top: 0;
           bottom: 0;
           margin: auto;
           width: 100px;
           height: 50px;
           background-color: blue;
       }
   </style>
   ```

### 两列布局

#### 左边宽度固定, 右边宽度自适应

1. <u>左边</u>浮动, 下个元素就会独占位置,并排一行

   ```html
   <style>
       .left {
           float: left;
           width: 50%;
           height: 100px;
           background-color: blue;
       }
       .right {
           width: auto;
           height: 100px;
           background-color: red;
       }
   </style>
   <body>
       <div class="left">
       
       </div>
       <div class="right">
   
       </div>
   </body>
   ```

2. <u>left元素</u>浮动，宽度固定

   <u>right元素</u>`width: 100%; padding-left:left元素的宽度`，宽度自适应

   ```html
   <style>
       .wrap {
           width: 100%;
           background-color: gray;
           height: 100px;
       }
       .left {
           float: left;
           width: 50%;
           height: 100%;
           background-color: green;
       }
       .right {
           padding-left: 50%;
           width: 100%;
           height: 100%;
           background-color: fuchsia; 
       }
   </style>
   <div class="wrap">
       <div class="left">左侧元素</div>
       <div class="right">右侧元素</div>
   </div>
   ```

#### 右边宽度固定, 左边宽度自适应

左右都浮动，左边自适应元素设置外层div 100%宽度, 这样就会独占一行；然后里层设置右边的margin, 把右边元素位置空出来；右侧元素设置`margin-left`为负值

```html
<style>
    * {
        margin: 0;
        padding: 0;
        border: 0;
    }
    .left-fa {
        float: left;
        width: 100%;
    }
    .left {
        margin-right: 50%;
        height: 100px;
        background-color: blue;
    }
    .right {
        float: left;
        margin-left: -50%;
        width: 50%;
        height: 100px;
        background-color: red;   
    }
</style>
<body>
    <div class="left-fa">
        <div class="left">
                left
        </div>
    </div>
    <div class="right">
        right
    </div>
</body>
```



### 三列布局

**中间自适应, 左右两边固定**

#### 1. position实现

设置一个最外级div (给父元素设置relative，相对于最外层定位)

 左右边设置绝对定位（注意绝对定位的元素脱离文档流，相对于最近的已经定位的元素进行定位，无需考虑HTML中结构的顺序）

<u>缺点</u>：有顶部对齐问题，需要进行调整，注意中间的高度为整个内容的高度

```html
<style>
    * {
        margin: 0;
        padding: 0;
        border: 0;
    }
    .main {
        position: relative;
    }
    .left {
        position: absolute;
        top: 0;
        left: 0;
        width: calc(100vw/3);
        height: 100px;
        background-color: blue;
    }
    .middle {
        margin-left: 200px;
        margin-right: 200px;
        height: 100px;
        background-color: yellow;
    }
    .right {
        position: absolute;
        top: 0;
        right: 0;
        width: calc(100vw/3);
        height: 100px;
        background-color: red;
    }
</style>
<body>
    <div class="main">
        <div class="left">
                left
        </div>

        <div class="middle">
                middle
        </div>
        
        <div class="right">
            right
        </div>
    </div>
</body>
```

#### 2. float实现

原理：元素浮动后，脱离文档流，后面的元素受浮动影响，设置受影响元素的margin值即可

需要将中间的内容放在html结构的最后，否则右侧会沉在中间内容的下侧

```html
<style>
    * {
        margin: 0;
        padding: 0;
        border: 0;
    }
    .main {
        overflow: hidden;
    }
    .left {
        float: left;
        width: 200px;
        height: 100px;
        background-color: blue;
    }
    .right {
        float: right;
        width: 200px;
        height: 100px;
        background-color: red;
    }
    /* 利用中间元素的margin值控制两边的间距, 宽度小于左右部分宽度之和时，右侧部分会被挤下去*/
    .middle {
        margin-left: 200px;
        margin-right: 200px;
        height: 100px;
        background-color: yellow;
    }

</style>
<body>
    <div class="main">
        <div class="left">
                left
        </div>

        
        <div class="right">
            right
        </div>

        <!-- 需要将中间的内容放在html结构的最后,否则右侧会沉在中间内容的下侧 -->
        <div class="middle">
                middle
        </div>
    </div>
</body>
```

#### 3. flex布局

`display: flex; justify-content: space-between;`

```html
<style>
    .content {
        margin: 20px auto;
        width: 760px;
        display: flex;
        justify-content: space-between;
    }
    .middle {
        width: 100%;
        height: 100px;
        background: red;
    }
    .left {
        width: 100%;
        height: 100px;
        background: green;
    }
    .right {
        width: 100%;
        height: 100px;
        background: blue;
    } 
</style>
<body>
    <div class="content">
        <div class="left"></div>
        <div class="middle">middle</div>
        <div class="right"></div>
    </div>
</body>
```

#### 4. 圣杯布局和双飞翼布局

- 共同点：三栏全部float浮动，但左右两栏加上负margin让其跟中间栏div并排，以形成三栏布局。[负边距](http://www.cnblogs.com/2050/archive/2012/08/13/2636467.html)是这两种布局中的重中之重
- 不同点：解决“中间栏div内容不被遮挡的思路不同

**圣杯布局**

1. 三者都设置向左浮动
2. 设置middle宽度为100%
3. 设置负边距， left设置负左边距为100%, right设置负左边距为负的自身宽度
4. 设置content的padding值给左右两个子面板留出空间
5. 设置两个子面板为相对定位，`left`面板的left值为负的`left`面板宽度，`right`面板的right值为负的`right面板`的值



**双飞翼布局**

1. 三者都设置向左浮动
2. 设置middle宽度为100%
3. 设置负边距，left设置负左边距为100%，right设置负左边距为负的自身宽度
4. 设置middle-content的margin值给左右两个子面板留出空间

```html
<style>
    .content {
        overflow: hidden;
    }
    .middle {
        width: 100%;
        float:left;
    }
    .middle-content {
        margin-left: 100px;
        margin-right: 30vw;
        width: 100%;
        height: 100px;
        background: red;
    }
    .left {
        float:left;
        margin-left: -100%;
        width: 100px;
        height: 100px;
        background: green;
    }
    .right {
        float:left;
        margin-left: -30vw;
        width: 30vw;
        height: 100px;
        background: blue;
    }
</style>
<body>
    <div class="content">
        <div class="middle">
            <div class="middle-content">
                    middle
            </div>
        </div>
        <div class="left"></div>
        <div class="right"></div>
    </div>
</body>
```



# 待续

[50道 CSS 基础面试题（附答案）](https://www.itcodemonkey.com/article/2853.html)

[你未必知道的49个CSS知识点](https://juejin.im/post/5d3eca78e51d4561cb5dde12)

[你未必知道的CSS知识点（第二季）](https://juejin.im/post/5d9ec8b0518825651b1dffa3)

[个人总结（css3新特性）](https://juejin.im/post/5a0c184c51882531926e4294)

[前端基础篇之CSS世界](https://juejin.im/post/5ce607a7e51d454f6f16eb3d)