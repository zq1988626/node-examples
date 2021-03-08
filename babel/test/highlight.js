const highlight = require("@babel/highlight").default;

console.log(highlight(`class hello{
    constructor(){
        // toDo
    }
}`, options = {}))