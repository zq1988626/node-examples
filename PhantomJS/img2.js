var protoext = require("protoext")
var page = require('webpage').create();
phantom.outputEncoding="gbk";//指定编码方式

var height = 600;

page.viewportSize = { width: 800, height: height+400 };
page.clipRect = { top: 200, left: 0, width: 800, height: height };

page.open("https://map.baidu.com/@12741337,3547297,13z", function(status) {
    if ( status === "success" ) {
        console.log(page.title);//输出网页标题
        page.render('./snapshot/map2.png');
    } else {
        console.log("网页加载失败");
    }
    phantom.exit(0);//退出系统
});