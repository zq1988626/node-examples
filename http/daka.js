const express = require('express')
const path = require('path')
const crypto = require('crypto');
const querystring = require('querystring');
const app = express()
const port = 3000
var md5 = crypto.createHash('md5');

app.get('/:user/:pwd/', function (req, res) {
    let {userId,passWord} = req.params;
    let postData = querystring.stringify({
        userId:userId,
        passWord: md5.update(passWord).digest('hex'),
        remamber: true
    });
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
    return new Promise((resolve,reject)=>{
        const req = http.request(url,options, function(res) {
            res.pipe
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

    res.send('user:' + user+";pwd:"+pwd)
})
app.get('/', (req, res) => res.send('Hello World!'))
app.use(express.static(path.resolve(__dirname,"./daka")));

app.listen(port, () => console.log(`Example app listening on port ${port}!`))