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

> 负值相对于基线往下偏移，正值往上偏移，事实上vertical-align:base-line等同于vertical-align:0。这个负值真的是 CSS 神器！vertical-align生效前提：

- 内联元素span、strong、em、img、button、input等
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

### 1. 实现固定宽高比的```div```

利用`padding`百分比的计算方法：`padding`设置为百分比，是以元素的宽度乘以`100%`从而得到的`padding`值的



## 布局

> [常见CSS布局的实现](https://github.com/funnycoderstar/blog/issues/125)

### 1. 水平垂直居中

1. flex布局：父元素设置 `display: flex; justify-content: center; slign-items: center`
2. `position: absolute` + `transform: translate(-50%, -50%)` , translate是基于元素本身的宽高去计算百分比的，所以同样适用于宽度和高度都不固定的情况
3. `position: absolute` + `let: 0; right: 0; top: 0; bottom: 0; margin: auto`;



### 2. 