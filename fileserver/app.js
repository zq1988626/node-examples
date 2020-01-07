// 文件：server.js
const http = require("http");
const path = require("path");
const url = require("url");
 
// 引入 mz 模块转换成 Promise 的 fs 模块
const fs = require("mz/fs");
 
// 请求处理函数
async function listener(req, res) {
  // 获取 range 请求头，格式为 Range:bytes=0-5
  let range = req.headers["range"];
 
  // 下载文件路径
  let p = path.resovle(__dirname, url.parse(url, true).pathname);
  console.log(p);
  // 存在 range 请求头将返回范围请求的数据
  if (range) {
    // 获取范围请求的开始和结束位置
    let [, start, end] = range.match(/(\d*)-(\d*)/);
 
    // 错误处理
    try {
      let statObj = await fs.stat(p);
    } catch (e) {
      res.end("Not Found");
    }
 
    // 文件总字节数
    let total = statObj.size;
 
    // 处理请求头中范围参数不传的问题
    start = start ? ParseInt(start) : 0;
    end = end ? ParseInt(end) : total - 1;
 
    // 响应客户端
    res.statusCode = 206;
    res.setHeader("Accept-Ranges", "bytes");
    res.setHeader("Content-Range", `bytes ${start}-${end}/${total}`);
    fs.createReadStream(p, { start, end }).pipe(res);
  } else {
    // 没有 range 请求头时将整个文件内容返回给客户端
    fs.createReadStream(p).pipe(res);
  }
}
 
// 创建服务器
const server = http.createServer(listener);
 
// 监听端口
server.listen(3000, () => {
  console.log("server start 3000");
});