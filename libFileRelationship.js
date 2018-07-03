/* */(function(){

libFileRelationship = { };

Object.defineProperty(libFileRelationship,'create',{value:create,writable:false,enumerable:false,configurable:false});
function create(sName){
	Object.defineProperty(libFileRelationship,sName,{value:new Relation,writable:false,enumerable:true,configurable:false});
};
function Relation(){
	this.aAccounts = [];
};
Object.defineProperty(Relation.prototype,'relatedTo',{set:function(sName){this.aAccounts.push(sName);},enumerable:false,configurable:false});

/* 
//These lines below must be in main html and make start() in it ,too.
var FR = libFileRelationship;
onload=function(){
	let count = 0;
	let flag = true;
	let nameP,nameC,ii;
	var hoge = setInterval(function(){
		flag=true;
		for(nameP in FR){
			for(ii in FR[nameP].aAccounts){
				nameC = FR[nameP].aAccounts[ii];
				flag = flag && (nameC in window);
				if(!flag)break;
			}
			if(!flag)break;
		}
		if(flag){
			clearInterval(hoge);
			start();
		}else if(++count>30){
			clearInterval(hoge);
			console.error(nameP,"で使用する外部ファイル",nameC,"が読み込まれていません");
		}
	},100);
};

*/

/* */})();
