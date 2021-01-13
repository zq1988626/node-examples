const {form,get} = require("./tool");
const Cookies = require("./cookie");
const fs = require("fs");
const request = require("request");
const PNG = require("pngjs").PNG;
const getPixels = require("get-pixels");
const Jimp = require('jimp');

let cookie = new Cookies();
const postData = {
    userId: "zq",
    passWord: "e10adc3949ba59abbe56e057f20f883e",
    remamber: "true"
};
let url = "http://192.168.1.11:9080//com.kysoft.service/html/sysmanage/userLogin.action";
let codeurl = "http://192.168.1.11:9080/com.kysoft.service/html/sysmanage/getCode.action?width=200&height=50&codeCount=4&fontHeight=40";
console.time('登录')
console.log("开始登录");
form(url,postData,cookie)
.then(function(data){
    console.log("登录成功");
    console.timeEnd('登录')
    console.log(JSON.parse(data));
    console.log("1\n2");
})
.then(data=>get(codeurl,null,cookie))
.then(data=>{
    //var b = Buffer(data);
    //var readStream = fs.createReadStream(data,'binary');
    const imgPath = __dirname+"\\test.jpg";
    const imgPath2 = __dirname+"\\test2.";
    console.log(imgPath);
    fs.writeFile(imgPath, data,'binary', function (error) {
        if (error) {
            console.log('写入失败')
        } else {
            console.log('写入成功了')
            Promise.all([
                Jimp.read(200, 50, 0xffffffff),
                Jimp.loadFont(Jimp.FONT_SANS_32_BLACK),
                Jimp.read(imgPath)
            ]).then(ds=>{
                let img = ds[2];
                img.print(ds[1], 10, 10, 'Hello World!');
                const FILENAME = imgPath2 + img.getExtension();
                //img.resize(50, Jimp.AUTO);
                return img.write(FILENAME, (err) => {
                    if (err) {
                        return console.error(err);
                    };
                    console.log('水印成功：', FILENAME);
                })
            })
            return;
            getPixels(imgPath, function(err, pixels) {
                if(err) {
                  console.log("Bad image path")
                  return
                }

                const w = pixels.shape[0];
                const h = pixels.shape[1];
                const l = pixels.shape[2];
                var rev = [];
                for(var wi=0;wi<w;wi++){
                    for(var hi=0;hi<h;hi++){
                        let r = pixels.data[hi*w+wi]
                        let g = pixels.data[hi*w+wi+1]
                        let b = pixels.data[hi*w+wi+2]
                        rev[hi] = rev[hi] || [];
                        rev[hi][wi]=(r+g+b)<100?"#":" ";
                    }
                }
                console.log(rev.map(item=>{
                    return "|"+item.filter((itemi,i)=>i%2==0).join("")+"|"
                }).join("\n"));
                //console.log(pixels)
            })

            return;
            fs.createReadStream(imgPath)
            .pipe(
                new PNG({
                    filterType: 4,
                })
            )
            .on("parsed", function () {
                for (var y = 0; y < this.height; y++) {
                    for (var x = 0; x < this.width; x++) {
                        var idx = (this.width * y + x) << 2;
                
                        // invert color
                        this.data[idx] = 255 - this.data[idx];
                        this.data[idx + 1] = 255 - this.data[idx + 1];
                        this.data[idx + 2] = 255 - this.data[idx + 2];
                
                        // and reduce opacity
                        this.data[idx + 3] = this.data[idx + 3] >> 1;
                    }
                }
            
                this.pack().pipe(fs.createWriteStream("out.png"));
            });
        }
    })
    //var png = new PNG({data:data})
    console.log(data);
})