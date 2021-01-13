var protoext = require("protoext");
protoext.appendEXToFunction();
protoext.appendGCToObject();

var Animal = function(name){
    this.name = name;
}
Animal.name = function(msg){
    console.log(msg);
}