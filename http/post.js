// We need this to build our post string
var querystring = require('querystring');
var http = require('http');
post({
    host:'192.168.1.25',
    port:'8080',
    method: 'POST',
    Referer: "http://192.168.1.25:8080/com.kysoft.service/index/login.html"
},{
    userId: "zjf1",
    passWord: "e10adc3949ba59abbe56e057f20f883e",
    remamber: false
});
var post = function(option,data){
    // Build the post string from an object
    var post_data = querystring.stringify(data);

    // An object of options to indicate where to post to
    var post_options = Object.assign({},option,{
        host: '192.168.1.25',
        port: '8080',
        path: '/com.kysoft.service/html/sysmanage/userLogin.action',
        method: 'GET',
        headers: {
            "Content-Type": 'application/x-www-form-urlencoded',
            "Content-Length": Buffer.byteLength(post_data),
            "Accept": "*/*",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
            "Connection": "keep-alive",
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "Cookie": "JSESSIONID=E604D7192CADF0D0BBEF73AF34A03474; locale=zh-cn; __utma=96992031.408972567.1563330800.1563330800.1563330800.1; __utmz=96992031.1563330800.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); __atuvc=1%7C29; _ga=GA1.1.408972567.1563330800",
            //"Host": "192.168.1.25:8080",
            //"Origin": "http://192.168.1.25:8080",
            //"Referer": "http://192.168.1.25:8080/com.kysoft.service/index/login.html",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-origin",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36",
            "X-Requested-With": "XMLHttpRequest"
        }
    };

    // Set up the request
    var post_req = http.request(post_options, function(res) {
        res.setEncoding('utf8');
        var data = "";
        res.on('data', function (chunk) {
            data+=chunk
        });
        res.on('end', function () {
            console.log('Response: ' + data);
        });
    });

    // post the data
    post_req.write(post_data);
    post_req.end();

}
