# React

## elements

elements是最小创建元素 描述在屏幕上显示的东西

React elements不同于DOM elements，创建很容易

elements构成组件components

React elements是不可变的，更新UI只能通过重建一个新的element来实现

## Components & Props

Components使UI分割成独立可复用的部分

概念上，组件就像JS的函数，接收props作为输入并返回描述屏幕显示的React元素

### Function & Class Components

元素可以采用用户自定义的组件，该组件必须大写字母开头

当React遇见用户自定义的组件是，会将JSX的属性作为一个对象传递给组件，这个对象就是props(properties)

React组件必须表现得像一个纯函数，即不能修改输入（属性props），对于相同的输入总是返回相同的结果