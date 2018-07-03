libFileRelationship.create('myVec3');

// GIVE FUNCTIONS TO CALCULATE 3D VECTOR

// how to use
//
// var vA = [ 5,-3, 2];
// var vB = [ 0, 6,-3];
//
// var length = myVec3.length;
// var dot = myVec3.dot;
// var cross = myVec3.cross;
//
// var len = length(vA);//->6.164...
// var strong = dot(vA,vB);//->-24
// var vAxis = corss(vA,vB);->[-3,15,30]----right hand coordinate as same as clipping space used in webgl



/* */(function(){


myVec3 = { };

Object.defineProperty(myVec3,'length',{value:length,enumerable:true,configurable:false});
	/**
	 * @param {a} Array
	*/
	function length(a){
		return Math.sqrt(a[0]*a[0]+a[1]*a[1]+a[2]*a[2]);
	};
Object.defineProperty(myVec3,'normalize',{value:normalize,enumerable:true,configurable:false});
	/**
	 * @param {a} Array
	*/
	function normalize(a){
		var len = 1/length(a);
		a[0]=a[0]*len;
		a[1]=a[1]*len;
		a[2]=a[2]*len;
		return a;
	};
Object.defineProperty(myVec3,'dot',{value:dot,enumerable:true,configurable:false});
	/**
	 * @param {a,b} Array
	*/
	function dot(a,b){
		return a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
	};
Object.defineProperty(myVec3,'cross',{value:cross,enumerable:true,configurable:false});
	/**
	 * @param {a,b} Array
	*/
	function cross(a,b){
		var c = [];
		c.push(a[1]*b[2]-a[2]*b[1]);
		c.push(a[2]*b[0]-a[0]*b[2]);
		c.push(a[0]*b[1]-a[1]*b[0]);
		return c;
	};
Object.defineProperty(myVec3,'plus',{value:plus,enumerable:true,configurable:false});
	/**
	 * @param {a,b} Array
	*/
	function plus(a,b){
		var c = [];
		c.push(a[0]+b[0]);
		c.push(a[1]+b[1]);
		c.push(a[2]+b[2]);
		return c;
	};

Object.defineProperty(myVec3,'minus',{value:minus,enumerable:true,configurable:false});
	/**
	 * @param {a,b} Array
	*/
	function minus(a,b){
		var c = [];
		c.push(a[0]-b[0]);
		c.push(a[1]-b[1]);
		c.push(a[2]-b[2]);
		return c;
	};


//Object.defineProperty(myVec3,'normalize',{
//});

/* */})();