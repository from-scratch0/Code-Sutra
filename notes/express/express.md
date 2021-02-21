## Express

Express是一个小巧且灵活的Node.js Web应用框架，可用于开发单页、多页和混合Web应用

[模拟Express](appExpress/express/index.js)

## 应用

```
npm i express -S
```

### 路由 get post all

[get、post、all](appExpress/get.js)

### 中间件

中间件就是处理HTTP请求的函数，用来完成各种特定的任务，如检查用户是否登录、检查用户是否有权限访问等

- 一个中间件处理完请求和响应可以把相应数据再传递给下一个中间件
- 回调函数的```next```参数表示接受其他中间件的调用，函数体中的```next()```表示将请求数据继续传递
- 可以根据路径来区分返回执行不同的中间件
- 中间件的路径只要前缀匹配就可以

[**使用方法**](appExpress/middle.js)

### 获取参数和查询字符串

- ```req.hostname``` 返回请求头里取的主机名
- ```req.path``` 返回请求的URL的路径名
- ```req.query``` 查询字符串

**实现**：系统内置中间件

[**使用方法**](appExpress/param.js)

### 获取params参数

```req.params```匹配到的所有路径参数组成的对象，用于批量处理路径参数

[**使用方法**](appExpress/params.js)



## 封装

### 构建基本服务器

- 创建```express```模块，导出一个函数，执行函数可以返回一个app对象
- app对象里定义get和listen方法
- get方法用于往路由里添加一条路由规则
- 初始化router对象保存所有的路由
- listen方法用于启动一个HTTP服务器并指定处理函数

### 封装Router

- app从字面量变为```Application```类
- 丰富HTTP请求方法
- 封装```Router```
- 路径一样的路由整合为一组，引入```Layer```的概念
- 增加路由控制，支持```next```方法，并增加错误捕获功能
- 执行```Router.handle```的时候传入```out```参数

### 实现中间件

### req.params

### 模板引擎

