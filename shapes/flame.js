flameJS=null;//dummy
libFileRelationship.create('myShape_flameJS');
libFileRelationship.myShape_flameJS.relatedTo='myShape';
libFileRelationship.myShape_flameJS.relatedTo='extMath';
//libFileRelationship.myShape_flameJS.relatedTo='myColorName';
//libFileRelationship.myShape_flameJS.relatedTo='myVec3';

/* */(function(){

	Object.defineProperty(myShape,'flame',{value:flame,writable:false,enumerable:true,configurable:false});
	function flame(gl,aa,bb){//aa...long axis bb...short axis of ellipse aa is along with y axis bb is along with x axis of clipping space



		const funcGD = Math.createGaussianDistribution(90,30);
		const maxProb = funcGD(90);

		const vertex = [];
		const normal = [];
		const color = [];
		const textureCoordinate = [];
		const index = [];
const number=3000;

//		let counter = 0;
		let nPoints = 0;
		while(nPoints<number){
//			counter++;
			let angleCandidate=Math.random()*180;//generate 0~180
			let probability = funcGD(angleCandidate);
			if(probability > Math.random()*maxProb){
				nPoints++;
				let theta = angleCandidate*0.017453293;
				let alpha = 6.28318531 * Math.random();
				let cos = Math.cos(theta);
				let sin = Math.sin(theta);
				let rr = 2*aa*aa*bb*sin/(bb*bb*cos*cos*+aa*aa*sin*sin)*0.01;
				let xx = rr * cos * Math.cos(alpha);
				let yy = rr * sin;
				let zz = rr * cos * Math.sin(alpha);
				vertex.push(xx,yy,zz);
			}
		};
//console.log(counter);
		let ii=0;
		while(ii++<number)normal.push(1,1,1);
		ii=0;
		while(ii++<number)color.push(1,1,1,1);
		ii=0;
		while(ii++<number)textureCoordinate.push(1,1);
		ii=0;
		while(ii++<number)index.push(ii);

		return {
			n:number,//全ての三角形の頂点の総数
			pos:vertex,
			nor:normal,
			col:color,
			tex:textureCoordinate,
			ind:index,
			draw:function(){
				gl.drawElements(gl.POINTS,number,gl.UNSIGNED_BYTE,0);//to do
			}

		};
	};


/* */})();