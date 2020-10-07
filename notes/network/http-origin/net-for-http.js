// net-for-http.js
const net = require("net");
const fs = require("fs");
const path = require("path");

const desPort = 80;
// const desHost = 'localhost';
const desHost = "121.248.63.178";

let allBuffer = null;

const client = net.createConnection(desPort, desHost, function () {
  console.log("connected to server!");
  client.write(
    "GET / HTTP/1.1\r\nHost:www.lib.seu.edu.cn\r\nUser-Agent:Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36\r\nAccept:text/html\r\nAccept-Language: zh-CN,zh;q=0.9\r\n\r\n"
  );
});

client.on("data", function (data) {
  console.log("------receive data------");
  if (!allBuffer) {
    allBuffer = data;
  } else {
    allBuffer = Buffer.concat([allBuffer, data]);
  }
});

client.on("error", function (err) {
  console.log(err);
});

client.on("end", function () {
  console.log("connection end");
  const htmlContent = allBuffer.toString();
  // 解释页面的操作
  const ws = fs.createWriteStream(path.join(__dirname, "myBlog.html"));
  ws.write(htmlContent);
});
