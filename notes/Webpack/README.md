
1. webpack4实战
2. webpack优化
3. webpack源码
4. 写一个自己的webpack

## Webpack
可以看做是模块打包机

分析项目结构，找到JavaScript模块以及其他浏览器不能直接运行的拓展语言（Scss、TypeScript等），并将其打包为合适的格式以供浏览器使用

构建就是把源代码转换成发布到线上的可执行JS、CSS、HTML代码，包括：

- 代码转换：TypeScript编译成JavaScript SCSS编译成CSS等
- 文件优化：压缩代码，压缩合并图片等
- 代码分割：提取多个页面的公共代码、提取首屏不需要执行部分的代码让其异步加载
- 模块合并：将模块化项目里的多个模块和文件合并成一个文件
- 自动刷新：监听本地源代码的变化，自动重新构建、刷新浏览器
- 代码校验：在代码提交到仓库前进行校验代码是否符合规范，以及单元测试是否通过
- 自动发布：更新代码后自动构建出线上发布代码并传输给发布系统

构建其实是工程化、自动化思想在前端开发中的体现，把一系列流程用代码去实现



## 核心概念

**工作流tapable**

Webpack启动后会从```Entry```里配置的```Module```开始递归解析Entry依赖的所有Module

每找到一个Module，就会根据配置的```Loader```去找出对应的转换规则，对Module进行转换后，再解析出当前Module依赖的Module

这些模块会以Entry为单位进行分组，一个Entry和其所有依赖的Module被分到一个组也就是一个```Chunk```，最后Webpack会把所有Chunk转换成文件```Output```

在整个流程中Webpack会在恰当的时机执行```Plugin```里定义的逻辑

- Entry：入口，Webpack执行构建的第一步从Entry开始
- Module：模块，Webpack中一切皆模块，一个模块对应一个文件
- Chunk：代码块，一个Chunk由多个模块组合而成，用于代码合并和分割
- Loader：模块转换器，把模块原内容按照需求转换成新内容
- Plugin：扩展插件，在构建流程中的特定时机注入扩展逻辑来改变构建结果或完成其他功能
- Output：输出结果



## 应用

### 配置

```
npm init 
npm i webpack webpack-cli -D
```

- dist 目标文件夹
- src 源文件夹

**配置webpack.config.js**

5个属性：```entry output module plugins devServer```

2种打包方式

```
npx webpack
//1、 npx 可以直接运行node_modules/.bin目录下面的命令 npx webpack
//2、通过配置package.json中的script "build":"webpack"
```



### 配置开发服务器

启动静态文件服务器预览项目

```
npm i webpack-dev-server -D
```

配置```package.json```、```webpack.config.js```



### 支持加载CSS（Loader）

配置```webpack.config.js```

```
npm i css-loader style-loader -D
```



### 自动产出HTML（plugin）

```
npm i html-webpack-plugin -D
```

- ```template``` 模板路径
- ```hash``` 引入产出资源的时候加上哈希避免缓存
- ```minify``` 对html文件进行压缩 ```removeAttributeQuotes``` 去掉属性的双引号
- ```chunks``` 在产出的HTML文件里引入哪些代码块

> 打包前清除dist下的旧文件

```
npm i clean-webpack-plugin -D
```

多入口 -> 多chunk -> 插入多页面



### 公共模块

```
npm i expose-loader -D
```



### 图片支持

1.  CSS背景图 
2.  JS脚本添加
3.  img标签引入

配置loader

```
npm i url-loader file-loader -D

// 返回一个打包后的地址
let src = require('./images/avatar.png');
```

解析img标签（将标签中地址换成打包后地址）

```
npm i html-withimg-loader -D
```



### less sass

```
npm i less less-loader node-sass sass-loader -D
```



### 分离css

有些时候我们希望把页面中的CSS文件单独拉出来保存加载

```javascript
// npm i extract-text-webpack-plugin@next
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
let cssExtract = new ExtractTextWebpackPlugin({
    filename: 'css/css.css',
    allChunks: true
});
let lessExtract = new ExtractTextWebpackPlugin('css/less.css');
let sassExtract = new ExtractTextWebpackPlugin('css/sass.css');
```



### 处理CSS3属性前缀

```
npm i postcss-loader autoprefixer -D
```





```
npm i babel-loader babel-core babel-preset-env babel-preset-stage-0 babel-preset-react -D
```



