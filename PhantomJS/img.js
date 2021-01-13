var path = require('path')
var childProcess = require('child_process')
var phantomjs = require('phantomjs')
var binPath = phantomjs.path
 
var childArgs = [
  path.join(__dirname, 'phantomjs-script.js'),
  'some other argument (passed to phantomjs script)'
]
 
childProcess.execFile(binPath, childArgs, function(err, stdout, stderr) {
  // handle results
});
var page = require('webpage').create();
phantom.outputEncoding="gbk";//指定编码方式
page.open("http://news.163.com/", function(status) {
if ( status === "success" ) {
console.log(page.title);//输出网页标题
} else {
console.log("网页加载失败");
}
phantom.exit(0);//退出系统
});