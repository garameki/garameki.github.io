myShape_linesJS=null;//dummy
libFileRelationship.create('myShape_linesJS');
libFileRelationship.myShape_linesJS.relatedTo='myShape';
libFileRelationship.myShape_linesJS.relatedTo='extMath';
//libFileRelationship.myShape_linesJS.relatedTo='myColorName';
//libFileRelationship.myShape_linesJS.relatedTo='myVec3';

/* */(function(){

	Object.defineProperty(myShape,'lines',{value:lines,writable:false,enumerable:true,configurable:false});
	function lines(gl,arr) {//arr...Array which length is 3
		let position = [];
		let normal = [];
		let color = [];
		let textureCoordinate = [];
		let indices = [];
		let obj = {
			name:"lines",
			n:0,
			pos:position,
			nor:normal,
			col:color,
			tex:textureCoordinate,
			ind:indices
		}
		obj = addPoint(arr,obj);
		obj.draw=function() {

			gl.drawArrays(gl.LINE_STRIP, 1, obj.n-2);
//			gl.drawElements(gl.LINE_STRIP,obj.n,gl.UNSIGNED_SHORT,0);//to do
		},
		obj.addPoint=function(arr) {
			obj = addPoint(arr,obj);
			return obj;
		};
		return obj;
	};



	/** inner function **/
	function addPoint(arr,obj) {
		if(arr.length<3)console.error("myShape_linesJS: short length of array in addPoint()");
		if(obj.n>10000){
			obj.pos.splice(0,3);
			obj.pos = obj.pos.concat(arr);
		}else{
			obj.n++;
			obj.pos = obj.pos.concat(arr);
			obj.nor.push(1,1,1);
			obj.col.push(1,1,1,1);
			obj.tex.push(0,0);
			obj.ind.push(obj.n);
		}
		return obj;
	};
	
/* */})();