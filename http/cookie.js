class CookieItem {
    name=""
    value=""
    constructor(str){
        str.trim().split(";").forEach((item,i)=>{
            var arr = item.trim().split("=");
            if(i==0){
                this.name=arr[0].trim();
                this.value=arr[1].trim();
            }else{
                this[arr[0]]=arr[1];
            }
        });
    }
}

class Cookie {
    set(name,key){

    }
    setArray(arr){
        this._cookies = arr.map(function(str){
            return new CookieItem(str)
        });
    }
    getString(){
        return this._cookies.map(function(item){
            return item.name+"="+item.value
        }).join(";");
    }
    get(name){

    }
    constructor(){
        this._cookies = []
    }
}


module.exports = Cookie