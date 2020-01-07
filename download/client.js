// 文件：client.js
const http = require("http");
const fs = require("fs");
const path = require("path");

// 请求配置
let config = {
    host: "https://",
    port: 3000,
    path: "/download.txt"
};

let start = 0; // 请求初始值
let step = 5; // 每次请求字符个数
let pause = false; // 暂停状态
let total; // 文件总长度

// 创建可写流
let ws = fs.createWriteStream(path.resolve(__dirname, config.path.slice(1)));

// 下载函数
function download() {
    // 配置，每次范围请求 step 个字节
    config.headers = {
        "Range": `bytes=${start}-${start + step - 1}`
    };

    // 维护下次 start 的值
    start += step;

    // 发送请求
    http.request(config, res => {
        // 获取文件总长度
        if (typeof total !== "number") {
            total = res.headers["content-ranges"].match(/\/(\d*)/)[1];

        }

        // 读取返回数据
        let buffers = [];
        res.on("data", data => buffers.push(data));
        res.on("end", () => {
            // 合并数据并写入文件
            let buf = Buffer.concat(buffers);
            ws.write(buf);

            // 递归进行下一次请求
            if (!pause && start < total) {
                download();
            }
        });
    }).end();
}

// 监控输入
process.stdin.on("data", data => {
    // 获取指令
    let ins = data.toString().match(/(\w*)\/r/)[1];
    switch (ins) {
        case "s":
        case "r":
            pause = false;
            download();
            break;
        case "p":
            pause = true;
            break;
    }
});