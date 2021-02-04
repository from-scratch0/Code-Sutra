[TOC]

## 单位

一个二进制位bit 

8位 = 1字节（byte）**字节是网络传输信息的单位**

1024字节 = 1K

1024K = 1M

1024M = 1G

1024G = 1T



## 进制

```javascript
let a = 0b10100; // 二进制
let b = 0o24; // 八进制
let c = 20; // 十进制
let d = 0x14; // 十六进制

// 把任意进制转换成十进制
console.log(parseInt("0x10", 16));
// 把十进制转成任意进制
console.log(c.toString(2));
```



## 编码

### ASCII

128个符号（包括32个不能打印出来的控制符号）只占用一个字节后面7位，最前面的一位统一为0

> American Standard Code for Information Interchange：美国信息互换标准代码

### GB2312

中国为表示汉字，把127号之后的符号取消了，规定

- 小于127的字符意义与原来相同，两个大于127的字符连在一起表示一个汉字

- 前面一个字节（高字节）从```0xA1```到```0xF7```，后面一个字节（低字节）从```0xA1```到```0xFE```

- 从而组合成（247-161）*（254-161）=7998个简体汉字

- 把数字符号、日文假名和ASCII里的数字、标点和字母都重新编成两个字节的编码，即全角字符

  127以下那些就叫半角字符

> GB2312是对ASCII的中文扩展

**GBK**  

**GB18030 / DBCS**

### Unicode

ISO国际组织废除了所有的地区性编码方案，整合了一个包括地球上所有文化、字母和字符的编码

规定必须用两个字节统一表示所有字符，对于ASCII中的半角字符，Unicode保持其原编码不变，只是将长度由8位扩展为16位

### UTF-8

Unicode的实现方式之一，在互联网上使用最广

> Universal Character Set (UCS) Transfer Formal : UTF编码 统一字符集传输格式

每次以8个位为单位传输数据

UTF-8最大的特点就是它是一种变长的编码方式，Unicode中一个中文字符占2个字节，而UTF-8中一个中文字符占3 个字节

| Unicode符号范围（十六进制） | UTF-8编码方式（二进制）             |
| --------------------------- | ----------------------------------- |
| 0000 0000 ~ 0000 007F       | 0XXXXXXX                            |
| 0000 0080 ~ 0000 07FF       | 110XXXXX 10XXXXXX                   |
| 0000 0800 ~ 0000 FFFF       | 1110XXXX 10XXXXXX 10XXXXXX          |
| 0001 0000 ~ 0010 FFFF       | 11110XXX 10XXXXXX 10XXXXXX 10XXXXXX |

```javascript
// 把一个unicode码转成utf8编码
// （以第三行范围为例）万 4E07
function transfer(number) {
    if(number < 0x7F) {
        return '0' + (number.toString(2).padStart(7, 0));
    } else if(number < 0x7FF) {
        pass;
    }
    let arr = ["1110", "10", "10"];
    let str = number.toString(2); // 100111000000111
    arr[2] += str.substring(str.length - 6);
    arr[1] += str.substring(str.length - 12, str.length - 6);
    arr[0] += str.substring(0, str.length - 12).padStart(4, '0');
    return arr.map(item => parseInt(item, 2).toString(16));
}
let r = transfer(0x4E07); // 1110xxxx 10xxxxxx 10xxxxxx
console.log(r);
```



## 文本编码

使用Nodejs编写 前端工具时，操作的更多是文本文件，也就涉及到了文件编码的问题

UTF8文件可能带有BOM，在读取不同编码的文本文件时，需要将文件内容转换为JS使用的UTF8编码字符串后才能正常处理

### BOM的移除

BOM用于标记一个文本文件使用Unicode编码，位于文本文件头部，我们可以根据文本文件头几个字节来判断文件是否包含BOM，以及使用哪种Unicode编码，但是BOM本身不属于文件内容的一部分，若读取文本文件时不去掉BOM，在某些场景下就会出问题（如将几个JS文件合并为一个文件后，若文件中间含有BOM字符，就会导致浏览器JS语法错误），因此使用Nodejs读取文本文件时，一般需要去掉BOM

```javascript
let fs = require('fs');
fs.readFile('', function(err, data){
    // 移除BOM
    if(data[0] == 0xef && data[1] == 0xbb && data[2] == 0xbf) {
        data = data.silce(3);
    }
    console.log(data);
});
```

### GBK转UTF8

Nodejs支持在读取文本文件或Buffer转换为字符串时指定文本编码，但GBK编码不在Nodejs自身支持范围内，因此一般借助**iconv-lite**这个三方包来转换编码

```javascript
// npm 下载
let iconv = require('iconv-lite');
fs.readFile('', function(err, data){
    // 实现转码操作 把一个GBK编码的Buffer转变成UTF8字符串
    let str = iconv.decode(data, 'gbk');
    console.log(str);
});
```

