libFileRelationship.create('myShape');
libFileRelationship.myShape.relatedTo='myColorName';
libFileRelationship.myShape.relatedTo='myVec3';

(function(){

	


	myShape = { };
	Object.defineProperty(myShape,'point'		,{value:point,writable:false,enumerable:true,configurable:false});
	Object.defineProperty(myShape,'line'		,{value:line,writable:false,enumerable:true,configurable:false});
	Object.defineProperty(myShape,'triangle'	,{value:triangle,writable:false,enumerable:true,configurable:false});

	Object.defineProperty(myShape,'cylindricalCalumn'	,{value:cylindricalCalumn,writable:false,enumerable:true,configurable:false});
	Object.defineProperty(myShape,'rectangle'	,{value:rectangle,writable:false,enumerable:true,configurable:false});
	Object.defineProperty(myShape,'axisX'		,{value:axisX,writable:false,enumerable:true,configurable:false});
	Object.defineProperty(myShape,'axisY'		,{value:new axisY,writable:false,enumerable:true,configurable:false});
	Object.defineProperty(myShape,'axisZ'		,{value:new axisZ,writable:false,enumerable:true,configurable:false});
	Object.defineProperty(myShape,'tetra'		,{value:tetrahedron,writable:false,enumerable:true,configurable:false});
	Object.defineProperty(myShape,'hexa'		,{value:hexahedron,writable:false,enumerable:true,configurable:false});
	Object.defineProperty(myShape,'sphere'	,{value:sphere2,writable:false,enumerable:true,configurable:false});
	Object.defineProperty(myShape,'ring'		,{value:ringPlane,writable:false,enumerable:true,configurable:false});

	//entities

	function cylindricalCalumn(gl,radius,height){
		var rad = Math.PI/180;
		var aCirclePos = [];
		for(var theta = 0;theta <= 360;theta += 5){
			posx = radius * Math.cos(theta * rad);
			posy = radius * Math.sin(theta * rad);	
			posz = 0;
			aCirclePos.push([posx,posy,posz]);
		}
		var ii,nn = aCirclePos.length;
console.log("cylindricalCalumn nn=",nn);
		var normals = [];

		var positions = [];
		positions.push(0,0,0);
		normals.push(0,0,1);
		positions.push(0,0,-height);
		normals.push(0,0,-1);

		for(ii=0;ii<nn;ii++){
			pos = aCirclePos[ii];
			positions.push(pos.x);
			positions.push(pos.y);
			positions.push(0);
			normals.push(0,0,1);
		}
		for(ii=0;ii<nn;ii++){
			pos = aCirclePos[ii];
			positions.push(pos.x);
			positions.push(pos.y);
			positions.push(0);
			normals.push(pos.x,pos.y,0);
		}
		for(ii=0;ii<nn;ii++){
			pos = aCirclePos[ii];
			positions.push(pos.x);
			positions.push(pos.y);
			positions.push(-height);
			normals.push(pos.x,pos.y,0);
		}
		for(ii=0;ii<nn;ii++){
			pos = aCirclePos[ii];
			positions.push(pos.x);
			positions.push(pos.y);
			positions.push(-height);
			normals.push(0,0,-1);
		}
		var colors = [];
		colors.push(1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0);
		for(ii=0;ii<nn;ii++){
			colors.push(
				1.0,1.0,1.0,1.0,
				1.0,1.0,1.0,1.0,
				1.0,1.0,1.0,1.0,
				1.0,1.0,1.0,1.0
			);
		}
		var textureCoordinates = [];
		textureCoordinates.push(1.0,1.0);
		textureCoordinates.push(1.0,1.0);
		for(ii=0;ii<nn;ii++){
			textureCoordinates.push(
				1.0,1.0,
				1.0,1.0,
				1.0,1.0,
				1.0,1.0,1.0,1.0
			);
		}


		var indices = [];
		var nTriangle = 0;
		for(ii=0;ii<nn-1;ii++){
			indices.push(0,2+ii,3+ii);
			nTriangle++;		
		};
		for(ii=0;ii<nn-1;ii++){
			indices.push(nn+ii+2,nn+ii+3,2*nn+ii+2);
			indices.push(2*nn+ii+2,2*nn+ii+3,nn+ii+3);		
			nTriangle+=2;
		};
		for(ii=0;ii<nn-1;ii++){
			indices.push(1,3*nn+ii+2,3*nn+ii+3);
			nTriangle++;
		};


		return {
			name:'cylindricalCalumn',
//for drawArray		n:nn*4,///+6,
			n:nTriangle*3,
			pos:positions,
			nor:normals,
			col:colors,
			tex:textureCoordinates,
			ind:indices,
			draw:function(){
				gl.drawElements(gl.TRIANGLES,nTriangle*3,gl.UNSIGNED_SHORT,0);
			}
		};
	};

	function rectangle(gl,width,height){
		var positions = [
			-width/2,height/2,0,
			width/2,height/2,0,
			width/2,-height/2,0,
			-width/2,-height/2,0
		];
		var normals = [0,0,1,0,0,1,0,0,1,0,0,1];
		var colors = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];
		var textureCoordinates = [0,0,1,0,1,1,0,1];
		var indices = [0,1,2,0,2,3];
		return {
			name:'rectangle',
			n:4,
			pos:positions,
			nor:normals,
			col:colors,
			tex:textureCoordinates,
			ind:indices,
			draw:function(){
				gl.drawElements(gl.TRIANGLES,6,gl.UNSIGNED_SHORT,0);//to do
			}
		};
	};
	function point(gl,p,c){
		var positions = [];
		positions.push(p.x,p.y,p.z);
		var normals = [1,1,1];
		var colors = [c.r,c.g,c.b,c.a];
		var textureCoordinates = [0,0];
		var indices = [0];
		return {
			name:'point',
			n:1,
			pos:positions,
			nor:normals,
			col:colors,
			tex:textureCoordinates,
			ind:indices,
			draw:function(){
				gl.drawElements(gl.POINTS,1,gl.UNSIGNED_SHORT,0);//to do
			}
		}
	};
	function line(gl,pointStart,pointEnd,color){
		var positions = [];
		positions = positions.concat(pointStart);
		positions = positions.concat(pointEnd);
		var normals = [1.0,1.0,1.0,1.0,1.0,1.0];
		var colors = [];
		colors.push(color.r,color.g,color.b,color.a);
		colors.push(color.r,color.g,color.b,color.a);
		var textureCoordinates = [0,0,1,1];
		var indices = [0,1];
		return {
			name:'line',
			n:2,
			pos:positions,
			nor:normals,
			col:colors,
			tex:textureCoordinates,
			ind:indices,
			draw:function(){
				gl.drawElements(gl.LINE_STRIP,2,gl.UNSIGNED_SHORT,0);//to do
			}
		}
	};
	function triangle(gl,p1,p2,p3,color){
		var positions = [];
		positions.push(p1.x,p1.y,p1.z,p2.x,p2.y,p2.z,p3.x,p3.y,p3.z,p1.x,p1.y,p1.z);
		var vN = getNormalVector(gl,p1,p2,p3,[0,0,0]);
		var normals = [
			vN.x,vN.y,vN.z,
			vN.x,vN.y,vN.z,
			vN.x,vN.y,vN.z
		];
		var colors = [];
		colors.push(color.r,color.g,color.b,color.a);
		colors.push(color.r,color.g,color.b,color.a);
		colors.push(color.r,color.g,color.b,color.a);
		var textureCoordinates = [
			0,0,
			0,1,
			1,1,
		];
		var indices = [
			0,1,2
		];
		return {
			name:'triangle',
			n:3,
			pos:positions,
			nor:normals,
			col:colors,
			tex:textureCoordinates,
			ind:indices,
			draw:function(){
				gl.drawElements(gl.TRIANGLES,3,gl.UNSIGNED_SHORT,0);
			}
		}
	};
	function axisX(gl) {
			return myShape.line(gl,[0,0,0],[10,0,0],new myColorName.red(1));	
	};
	function axisY(gl){
			return myShape.line(gl,[0,0,0],[0,10,0],new myColorName.green(1));	
	};
	function axisZ(gl){
			return myShape.line(gl,[0,0,0],[0,0,10],new myColorName.blue(1));	
	};
	function tetrahedron(gl,radius){
		//create tetrahedron
		var ra=1.0;
		var rb=2*Math.pow(2,0.5)/3*ra;
		var x1=0,y1=0,z1=ra;
		var x2=0,y2=rb,z2=-ra/4;
		var x3=rb*Math.sin(120*Math.PI/180),y3=rb*Math.cos(120*Math.PI/180),z3=-ra/4;
		var x4=rb*Math.sin(240*Math.PI/180),y4=rb*Math.cos(240*Math.PI/180),z4=-ra/4;

		//頂点の位置情報をバッファを作ってそこに入れる
		var positions = [
			x1,y1,z1,
			x2,y2,z2,
			x3,y3,z3,

			x1,y1,z1,
			x2,y2,z2,
			x4,y4,z4,

			x1,y1,z1,
			x3,y3,z3,
			x4,y4,z4,

			x2,y2,z2,
			x3,y3,z3,
			x4,y4,z4
		];
		for(var ii=0,len=positions.length;ii<len;ii++)positions[ii]=positions[ii]*radius;

		var p1 = [x1,y1,z1];
		var p2 = [x2,y2,z2];
		var p3 = [x3,y3,z3];
		var p4 = [x4,y4,z4];
		var pInner = [0,0,0];
		var v1 = getNormalVector(gl,p1,p2,p3,pInner);
		var v2 = getNormalVector(gl,p1,p2,p4,pInner);
		var v3 = getNormalVector(gl,p1,p3,p4,pInner);
		var v4 = getNormalVector(gl,p2,p3,p4,pInner);

		var normals = [
			v1.x,v1.y,v1.z,
			v1.x,v1.y,v1.z,
			v1.x,v1.y,v1.z,
			v2.x,v2.y,v2.z,
			v2.x,v2.y,v2.z,
			v2.x,v2.y,v2.z,
			v3.x,v3.y,v3.z,
			v3.x,v3.y,v3.z,
			v3.x,v3.y,v3.z,
			v4.x,v4.y,v4.z,
			v4.x,v4.y,v4.z,
			v4.x,v4.y,v4.z
		];



		//頂点の色情報をバッファを作ってそこに入れる
		var colors = [
			1.0, 1.0, 1.0, 1.0,
			0.0,0.0,0.9,1.0,
			0.9,0.1,0.1,1.0,
			1.0, 1.0, 1.0, 1.0,
			0.0,0.0,0.9,1.0,
			0.1,1.0,0.2,1.0,
			1.0, 1.0, 1.0, 1.0,
			0.9,0.1,0.1,1.0,
			0.1,1.0,0.2,1.0,
			0.0,0.0,0.9,1.0,
			0.9,0.1,0.1,1.0,
			0.1,1.0,0.2,1.0,
		];

		var textureCoordinates = [
			0.0,0.0,
			1.0,0.0,
			1.0,1.0,

			0.0,0,0,
			0.0,1.0,
			1.0,1.0,

			0.0,0.0,
			1.0,0.0,
			1.0,1.0,

			0.0,0,0,
			0.0,1.0,
			1.0,1.0
		];

		var indices = [
			0,1,2,
			3,4,5,
			6,7,8,
			9,10,11
		];	

		return {
			name:'regularTetrahedron',
			n:12,
			pos:positions,
			nor:normals,
			col:colors,
			tex:textureCoordinates,
			ind:indices,
			draw:function(){
				gl.drawElements(gl.TRIANGLES,12,gl.UNSIGNED_SHORT,0);
			}
		}
	};
	function hexahedron(gl,radius){
		//regular hexahedron

		p1 = [1,1,1];
		p2 = [1,-1,1];
		p3 = [-1,-1,1];
		p4 = [-1,1,1];
		p5 = [1,1,-1];
		p6 = [1,-1,-1];
		p7 = [-1,-1,-1];
		p8 = [-1,1,-1];
		pInner = [0,0,0];
		var positions = [];
		positions = positions.concat(p1);
		positions = positions.concat(p2);
		positions = positions.concat(p3);
		positions = positions.concat(p4);
		positions = positions.concat(p4);
		positions = positions.concat(p3);
		positions = positions.concat(p7);
		positions = positions.concat(p8);
		positions = positions.concat(p8);
		positions = positions.concat(p7);
		positions = positions.concat(p6);
		positions = positions.concat(p5);
		positions = positions.concat(p5);
		positions = positions.concat(p6);
		positions = positions.concat(p2);
		positions = positions.concat(p1);
		positions = positions.concat(p5);
		positions = positions.concat(p1);
		positions = positions.concat(p4);
		positions = positions.concat(p8);
		positions = positions.concat(p2);
		positions = positions.concat(p6);
		positions = positions.concat(p7);
		positions = positions.concat(p3);
		for(var ii=0,len=positions.length;ii<len;ii++)positions[ii]=positions[ii]*radius;

		v1 = getNormalVector(gl,p1,p2,p3,pInner);
		v2 = getNormalVector(gl,p4,p8,p3,pInner);
		v3 = getNormalVector(gl,p8,p5,p6,pInner);
		v4 = getNormalVector(gl,p1,p2,p6,pInner);
		v5 = getNormalVector(gl,p1,p4,p8,pInner);
		v6 = getNormalVector(gl,p2,p3,p7,pInner);
		var normals = [];
		normals = normals.concat(v1);
		normals = normals.concat(v1);
		normals = normals.concat(v1);
		normals = normals.concat(v1);
		normals = normals.concat(v2);
		normals = normals.concat(v2);
		normals = normals.concat(v2);
		normals = normals.concat(v2);
		normals = normals.concat(v3);
		normals = normals.concat(v3);
		normals = normals.concat(v3);
		normals = normals.concat(v3);
		normals = normals.concat(v4);
		normals = normals.concat(v4);
		normals = normals.concat(v4);
		normals = normals.concat(v4);
		normals = normals.concat(v5);
		normals = normals.concat(v5);
		normals = normals.concat(v5);
		normals = normals.concat(v5);
		normals = normals.concat(v6);
		normals = normals.concat(v6);
		normals = normals.concat(v6);
		normals = normals.concat(v6);
		var colors = [
			1.0,1.0,1.0,1.0,
			1.0,1.0,1.0,1.0,
			1.0,1.0,1.0,1.0,
			1.0,1.0,1.0,1.0,
	
			1.0,0.2,0.5,0.5,
			1.0,0.2,0.5,0.5,
			1.0,0.2,0.5,0.5,
			1.0,0.2,0.5,0.5,

			0.7,0.3,0.8,0.9,
			0.7,0.3,0.8,0.9,
			0.7,0.3,0.8,0.9,
			0.7,0.3,0.8,0.9,

			0.6,1.0,0.6,0.9,
			0.6,1.0,0.6,0.9,
			0.6,1.0,0.6,0.9,
			0.6,1.0,0.6,0.9,

			0.4,0.2,0.1,0.9,
			0.4,0.2,0.1,0.9,
			0.4,0.2,0.1,0.9,
			0.4,0.2,0.1,0.9,

			1.0,1.0,0.1,0.9,
			1.0,1.0,0.1,0.9,
			1.0,1.0,0.1,0.9,
			1.0,1.0,0.1,0.9,

		];


		var textureCoordinates = [
			1.0,0.0,
			1.0,1.0,
			0.0,1.0,
			0.0,0.0,
	
			1.0,0.0,
			1.0,1.0,
			0.0,1.0,
			0.0,0.0,

			1.0,0.0,
			1.0,1.0,
			0.0,1.0,
			0.0,0.0,

			1.0,0.0,
			1.0,1.0,
			0.0,1.0,
			0.0,0.0,

			1.0,0.0,
			1.0,1.0,
			0.0,1.0,
			0.0,0.0,
	
			1.0,0.0,
			1.0,1.0,
			0.0,1.0,
			0.0,0.0
		];


		var indices = [
			0,1,2,0,2,3,
			4,5,6,4,6,7,
			8,9,10,8,10,11,
			12,13,14,12,14,15,
			16,17,18,16,18,19,
			20,21,22,20,22,23
		];
		return {
			name:'hexahedron',
			n:36,
			pos:positions,
			nor:normals,
			col:colors,
			tex:textureCoordinates,
			ind:indices,
			draw:function(){
				gl.drawElements(gl.TRIANGLES,36,gl.UNSIGNED_SHORT,0);
			}
		}
	};
	function sphere2(gl,rr){

		var rad = Math.PI / 180;
		var alpha;//latitude
		var gamma;//longitude
//		var rr=2.0;//radius

		var dal=9;//diffential of alpha
		var dgam=9;//differential of gamma
//		var dal=3;//diffential of alpha
//		var dgam=3;//differential of gamma

		var nLongitude = 0,nLatitude = 0;
//○		var px=[],py=[],pz=[];
		var points=[];
		var flagFirstTime=true;
		var x,y,z;
		for(gamma=-90;gamma<=90;gamma+=dgam){
			nLongitude++;
			for(var alphaB=-180;alphaB<=180;alphaB+=dal){
if(alphaB==180){
	alpha=179.999;
}else{
	alpha=alphaB;
}
			if(flagFirstTime){
					//console.log("alpha=",alpha);
					nLatitude++;
				}

				
				x=rr * Math.cos(rad * gamma) * Math.cos(rad * alpha);
				y=rr * Math.cos(rad * gamma) * Math.sin(rad * alpha);
				z=rr * Math.sin(rad * gamma);
				points.push([x,y,z]);
//○				px.push(x);
//○				py.push(y);
//○				pz.push(z);

			}
			flagFirstTime=false;
		}
		var pointInner = [0,0,0];
//	console.log(" nLongitude=",nLongitude," nLatitude=",nLatitude);
		var countRectangle=0;
		var ii,kk;
		var n1,n2,n3,n4;
		var tempNorm;
		var normals = [];
		var positions = [];
		for(kk=0;kk<nLongitude-1;kk++){
			for(ii=0;ii<nLatitude-1;ii++){
				countRectangle++;
				n1=kk * nLatitude + ii;
				positions = positions.concat(points[n1]);

				n2 = kk * nLatitude + ii + 1;
				positions = positions.concat(points[n2]);

				n3 = kk * nLatitude + ii + nLatitude;
				positions = positions.concat(points[n3]);

				n4 = kk * nLatitude + ii + nLatitude + 1;
				positions = positions.concat(points[n4]);
				if(false){
					//for mirror ball
					var vN1 = getNormalVector(gl,points[n1],points[n2],points[n3],pointInner);
					normals = normals.concat(vN1);
					normals = normals.concat(vN1);
					normals = normals.concat(vN1);
					normals = normals.concat(vN1);
				}else{
					//for smooth surface
					normals = normals.concat(points[n1]);
					normals = normals.concat(points[n2]);
					normals = normals.concat(points[n3]);
					normals = normals.concat(points[n4]);
				}
			}
		}


//	console.log("number of rectangles",countRectangle);

	if(countRectangle!=(nLatitude-1)*(nLongitude-1))PRINT_CAUTION.innerHTML+="Unmatch the number of rectangles and the numner of culculation result of it.<br>";


		var colors = [];
		for(var ii=0,len=countRectangle*4;ii<len;ii++){
			colors.push(0.5);
			colors.push(0.5);
			colors.push(1.0);
			colors.push(0.1);
		}
//	console.log("colors n=",colors.length/4);

		var textureCoordinates = [];
		for(kk=0;kk<nLongitude-1;kk++){
			for(ii=0;ii<nLatitude-1;ii++){
				textureCoordinates.push(1/nLatitude * ii);
				textureCoordinates.push(1/nLongitude * kk);

				textureCoordinates.push(1/nLatitude * (ii + 1));
				textureCoordinates.push(1/nLongitude * kk);

				textureCoordinates.push(1/nLatitude * ii);
				textureCoordinates.push(1/nLongitude * (kk + 1));

				textureCoordinates.push(1/nLatitude * (ii + 1));
				textureCoordinates.push(1/nLongitude * (kk + 1));
			}
		}


		var countTriangle=0;

		var indices = new Array();//2 triangles by indices make a rectangle
		for(kk=0;kk<(nLongitude-1)*(nLatitude-1);kk++){
			countTriangle++;
			//triangle
			indices.push(kk * 4 );
			indices.push(kk * 4  + 1);
			indices.push(kk * 4  + 2);


			countTriangle++;
			//triangle
			indices.push(kk * 4  + 1);
			indices.push(kk * 4  + 2);
			indices.push(kk * 4  + 3);
		}

//	console.log("nVerteces(of all triangles)=",countTriangle*3);
		return {
			name:'sphere2',
			n:countTriangle*3,//countTriangle*3,//全ての三角形の頂点の総数
			pos:positions,
			nor:normals,
			col:colors,
			tex:textureCoordinates,
			ind:indices,
			draw:function(){
//:sphere2
//console.log("myShape:sphere2:bindTexture=",gl.getParameter(gl.TEXTURE_BINDING_2D));
//console.log("myShape:sphere2:activeTexture=",gl.getParameter(gl.ACTIVE_TEXTURE),"gl.TEXTURE0=",gl.TEXTURE0);
//console.log("myShape:sphere2:elementArrayBuffer=",gl.getParameter(gl.ELEMENT_ARRAY_BUFFER_BINDING));
				gl.drawElements(gl.TRIANGLES,countTriangle*3,gl.UNSIGNED_SHORT,0);
			}

		}
	};//sphere2


	/**
	 *saturn ring
	*/
	function ringPlane(gl,rI,rO){
//console.log("rI=",rI,"rO=",rO);
		var rad = Math.PI/180;
		var dr = (rO - rI)*0.05;
		var pitch = dr / (rO - rI);
		var da = 5*rad;//degree


var nn=0;		

		var px1,py1,pz1,px2,py2,pz2,px3,py3,pz3,px4,py4,pz4;
		var sumPitch=0;
		var vertex = [];
		var normal = [];
		var textureCoordinate = [];
		var colors = [];
		for(var ii=rI;ii<rO;ii+=dr){
			for(var jj=da,len=360*rad;jj<len;jj+=da){
nn++;
				px1=ii*Math.cos(jj);
				py1=ii*Math.sin(jj);
				pz1=0;
				px2=ii*Math.cos(jj+da);
				py2=ii*Math.sin(jj+da);
				pz2=0;
				px3=(ii+dr)*Math.cos(jj+da);
				py3=(ii+dr)*Math.sin(jj+da);
				pz3=0;
				px4=(ii+dr)*Math.cos(jj);
				py4=(ii+dr)*Math.sin(jj);
				pz4=0;
				vertex.push(px1,py1,pz1,px2,py2,pz2,px3,py3,pz3,px4,py4,pz4);//texture2Dの向きに合わせる
				normal.push(0,0,1,0,0,1,0,0,1,0,0,1);
				colors.push(1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1);
				textureCoordinate.push(sumPitch,0.0,sumPitch,1.0,sumPitch+pitch,1.0,sumPitch+pitch,0.0);
//				textureCoordinate.push(	0.0,0.0,0.0,1.0,1.0,1.0,1.0,0.0);
			}
//console.log("sumPitch=",sumPitch);
			sumPitch+=pitch;
		}

		var countTriangle=0;
		var index = [];//2 triangles by indices make a rectangle
//		for(var kk=0,len=(Math.floor((rO-rI)/dr)-1)*(Math.floor(360*rad/da)-1);kk<len;kk++){
//		for(var kk=0,len=(nr-1)*(nd-1);kk<len;kk++){
		for(var kk=0;kk<nn;kk++){
			//triangle
			index.push(kk * 4 );		//No.1
			index.push(kk * 4  + 1);	//No.2
			index.push(kk * 4  + 2);	//No.3
			countTriangle++;


			//triangle
			index.push(kk * 4  + 0);	//No.4
			index.push(kk * 4  + 2);	//No.5
			index.push(kk * 4  + 3);	//No.6
			countTriangle++;
		}
//console.log("nn=",nn);
//console.log("countTriangle=",countTriangle);
		return {
			n:countTriangle*3,//全ての三角形の頂点の総数
			pos:vertex,
			nor:normal,
			col:colors,
			tex:textureCoordinate,
			ind:index,
			draw:function(){
//:ring
//console.log("myShape:ring:bindTexture=",gl.getParameter(gl.TEXTURE_BINDING_2D));
//console.log("myShape:ring:activeTexture=",gl.getParameter(gl.ACTIVE_TEXTURE));
				gl.drawElements(gl.TRIANGLES,countTriangle*3,gl.UNSIGNED_SHORT,0);
			}

		};
	};//ringPlane




	/**
	 *Get Normal Vector from 3 points and get an inner point
	 *
	 *@param {Array extended} out  x,y,z
	 *@param {Array extended} p1 x,y,z
	 *@param {Array extended} p2 x,y,z
	 *@param {Array extended} p3 x,y,z
	 *@param {Array extended} pInnerBody x,y,z
	 *
	*/
	function getNormalVector(gl,p1,p2,p3,pInnerBody){

	//		var magenta = myColorName.magenta(1);
	//		var red = myColorName.red(1);
	//		var green = myColorName.red(1);
	//		var blue = myColorName.blue(1);
	//		var cyan = myColorName.cyan(1);
	//		var yellow = myColorName.yellow(1);

		var pCenter = [(p1.x+p2.x+p3.x)/3,(p1.y+p2.y+p3.y)/3,(p1.z+p2.z+p3.z)/3];
		var vio = myVec3.plus(pCenter,pInnerBody);
		var pio = myVec3.plus(pCenter,vio);
		var vP = myVec3.minus(p2,p1);
		var vQ = myVec3.minus(p3,p1);

		var vN = myVec3.cross(vP,vQ);//right hand cross product

		var l1 = vio.length3D;
		var l2 = vN.length3D;
		if(l1==0 || l2==0){
			vN = [0,0,0];
				PRINT_CAUTION.innerHTML+="Can't product Normal Vector vN=(0,0,0) in GLShape.js<br>";
			return vN;
		}else{
			var theta = Math.acos(myVec3.dot(vio.x,vN)/(l1*l2));
			if(theta>Math.PI/2)vN.opposite();//destruction method{vN.x=-vN.x;vN.y=-vN.y;vN.z=-vN.z;}
		}
		vN.normalize3D();//destructional method

		return vN;
	};


})();

