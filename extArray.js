extArray=null;//This is dummy.Because there is not 'extArray' object.
libFileRelationship.create('extArray');

//extend Array class

/* */(function(){

	//////////////////////// vector ///////////////////////////////////////////////////

	Object.defineProperty(Array.prototype,'x',{get:function(){return this[0];},set:function(n){this[0]=n},enumerable:false,configurable:false});
	Object.defineProperty(Array.prototype,'y',{get:function(){return this[1];},set:function(n){this[1]=n},enumerable:false,configurable:false});
	Object.defineProperty(Array.prototype,'z',{get:function(){return this[2];},set:function(n){this[2]=n},enumerable:false,configurable:false});
//	Object.defineProperty(Array.prototype,'arr3D',{get:function(){return [this[0],this[1],this[2]];},enumerable:false,configurable:false});
	Object.defineProperty(Array.prototype,'length3D',{get:function(){return Math.sqrt(this[0]*this[0]+this[1]*this[1]+this[2]*this[2]);},enumerable:false,configurable:false});
	Object.defineProperty(Array.prototype,'normalize3D',{value:normalize3D,writable:false,enumerable:false,configurable:false});
	function normalize3D(){
		var len = 1. / this.length3D;
		this[0] = this[0] * len;
		this[1] = this[1] * len;
		this[2] = this[2] * len;
	};
	Object.defineProperty(Array.prototype,'opposite3D',{value:opposite3D,writable:false,enumerable:false,configurable:false});
	function opposite3D(){
		this[0] = -this[0];
		this[1] = -this[1];
		this[2] = -this[2];
	};
	Object.defineProperty(Array.prototype,'mag3D',{value:mag3D,writable:false,enumerable:false,configurable:false});
	function mag3D(nn){
		this[0] = this[0] * nn;
		this[1] = this[1] * nn;
		this[2] = this[2] * nn;
	};

	Object.defineProperty(Array.prototype,'multi4441',{value:multi4441,writable:false,enumerable:false,configurable:false});
	function multi4441(mat){
		const x = mat[0] * this[0] + mat[1] * this[1] + mat[2] * this[2] + mat[3];
		const y = mat[4] * this[0] + mat[5] * this[1] + mat[6] * this[2] + mat[7];
		const z = mat[8] * this[0] + mat[9] * this[1] + mat[10]* this[2] + mat[11];
		const w = mat[12]* this[0] + mat[13]* this[1] + mat[14]* this[2] + mat[15];
		this[0]=x;this[1]=y;this[2]=z;this[3]=w;
	};

	Object.defineProperty(Array.prototype,'multi1444',{value:multi1444,writable:false,enumerable:false,configurable:false});
	function multi1444(mat){
		const x = mat[0] * this[0] + mat[4] * this[1] + mat[8] * this[2] + mat[12];
		const y = mat[1] * this[0] + mat[5] * this[1] + mat[9] * this[2] + mat[13];
		const z = mat[2] * this[0] + mat[6] * this[1] + mat[10]* this[2] + mat[14];
		const w = mat[3] * this[0] + mat[7] * this[1] + mat[11]* this[2] + mat[15];
		this[0]=x;this[1]=y;this[2]=z;this[3]=w;
	};
	

/* */})();
