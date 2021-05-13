[TOC]

- [React](#react)
  - [elements](#elements)
  - [Components & Props](#components--props)
    - [Function & Class Components](#function--class-components)
      - [定义组件：](#定义组件)
      - [将一个函数组件转换为类组件：](#将一个函数组件转换为类组件)
      - [学会抽象拆分组件**Extracting Components**](#学会抽象拆分组件extracting-components)
  - [State & Lifecycle](#state--lifecycle)
      - [给类组件添加state（将props转换为state）：](#给类组件添加state将props转换为state)
      - [添加生命周期函数](#添加生命周期函数)
      - [类组件渲染过程](#类组件渲染过程)
      - [```setState()```Tips](#setstatetips)
      - [数据流](#数据流)
  - [事件处理](#事件处理)
      - [React中事件处理与DOM事件处理的区别：](#react中事件处理与dom事件处理的区别)
      - [向事件处理函数传递参数](#向事件处理函数传递参数)
  - [条件渲染](#条件渲染)
  - [List & Keys](#list--keys)
  - [Forms(受控组件)](#forms受控组件)
      - [受控组件（controlled component）](#受控组件controlled-component)
      - [非受控组件](#非受控组件)
      - [处理多个输入](#处理多个输入)

# React

## elements

elements是最小创建元素 描述在屏幕上显示的东西

React elements不同于DOM elements，创建很容易

elements构成组件components

React elements是不可变的，更新UI只能通过重建一个新的element来实现



## 组件 & Props

Components使UI分割成独立可复用的部分

概念上，组件就像JS的函数，接收props作为输入并返回描述屏幕显示的React元素

### Function & Class Components

#### 定义组件

1. 使用JavaScript函数定义

2. 使用ES6的class定义


> 将一个函数组件转换为类组件：
>
> 1. 创建一个ES6 class ```extends React.Component```
>
> 2. 添加```render()```方法，即返回React元素
> 3. 将函数组件主体移入```render()```方法
> 4. 用```this.props```取代```props```

元素可以采用用户**自定义组件**，该组件<u>必须大写字母开头</u>

当React遇见用户自定义的组件是，会将 *JSX的属性* 作为一个对象传递给组件，这个对象就是**props(properties)**

**Extracting Components** 学会抽象拆分组件

React组件必须表现得像一个纯函数，即不能修改输入（属性props），对于相同的输入总是返回相同的结果。对于会动态变化的UI，state可以用来改变React组件的输出。

#### 函数式与类组件有何不同？

[函数式组件与类组件有何不同？](https://overreacted.io/zh-hans/how-are-function-components-different-from-classes/)

**函数式组件捕获了渲染所用的值**（Function components capture the rendered values）

类方法从 `this.props` 中读取数据：在 React 中 Props 是不可变(immutable)的，所以他们永远不会改变；然而，<u>`this`是，而且永远是，可变(mutable)的</u>；事实上，这就是类组件 `this` 存在的意义——<u>React本身会随着时间的推移而改变，以便你可以在渲染方法以及生命周期方法中得到最新的实例</u>

事件处理程序“属于”一个拥有特定 props 和 state 的特定渲染；然而，调用一个回调函数读取 `this.props` 的 `timeout` 会打断这种关联。 `timeout`的回调并没有与任何一个特定的渲染“绑定”在一起，所以它“失去”了正确的 props：从 this 中读取数据的这种行为，切断了这种联系

我们面对的问题是我们从`this.props`中读取数据太迟了——读取时已经不是我们所需要使用的上下文了；然而，如果我们能利用**JavaScript闭包**的话问题将迎刃而解；通常来说我们会避免使用闭包，因为它会让我们难以想象一个可能会随着时间推移而变化的变量；但是<u>在React中，`props`和`state`是不可变的</u>（或者说，在我们的强烈推荐中是不可变的），这就消除了闭包的一个主要缺陷

这就意味着如果在一次特定的渲染中捕获那一次渲染所用的props或者state，他们总是会保持一致；但是看起来很奇怪：如果是在`render`方法中定义各种函数，而不是使用class的方法，那么使用类的意义在哪里？

因此可以通过删除类的“包裹”来简化代码——函数式组件：`props`仍旧被捕获了 —— React将它们作为参数传递，**不同于`this`，`props`对象本身永远不会被React改变**

另外，在函数式组件中，也可以拥有一个在所有的组件渲染帧中共享的可变变量，它被称为`ref`，它只是一个你可以放东西进去的盒子，甚至在视觉上，`this.something`就像是`something.current`的一个镜像，它们代表了同样的概念；默认情况下，React不会在函数式组件中为最新的`props`和`state`创造`refs`



## State & 生命周期

State和props相似，但state是组件私有的

只有用**类组件**才具有state特性

#### 给类组件添加state（将props转换为state）：

1. 用```this.state```代替```this.props```

2. 添加类的构造函数```constructor```来设定```this.state```的初始值

   通过构造函数将传递props

3. 删掉组件里原来的prop

#### 添加生命周期函数

   ```react
class Clock extends React.Component {
    constructor(props) {
        super(props);
        this.state = {date: new Date()};
    }
    
    // 组件挂载完成，当React把虚拟DOM转成真实DOM后执行此方法
    componentDidMount() {
        /** 
        在生命周期函数中，this指向当前组件实例：
        1. bind  this.tick.bind(this)
        2. 方法调用  () => this.tick()
        3. ES7 属性初始化
        4. 在构造函数中bind
        **/
        this.timeID = setInterval(() => this.tick(), 1000);
    }
    
    // 当React准备销毁组件时，预先调用此方法
    componentWillUnmount() {
        clearInterval(this.timeID);
    }
    
    tick() {
        this.setState({
            date: new Date()
        });
    }
    
    render() {
        return (
        	<div>
                <h1>It is {this.state.date.toLocaleTimeString()}.</h1>
            </div>
        );
    }
}
   
ReactDOM.render(
 <Clock />,
    document.getElementByld('root')
);
   ```

如果需要创建的属性不参与UI显示，不会用在```render()```中，就将其添在```this```上，而不是```this.state```

如果要修改本地状态，即当前组件的state，必须要用```this.setState```，调用此方法后，React会根据新的state调用render()重新渲染

#### 类组件渲染过程

1. 将组件```<>```传递给```ReactDOM.render()```后，调用类组件的构造函数，构建实例，初始化state
2. 调用类组件实例的```render()```方法，得到返回的元素，即在屏幕上要显示的东西，然后更新DOM
3. 渲染完成后调用```componentDidMount()```
4. ```setState()```方法会触发```render()```
5. 组件在DOM中被删除时，调用```componentWillUnmount()```

#### ```setState()```Tips

#### 数据流（组件通信）

React 中遵循的是单向数据流，组件的作用域相对是独立的，即不同的组件之间是不能共享数据的，而当将各个组件组装在一起的时候，就需要在这些组件之间建立一些联系，这就是所谓的组件通信

- **`props`**（父子组件向子组件通信）

  父组件向子组件传递数据通过 props 来实现，子组件得到 props 后进行相应的处理

- **事件回调**（子组件向父组件通信）

  利用回调函数，实现子组件向父组件通信：父组件将一个函数作为 props 传递给子组件，子组件调用该回调函数，从而实现向父组件通信

  这种方式实际上还是父组件向子组件传递 props，只是传递的这个 props 是一个父组件作用域下的函数，该函数定义了如何修改父组件的数据，然后在子组件中调用这个函数，并且传递需要用到的参数

- **`Context`对象**

   `Context` 对象提供了一种方式无需层层为组件手动添加 `props`，就能在组件树间进行数据传递

  1. 创建 `Context` 对象

     ```javascript
     // MyContext.js
     // 该对象在顶层组件注入数据和子组件引入数据都会用到
     import React from 'react'
     const MyContext = React.createContext(defaultValue) // 在这里可以给初始值
     export default MyContext
     ```

  2. 创建 `Provider`

     ```javascript
     // MyProvider.js
     import MyContext from './MyContext'
     
     class MyProvider extends Component{
       state = {
         listData: [
           {
             id: 1,
             title: 'JavaScript'
           }
         ]
       }
     
       addList = (title) => { // 添加数据
         const list = this.state.listData
         list.push({
           id: Math.floor(Math.random() * 1000),
           title
         })
         this.setState({
           listData: list
         })
       }
       
       delItem = (id) => { // 删除数据
         const list = this.state.listData.filter(item => item.id != id)
         this.setState({
           listData: list
         })
       }
       
       render() {
         return (
           // 使用一个 Provider 来将当前的 state 传递给以下的组件树
           // 中间的组件再也不必指明，无论多深，任何组件都能读取这个值
           // 使用该组件作为最外层组件
           <MyContext.Provider
             // 通过 value 向所有的子组件传递数据以及修改数据的方法
             // 这里写两对大括号是因为外面那对是表示插值，里面那对表示对象
             value={{ 
               listData: this.state.listData,
               addList: this.addList,
               delItem: this.delItem
             }}
           >
             {// 将其他组件插入此处，即 React 版本的 slot 写法}
             {this.props.children}
           </MyContext.Provider>
         );
       }
     }
     
     ```

  3. `Provider`组件作为所有需要共享数据组件的顶层组件

     ```javascript
     // App.js
     class App extends Component{
     
       render() {
         return (
           <MyProvider>
             <List />  
           </MyProvider>
         )
       }
     }
     ```

  4. 直接在需要使用数据的子组件中通过 `Consumer` 引入，而不需要层层传递 `props`

     ```javascript
     // Add.js
     import MyContext from './MyContext'
                 
     class Add extends Component{
       state = {
         title: ''
       }
     
       inputChange = (e) => {
         this.setState({
           title: e.target.value
         })
       }
       
       render() {
         const { title } = this.state
         
         return (
           // 注意：使用 MyContext.Consumer 包裹函数才能拿到 context 对象
           <MyContext.Consumer>
             {context => ( // 或者直接解构 {listData, addList, delItem}
               <input type="text" value={title} onChange={this.inputChange} />
               <button onClick={() => context.addList(title)}>添加</button>
             )}
           </MyContext.Consumer>
         )
       }
         
     }
     ```

   `Context` 对象相当于一个可以提供全局数据的容器，只需要将通信的内容放在这个容器中，就可以在所有的子组件中共享“全局”数据

  - **`React.createContext`**

    该方法用于创建一个新的 `Context` 对象，当 `React` 渲染一个组件，且该组件注册了 `Context` 时，它将读取父组件中，距离该组件最近的 `Provider` 组件的 `Context` 值

  - **`Context.Provider`**

    如果需要使用 `Context` 对象，则需要通过 `Context.Provider` 组件作为最外层包装组件，并显示的通过 `value` 属性指定要暴露给子组件的数据，属于数据提供者

  - **`Context.Consumer`**

    `Consumer` 是一个监听 `Context` 变化的组件，它使得我们可以在一个函数组件中，监听 `Contxt` 的改变；属于数据使用者，用于获取 `Provider` 提供的数据

    `Consumer` 组件要求其子元素为一个函数，该函数的参数接收当前的 `Context` 的 value 值，并返回一个 `React` 节点；传递给该函数的参数 `value` 等于距离此 `Consumner` 最近的外层 `Provider` 组件的 `value` 值；如果没有找到外层的 `Provider`，则等于调用 `createContext()` 时传递的参数值

- `useContext`

  直接使用 `Context` 对象这种方式，子组件在每次引用数据时，都需要使用 `Consumer` 组件来包裹，是比较麻烦的，也不容易维护，现在结合 React 的 hooks 中的 `useContext` 来解决`Consumer` 难用的问题

  1. 创建 `Context` 对象

  2. 创建 `reducer` 来管理数据

     ```javascript
     // MyContext.js
     // 该对象在顶层组件注入数据和子组件引入数据都会用到
     import React from 'react';
     const MyContext = React.createContext(); // 在这里可以给初始值
     export default MyContext;
     
     // 了解 redux 的同学会很容易理解
     function reducer(state, action) {  
       const { type , title  } = action
       switch(type){
         case 'ADD':
           return {
             // 利用解构来实现数据合并以及添加数据
             ...state,
             listData: [
               ...state.listData,
               {
                 id: Math.floor(Math.random() * 1000),
                 title: title
               }
             ]
           }
         case 'DEL':
           const list = state.listData.filter(item => item.id != action.id)
           return {
             ...state,
             listData: list
           }
         default:
           return state  
       }
     }
     
     export default reducer
     ```

  3. 创建 `Provider`，用 `useReducer` 来替换 `useState` 来管理复杂的数据

     ```javascript
     import { useReducer } from 'react'
     import MyContext from './MyContext'
     import reducer from './reducer'
     
     const initState = []
     
     const MyProvider = () => {
       
       const [state, dispatch] = useReducer(reducer, initState)
       
       return (
         <MyContext.Provider
           { /* 只需要传递数据以及修改数据的方法 */ }
           value={{ 
             state, 
             dispatch
           }}
         >
           {this.props.children}
         </MyContext.Provider>
       );
     }
     ```

  4. `MyProvider` 组件作为所有需要共享数据组件的顶层组件

     ```javascript
     // App.js
     class App extends Component{
     
       render() {
         return (
           <MyProvider>
             <List />  
           </MyProvider>
         )
       }
     }
     ```

  5. 使用 `useContext` 获取 `Context` (主要是在这一步发生了改变)

     ```javascript
     // Add.js
     // 通过 React.createContext 创建出来的上下文，在子组件中可以通过 useContext 获取 Provider 提供的内容
     // 注意：这一步将 Add 组件改为函数组件
     import { useState, useContext } from 'react'
     import MyContext from './MyContext'
                 
     const Add = () => {
       const { title, setTitle } = useState('')
       // 变化在这里，从 context 中解构 dispatch
       const { dispatch } = useContext(MyContext)
     
       const inputChange = (e) => {
         setTitle(e.target.value)
       }
         
       return (
         <>
           <input type="text" value={title} onChange={inputChange} />
           <button onClick={() => dispatch({
             type: 'ADD',
             title: title
           })}>添加</button>
         </>
       )   
     };
     ```

- `Redux`



## 事件处理

#### React中事件处理与DOM事件处理的区别：

- React事件是驼峰式命名camelCase，DOM中是小写

- JSX中将函数传递给事件处理器，DOM中是字符串

- 阻止浏览器默认事件 不能通过```return false``` 而必须调用```preventDefault```

  ```react
  class Form extends React.Component {
      // 事件对象event不是原生事件对象，而是React自己封装的 
      handleSubmit = (event) => {
          // 阻止默认事件
          event.preventDefault();
      }
      
      // 只能返回一个顶级元素
      render() {
          <form onSubmit={this.handleSubmit}>
              用户名 <input type="text" />
              密码 <input type="text" />
              <input type="submit" />
          </form>
      }
  }
  ```

注意JSX中的```this```，JavaScript中的类方法不会进行默认绑定，不要忘记绑定事件处理函数（箭头函数或在构造函数中绑定）

#### 向事件处理函数传递参数

箭头函数或者```Function.prototype.bind```

用箭头函数需要显式传递```e```参数，用```bind```则自动将```e```放在后面传入



## 条件渲染

```if```

```&&```操作符： `true && expression` 返回 `expression` 

 ```condition ? true : false```

```null```不显示



## List & Keys

```react
let array = [1,1,1,1,1];
let lists = array.map((item, index) => <li key={index}>{item}</li>);
ReactDOM.render(<ul>{lists}</ul>, document.getElementByID('root'));
```

 ```{表达式}``` 不能放JS语句，因为它需要一个返回值

```<JSX XML>```

当创建元素列表时需要使用```key```这个特殊的字符串属性

```react
let users = [
    {id:1, name: ''},
    {id:2, name: ''}
]

function User(props) {
    // key只有在数组的上下文中才有意义
    return <li>{props.user.name}</li>;
}
function Users(props) {
    let users = props.users;
    return (
    	<ul>
            // 可以提取为变量
            {
                users.map(user=>(<User key={user.id} user={user} />)
            }
        </ul>
    )
}
ReactDOM.render(<Users users={users} />), document.getElementByID('root'));
```

```key```只有在数组的上下文中才有意义

```key```只用于给React提示，不会作为属性传入组件



## Forms(受控组件)

**```<input> 、<textarea> 、<select>```**的state在HTML中根据用户输入产生，而在React中，可变state必须通过```setState()```来更新

#### 受控组件（controlled component）

使输入框的值（```value```）由state（```this.state.value```）来决定，即将React state作为唯一的来源，当一个输入的元素的值是以这样的方式被React所控制，被称为**受控组件（controlled component）**

```react
class Form extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: ''
        }
    }
    
    handleSubmit = (event) => {
        // 阻止默认事件
        event.preventDefault();
    }
    
    handleChange = (event) => {
        let val = event.target.value;
        // 通过传入key处理多个输入
        this.setState({ [key]: val });
    }
    
    // 只能返回一个顶级元素
    render() {
        return (
        	<form onSubmit={this.handleSubmit}> 
                用户名 <input type="text" onChange={e => this.handleChange('username', e)} value={this.state.username} />
            	密码 <input type="text" onChange={e => this.handleChange('password', e)} value={this.state.password} />
            	<input type="submit" />
        	</form>
        )
    }
}
```

**```textarea```文本域**

```<textarea value={this.state.value} onChange={this.handleChange} />```

**```select```下拉列表**

```react
<select value={this.state.value} onChange={this.handleChange}>
    <option value='1'>1</option>
    <option value='2'>2</option>
    <option value='3'>3</option>
</select>
```

#### 非受控组件

```react
class Form extends React.Component {
    constructor(props) {
        super(props);
    }
    
    handleSubmit = (event) => {
        event.preventDefault();
        // 如果给一个input框赋了一个username的ref值，就可以通过this.refs.username获取到它对应的真实DOM元素
        let username = this.username.value; // this.refs.username.value
        let password = this.password.value;
    }
    
    render() {
        // ref里放的如果是一个函数，此函数会在当该虚拟DOM转成真实DOM并插入到页面后立刻调用，参数就是真实DOM
        // ref='username'字符串形式被废弃
        <form onSubmit={this.handleSubmit}>
            用户名 <input type="text" ref={input=>this.username=input} /> 
            密码 <input type="text" ref={input=>this.password=input} />
            <input type="submit" />
        </form>
    }
}
```

#### 处理多个输入

```react
class Form extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: ''
        }
    }
    
    handleSubmit = (event) => {
        event.preventDefault();
    }
    
    handleChange = (event) => {
        let name = event.target.name;
        let val = event.target.value;
        // 通过传入key处理多个输入
        this.setState({ [name]: val });
    }
    
    // 只能返回一个顶级元素
    render() {
        return (
        	<form onSubmit={this.handleSubmit}> 
                用户名 <input type="text" name="username" onChange={this.handleChange} value={this.state.username} />
            	密码 <input type="text" name="password" onChange={this.handleChange} value={this.state.password} />
            	<input type="submit" />
        	</form>
        )
    }
}
```



## 高级指引

#### 高阶组件

高阶组件（HOC）是 React 中用于复用组件逻辑的一种高级技巧。HOC 自身不是 React API 的一部分，它是一种基于 React 的组合特性而形成的设计模式。

具体而言，**高阶组件是参数为组件，返回值为新组件的函数。**

```javascript
const EnhancedComponent = higherOrderComponent(WrappedComponent);
```

组件是将 props 转换为 UI，而高阶组件是将组件转换为另一个组件。



## 核心概念

用公式概括`React`：

```javascript
const state = reconcile(update);
const UI = commit(state);
```

视图可以看作状态经过函数的映射

用户与界面的交互，可以看作这个公式的不断执行

1. 用户交互产生`update`（更新）
2. `update`经过`reconcile`步骤计算出当前应用的`state`
3. `commit`将`state`映射为视图变化（UI）



用计算机的抽象层级来类比：

```
高层：应用程序
中层：操作系统
底层：计算机组成架构
```

对应`React`：

```
高层：应用程序       ClassComponent生命周期
中层：操作系统       介入架构的API、Hooks
底层：计算机组成架构  React底层架构
```

生命周期函数属于抽象程度比较高的层次，这么设计也是为了让开发者更容易上手`React`



## Hook

#### 引入Hook动机

react-hooks是react16.8以后，react新增的钩子API，目的是增加代码的可复用性，逻辑性，弥补无状态组件没有生命周期，没有数据管理状态state的缺陷；react-hooks思想和初衷，也是把组件，颗粒化，单元化，形成独立的渲染环境，减少渲染次数，优化性能

[Hook简介](https://zh-hans.reactjs.org/docs/hooks-intro.html)

1. **Hook 使你在无需修改组件结构的情况下复用状态逻辑**

   React 没有提供将可复用性行为“附加”到组件的途径；如 [render props](https://zh-hans.reactjs.org/docs/render-props.html) 和 [高阶组件](https://zh-hans.reactjs.org/docs/higher-order-components.html)等方案需要重新组织组件结构，会很麻烦，使代码难以理解；在 `React DevTools` 中观察 React 应用会发现由 providers，consumers，高阶组件，render props 等其他抽象层组成的组件会形成“嵌套地狱”

   可以使用 Hook 从组件中提取状态逻辑，使得这些逻辑可以单独测试并复用：<u>Hook 使你在无需修改组件结构的情况下复用状态逻辑</u>，可以让代码的逻辑性更强，可以抽离公共的方法，公共组件，这使得在组件间或社区内共享 Hook 变得更便捷

2. **Hook 将组件中相互关联的部分拆分成更小的函数**（比如设置订阅或请求数据）

   组件常常会被状态逻辑和副作用充斥；每个生命周期常常包含一些不相关的逻辑：例如，组件常常在 `componentDidMount` 和 `componentDidUpdate` 中获取数据；但是，同一个 `componentDidMount` 中可能也包含很多其它的逻辑，如设置事件监听，而之后需在 `componentWillUnmount` 中清除；相互关联且需要对照修改的代码被进行了拆分，而完全不相关的代码却在同一个方法中组合在一起；如此很容易产生 bug，并且导致逻辑不一致

   在多数情况下，不可能将组件拆分为更小的粒度，因为状态逻辑无处不在；这也给测试带来了一定挑战；同时，这也是很多人将 React 与状态管理库结合使用的原因之一；但是，这往往会引入了很多抽象概念，需要你在不同的文件之间来回切换，使得复用变得更加困难

   为了解决这个问题，<u>Hook 将组件中相互关联的部分拆分成更小的函数（比如设置订阅或请求数据）</u>，而并非强制按照生命周期划分。还可以使用 reducer 来管理组件的内部状态，使其更加可预测

3. **Hook 使你在非 class 的情况下可以使用更多的 React 特性**

   class 是学习 React 的一大屏障，你必须去理解 JavaScript 中 `this` 的工作方式，这与其他语言存在巨大差异。还不能忘记绑定事件处理器。没有稳定的[语法提案](https://babeljs.io/docs/en/babel-plugin-transform-class-properties/)，这些代码非常冗余

   另外，使用 class 组件会无意中鼓励开发者使用一些让优化措施无效的方案；class 也给目前的工具带来了一些问题；例如，class 不能很好的压缩，并且会使热重载出现不稳定的情况

   为了解决这些问题，<u>Hook 使你在非 class 的情况下可以使用更多的 React 特性</u>； 从概念上讲，React 组件一直更像是函数，而 Hook 则拥抱了函数，同时也没有牺牲 React 的精神原则；Hook 提供了问题的解决方案，无需学习复杂的函数式或响应式编程技术



对照公式看几个常见`hook`的工作流程：

#### `useState`

*数据存储，派发更新*

```javascript
function App() {
  const [state, updateState] = useState(0);
  return <div onClick={() => updateState(state + 1)}></div>;
}
```

`useState`的参数可以是一个具体的值，也可以是一个函数用于判断复杂的逻辑，函数返回作为初始值

`useState`返回值数组包含：

- 保存的`state`

- 改变`state`的方法`updateState`

对照公式，`state`属于公式步骤2计算得出的：

2. `state = reconcile(update);`

此时视图还没有更新

用户触发`updateState`，对应公式步骤1:

1. 用户交互产生`update`

所以**调用`updateState`能开启底层架构的三步运行流程**

当`reconcile`计算出`state`后就会进入第三步：

3. `UI = commit(state);`

最终渲染视图

`useState` 和 `useReduce`作为能够触发组件重新渲染的hooks，`useState`派发更新函数的执行，就会让整个function组件从头到尾执行一次，所以需要配合`useMemo`，`usecallback`等`api`使用

#### `useEffect`

*组件更新副作用钩子*

```javascript
useEffect(doSomething, [xx, yy])
```

`useEffect`的回调函数`doSomething`**在第三步执行完成后异步调用**，所以在`doSomething`函数内部能获取到完成更新的视图

如果需要在组件初次渲染的时候请求数据，那么`useEffect`可以充当class组件中的 <u>`componentDidMount`</u>；但是如果不给`useEffect`执行加入限定条件，函数组件每一次更新都会触发effect ，那么也就说明每一次state更新，或是props的更新都会触发`useEffect`执行，此时的effect又充当了 <u>`componentDidUpdate`</u>和 <u>`componentwillreceiveprops`</u>

所以说合理的用`useEffect`就要<u>给effect加入限定执行的条件</u>，也就是`useEffect`的第二个参数，是一个数组，用来收集多个限制条件；这里的限定条件也可以说是上一次`useeffect`更新收集的某些记录数据变化的记忆，在新的一轮更新中`useeffect`会拿出之前的记忆值和当前值做对比，如果发生了变化就执行新的一轮`useEffect`的副作用函数；如果此时数组为空`[]`，证明函数只有在初始化的时候执行一次相当于`componentDidMount`

如果需要在组件销毁的阶段，做一些取消`dom`监听，清除定时器等操作，可以在`useEffect`函数第一个参数，结尾返回（`return`）一个函数，用于清除这些副作用，相当于 <u>`componentWillUnmount`</u>

#### `useLayoutEffect`

不同于`useEffect`在第三步执行完成后异步调用，`useLayoutEffect`**在第三步执行完`UI`操作后同步执行**

所以说`useLayoutEffect`代码可能会阻塞浏览器的绘制；如果在`useEffect` 重新请求数据，渲染视图过程中，肯定会造成画面闪动的效果；而如果用`useLayoutEffect`，回调函数的代码就会阻塞浏览器绘制，肯定会引起画面卡顿等效果；具体要用 `useLayoutEffect` 还是` useEffect`，要看实际项目的情况，大部分的情况 `useEffect` 都可以满足的

#### `useRef`

*获取元素 ，缓存数据*

`useState`与`useEffect`分别在三步流程的不同步骤被触发，他们的触发时机是确定的，而这三个步骤通过`useRef`来交流

`useState`作用于第一、二步，`useLayoutEffect`作用于第三步，`useEffect`作用于第三步完成后

使用`useRef`，就能达到在不同步骤间共享引用类型数据的目的

可以看到，`React`为底层架构三步工作流程的每一步提供了对应的`hook`，同时提供了串联这三步工作流程的`hook`

开发者只需要根据业务需要，通过基础`Hooks`组装出自定义`hook`，就能在底层架构运行流程的各个时期运行逻辑

#### `userContent`

*自由获取context*

见<数据流（组件通信）>

#### `useReducer`

*无状态组件中的redux*

`useReducer`的2个参数

- 一个函数，我们可以认为它就是一个`reducer` ，`reducer`的参数就是常规`reducer`里面的state和action，返回改变后的`state`
- `state`的初始值

`useReducer`返回值数组包含：

- 更新之后`state`的值

- 派发更新的`dispatch`函数：dispatch 的触发会触发组件的更新，这里能够促使组件重新渲染的一个是`useState`派发更新函数，另一个就 `useReducer`中的`dispatch`



## 参考

[函数式组件与类组件有何不同？](https://overreacted.io/zh-hans/how-are-function-components-different-from-classes/)