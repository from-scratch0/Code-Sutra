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



## Components & Props

Components使UI分割成独立可复用的部分

概念上，组件就像JS的函数，接收props作为输入并返回描述屏幕显示的React元素

### Function & Class Components

#### 定义组件：

1. 使用JavaScript函数定义；

   ```react
   function Welcome(props) {
       return <h1>Hello, {props.name}</h1>;
   }
   ```

2. 使用ES6的class定义

   ```react
   class Welcome extends React.Component {
       render() {
           return <h1>Hello, {this.props.name}</h1>;
       }
   }
   ```

#### 将一个函数组件转换为类组件：

1. 创建一个ES6 class ```extends React.Component```
2. 添加```render()```方法，即返回React元素
3. 将函数组件主体移入```render()```方法
4. 用```this.props```取代```props```

元素可以采用用户**自定义组件**，该组件必须大写字母开头

当React遇见用户自定义的组件是，会将**JSX的属性**作为一个对象传递给组件，这个对象就是**props(properties)**

#### 学会抽象拆分组件**Extracting Components**

```react
import React from 'react';
import ReactDOM from 'react-dom';

// 对象不是合法的React子元素
function formatDate(date) {
    return date.toString();
}

function Avatar(props) {
  return (
    <img className="Avatar"
      src={props.user.avatarUrl}
      alt={props.user.name}
    />
  );
}

function UserInfo(props) {
    return(
    	<div className="UserInfo">
    		<Avatar user={props.author} />
    		<div className="UserInfo-name">
        		{props.user.name}
			</div>
    	</div>
    );
}
function Comment(props) {
  return (
    <div className="Comment">
      <UserInfo user={props.author} />
      
      <div className="Comment-text">
        {props.text}
      </div>
      <div className="Comment-date">
        {formatDate(props.date)}
      </div>
    </div>
  );
}

let data = {
    author: {
        name: 'fs',
        avatarURL: ''
    },
    text: '评论内容',
    date: new Date();
}

// 把date中的所有属性一一传递给Comment
ReactDOM.render(<Comment {...date} />, document.getElementByld('root'));
```

React组件必须表现得像一个纯函数，即不能修改输入（属性props），对于相同的输入总是返回相同的结果。对于会动态变化的UI，state可以用来改变React组件的输出。



## State & Lifecycle

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

#### 数据流



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

