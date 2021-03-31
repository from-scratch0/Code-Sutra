语义化标记是优秀HTML文档的基础

## 元信息类标签

- `<head>`

- `<title>`

- `<meta>`

  <meta name="viewport" content="" />    
  width viewport的宽度[device-width | pixel_value]width如果直接设置pixel_value数值，大部分的安卓手机不支持，但是ios支持；    
  height – viewport 的高度 （范围从 223 到 10,000 ）    
  user-scalable [yes | no]是否允许缩放    
  initial-scale [数值] 初始化比例（范围从 > 0 到 10）   
  minimum-scale [数值] 允许缩放的最小比例    
  maximum-scale [数值] 允许缩放的最大比例    
  target-densitydpi 值有以下（一般推荐设置中等响度密度或者低像素密度，后者设置具体的值dpi_value，另外webkit内核已不准备再支持此属性）         
  -- dpi_value 一般是70-400//没英寸像素点的个数         
  -- device-dpi设备默认像素密度         
  -- high-dpi 高像素密度         
  -- medium-dpi 中等像素密度         
  -- low-dpi 低像素密度

  > 怎样处理 移动端 1px 被 渲染成 2px 问题?
  >
  > 局部处理：
  >
  > - `mate` 标签中的 `viewport` 属性 ， `initial-scale` 设置为 1
  > - `rem` 按照设计稿标准走，外加利用`transfrome 的 scale(0.5)` 缩小一倍即可；
  >
  > 全局处理：
  >
  > - `mate` 标签中的 `viewport` 属性 ， `initial-scale` 设置为 0.5
  > - `rem` 按照设计稿标准走即可

- `<base>`



### `src` 与 `href` 的区别

- `src` 用于替换当前元素，`href`用于在当前文档和引用资源之间确立联系。
- `src` 是 `source` 的缩写，指向外部资源的位置，指向的内容将会嵌入到文档中当前标签所在位置；在请求`src` 资源时会将其指向的资源下载并应用到文档内，例如 `js` 脚本，`img` 图片和 `frame` 等元素

> 当浏览器解析到该元素时，会暂停其他资源的下载和处理，直到将该资源加载、编译、执行完毕，图片和框架等元素也如此，类似于将所指向资源嵌入当前标签内。这也是为什么将 js 脚本放在底部而不是头部

\- `href 是 Hypertext Reference` 的缩写，指向网络资源所在位置，建立和当前元素（锚点）或当前文档（链接）之间的链接，如果我们在文档中添加 - `link href="common.css" rel="stylesheet"` 那么浏览器会识别该文档为 `css` 文件，就会并行下载资源并且不会停止对当前文档的处理。这也是为什么建议使用 `link` 方式来加载 `css` ，而不是使用 `@import`方式