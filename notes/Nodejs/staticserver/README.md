## 静态文件服务器
可以在任意目录下启动一个静态文件服务器，并且把当前目录 做为静态文件根目录
```
staticserver -d 指定静态文件根目录 -p 指定端口号 -o 指定监听的主机 
```
### 安装

```
npm init -y
npm i chalk -S // 设置链接字体颜色绿色
npm i debug -S
$ set DEBUG=static:* // 设置环境变量
// MAC Linux $export DEBUG=static:*
npm i superviser -g // 管家 接收JS变化 自动重启
```
### 配置

config.js
启动服务 ```start()```

### 静态文件服务器

建立public目录

#### 获取客户端想要的文件夹或文件路径

##### 获取到文件路径 直接显示文件内容

##### 获取到目录 拿到文件列表（渲染模板）

```
npm i --save handlebars
```

编写模板

src/template/list.html

编译模板

list()

```
handlebars.compile();
```

#### 配置可执行文件

package.json

```
"bin": {
    "staticserver": "bin/www"
  },

$ npm i yargs -S
```

bin/www.js

```
argv -> constructor(argv)
this.config

$ npm link
// 在npm目录（在环境变量中）下装入命令
$ path
// 在任何目录下都可以执行该命令

$ set DEBUG=static:* 

$ staticserver

```
