let data = require("./data");

function cdxy4 (d){
    return d.length < 4;
}

function jxh (d){
    return d[0] === d[2] || d[0]===d[1] || d[1]===d[2] || (d[0]==d[1] && d[2]==d[3])
}

console.log(data.filter(d=>{
    return cdxy4(d) && jxh(d)
}).join())