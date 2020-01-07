const open = require('open');
const path = require('path');
const webcopy = require("webcopy");
webcopy.createService('https://www.meizhewujiang.com/',{
    port:8888,
    path:path.join(__dirname,"cache/meizhewujiang")
},function(url){
    open("http://"+url,["chrome"])
})