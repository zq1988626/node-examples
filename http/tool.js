const http = require("http");
var qs=require('querystring');

const submitform = function(url,data,cookie){
    let postData = qs.stringify(data);
    const options = {
        method: 'POST',
        headers:{
            "Accept":"*/*",
            "Accept-Encoding":"gzip, deflate",
            "Accept-Language":"zh-CN,zh;q=0.8",
            "Connection":"keep-alive",
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "Content-Length":Buffer.byteLength(postData),
        }
    };
    if(cookie){
        options.headers["Cookie",cookie.getString()]
    }
    return new Promise((resolve,reject)=>{
        const req = http.request(url,options, function(res) {
            res.setEncoding('utf8');
            if(res.headers&&res.headers["set-cookie"]&&cookie){
                cookie.setArray(res.headers["set-cookie"]);
            }

            var data = "";
            res.on('data', function (chunk) {
                data+=chunk
            });
            res.on('end', function () {
                //console.log('Response: ' + data);
                resolve(data);
            });
        });
        req.on('error', (e) => {
            reject(e);
            console.error(`请求遇到问题: ${e.message}`);
        });
        req.write(postData);
        req.end();
    })
}

const get = function(url,data,cookie){
    return new Promise((resolve,reject)=>{
        var options = {headers:{}};
        if(cookie){
            options.headers["Cookie"]=cookie.getString();
        }
        http.get(url,options, function(res) {
            //res.setEncoding('utf8');
            res.setEncoding('binary');
            if(res.headers&&res.headers["set-cookie"]&&cookie){
                cookie.setArray(res.headers["set-cookie"]);
            }
            var data = "";
            res.on('data', function (chunk) {
                data+=chunk
            });
            res.on('end', function () {
                //console.log('Response: ' + data);
                resolve(data);
            });
        }).on('error', (e) => {
            reject(e);
            console.error(`请求遇到问题: ${e.message}`);
        });
    })
    
}

module.exports = {
    form:submitform,
    get:get
}