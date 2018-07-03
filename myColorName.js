libFileRelationship.create('myColorName');

(function(){
	myColorName = { };

	var ColorRGBA = function(red,green,blue,alpha){
		this.r=red;
		this.g=green;
		this.b=blue;
		this.a=alpha;
	};
	Object.defineProperty(ColorRGBA.prototype,"rgba",{get:function(){return "rgba("+s8(this.r)+","+s8(this.g)+","+s8(this.b)+","+s8(this.a)+")";},enumerable:true,configurable:false});

	function s8(fN){
		return Math.floor(fN*255).toString();
	};

	Object.defineProperty(myColorName,'black'  ,{value:function(alpha){return new ColorRGBA(0,0,0,alpha);},writable:false,enumerable:true,configurable:false});
	Object.defineProperty(myColorName,'blue'   ,{value:function(alpha){return new ColorRGBA(0,0,1,alpha);},writable:false,enumerable:true,configurable:false});
	Object.defineProperty(myColorName,'red'    ,{value:function(alpha){return new ColorRGBA(1,0,0,alpha);},writable:false,enumerable:true,configurable:false});
	Object.defineProperty(myColorName,'magenta',{value:function(alpha){return new ColorRGBA(1,0,1,alpha);},writable:false,enumerable:true,configurable:false});
	Object.defineProperty(myColorName,'green'  ,{value:function(alpha){return new ColorRGBA(0,1,0,alpha);},writable:false,enumerable:true,configurable:false});
	Object.defineProperty(myColorName,'cyan'   ,{value:function(alpha){return new ColorRGBA(1,1,0,alpha);},writable:false,enumerable:true,configurable:false});
	Object.defineProperty(myColorName,'yellow' ,{value:function(alpha){return new ColorRGBA(0,1,1,alpha);},writable:false,enumerable:true,configurable:false});
	Object.defineProperty(myColorName,'white'  ,{value:function(alpha){return new ColorRGBA(1,1,1,alpha);},writable:false,enumerable:true,configurable:false});
	Object.defineProperty(myColorName,'purple'  ,{value:function(alpha){return new ColorRGBA(Math.floor(128/256*100)/100,0,Math.floor(128/256*100)/100,alpha);},writable:false,enumerable:true,configurable:false});

})();
