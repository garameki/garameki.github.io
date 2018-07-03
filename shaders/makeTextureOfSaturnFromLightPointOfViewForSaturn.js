/* */(function(){

var sNameOfShader = "makeTextureOfSaturnFromLightPointOfViewForSaturn";
libFileRelationship.create(sNameOfShader);
libFileRelationship[sNameOfShader].relatedTo='myShaders';
libFileRelationship[sNameOfShader].relatedTo='myFBOs';
libFileRelationship[sNameOfShader].relatedTo='mySendAttribUniform';
libFileRelationship[sNameOfShader].relatedTo='mySendMatrix';
libFileRelationship[sNameOfShader].relatedTo='myTextures';
libFileRelationship[sNameOfShader].relatedTo='myMat4';
libFileRelationship[sNameOfShader].relatedTo='UnitsToDraw';
libFileRelationship[sNameOfShader].relatedTo='extMath';

/* */	var c8 = Math.normalize8;
/* */	var c24 = Math.normalize24;

/**
 *	ある点(原点---移動すると原点も移動します)からある方向を見る(例えば、光源からある方向を見る)
 *	To look toward to arbitrary direction at a arbitrary position(e.g. the view of the Sun which is the emission of the ray)
**/


/* customize below */

var sModeOfFBO = "CTDRSN";//C[NTR]D[NTR]S[NTR]
var colorBufferModeOfFBO = myFBOs.colorBufferModeIsRGBA5551;//none , colorBufferModeIsRGBA4444 , colorBufferModeIsRGBA5551 or colorBufferModeIsALPHA
var controllBlendColorDepthStencilOfFBO = function(gl){
	/* ここにはgl.colorMask,gl.enable/disable(gl.DEPTH_TEST),gl.enable/disable(gl.STENCIL_TEST)を書かないでください。.activate()の中で定義済みです。 */

	/** BLENDER **/
	gl.disable(gl.BLEND);
	//gl.enable(gl.BLEND);

	/** COLOR **/
	gl.colorMask(true,true,true,true);
//	gl.clearColor(c8(0xFF),c8(0xFF),c8(0xFF),c8(0xFF));
	gl.clearColor(c8(0x00),c8(0x00),c8(0x00),c8(0x00));
	gl.clear(gl.COLOR_BUFFER_BIT);

	/** DEPTH **/
	gl.enable(gl.DEPTH_TEST);
	gl.clearDepth(c24(0xFFFFFF));
	gl.clear(gl.DEPTH_BUFFER_BIT);
	gl.depthFunc(gl.LEQUAL);

	/** STENCIL **/
	//ダメgl.disable(gl.STENCIL_TEST);

};

var fs = (function(){/*

	uniform sampler2D uSampler;

	varying highp vec2 vTextureCoord;

	void main(void) {
		mediump vec4 texelColor = texture2D(uSampler,vTextureCoord);
		gl_FragColor = vec4(texelColor.rgb,1.0);
	}
*/});

var vs = (function(){/*
	attribute vec3 aVertexPosition;//x y z
	attribute vec2 aTextureCoord;//x y

	uniform mat4 uPerspectiveMatrixForShadow;
	uniform mat4 uNotManipulatedMatrix;

	uniform float uRadiusOfSaturn;

//for test	uniform mat4 uPerspectiveMatrix;

	varying highp vec2 vTextureCoord;


//make a matrix which rotate a point gamma radian right screw wise
	vec3 rotate(vec3 pointToRotate,mat4 qMatrix,vec3 pointOnAxis){
		return (qMatrix * vec4(pointToRotate-pointOnAxis,1.0)).xyz + pointOnAxis;
	}
	mat4 getQuaternion(vec3 unitvectorParallelToAxis,float gamma){

		float ncos = cos(-gamma*0.5);
		float nsin = sin(-gamma*0.5);

		float q0=ncos;
		float q1=unitvectorParallelToAxis.x*nsin;
		float q2=unitvectorParallelToAxis.y*nsin;
		float q3=unitvectorParallelToAxis.z*nsin;


		float qq0 = q0*q0;
		float qq1 = q1*q1;
		float qq2 = q2*q2;
		float qq3 = q3*q3;

		float qq12 = q1*q2*2.0;
		float qq03 = q0*q3*2.0;
		float qq13 = q1*q3*2.0;
		float qq02 = q0*q2*2.0;
		float qq23 = q2*q3*2.0;
		float qq01 = q0*q1*2.0;

		//mat4返しても、向こうでメモリ確保してくれていて、消えないから大丈夫
		return mat4(qq0+qq1-qq2-qq3,qq12-qq03,qq13+qq02,0,qq12+qq03,qq0-qq1+qq2-qq3,qq23-qq01,0,qq13-qq02,qq23+qq01,qq0-qq1-qq2+qq3,0,0,0,0,1);

	}

	void main(void) {
		//for quaternion
		vec3 qAxis;
		float qAngle;
		mat4 qMatrix;

		//土星の中心
		vec3 pO = (uNotManipulatedMatrix * vec4(0.0,0.0,0.0,1.0)).xyz;
		//光源
		vec3 pL = vec3(0.0);
		//球面上の点arbitrary point on the surface to compute
		vec3 pP = (uNotManipulatedMatrix * vec4(aVertexPosition,1.0)).xyz;
		//上の三点で作る平面の法線ベクトルthe normal of the plane made of three points above
		vec3 vRN = normalize(cross(pP-pO,pL-pO));
		//光源からの土星の中心に向かう光の方向ベクトルthe vector of the light toward from light origin to the center of the Saturn
		vec3 vLN = normalize(pO-pL);
		//光源と土星の中心との距離the length between the light origin and the center of the Saturn
		float lenLO = length(pO-pL);
		//∠pRpLpO
		float theta = asin(uRadiusOfSaturn / lenLO);
		//球の光の当たっている部分を切り取る平面と直線pLpOの交点the center of the plane which cut off the part of sphere lit
		vec3 pC = pL + lenLO*cos(theta)*cos(theta)*vLN;

		vec3 pD = pL + (lenLO - uRadiusOfSaturn)*vLN;
		//球と接平面との交点the cross point of the sphere and the plane touching at it
		vec3 pR = pC - lenLO*cos(theta)*sin(theta)*normalize(cross(vLN,vRN));

		//回転軸the center vector to rotate pP
		qAxis = vRN;
		//角度the angle to rotate pP
		qAngle = acos(dot(normalize(pP-pC),normalize(pR-pC)));
		//回転マトリックス a matrix to rotate from pP to pQ which is on the plane as same as pC
		qMatrix = getQuaternion(qAxis,qAngle);
		//pPを移動した後の平面上の点pQ the point pQ which is the pP rotated by quaternion,and pP is on the plane to draw
		vec3 pQ = rotate(pP,qMatrix,pD);

		//この点を光源から見たものにするために、さらに回転するA more rotation will be given to pQ to get the view from the light origin point of view
		//つまり、視線(0,0,-1)と、光源から土星の中心を結ぶ線が重なるように回転させるso that the gaze vector (0,0,-1 )and the vector from light origin to the center of the Saturn must be overlaided each other

		//回転軸 the center axis to rotate
		qAxis = normalize(cross(pO-pL,vec3(0.0,0.0,-1.0)));//視線を土星に向ける It make observer's gaze to be in direction to the Saturn.
		//角度 the quantity of angle
		qAngle = acos(dot(normalize(pO-pL),vec3(0.0,0.0,-1.0)));//Two vectors are unit vectors each other,then the denominator of inner product is 1.
		qMatrix = getQuaternion(qAxis,qAngle);		
		vec4 pos = uPerspectiveMatrixForShadow * qMatrix * vec4(pP,1.0);
		gl_Position = vec4(pos.xy*1.0,pos.z,pos.w);

		vTextureCoord = aTextureCoord;
	}
*/});
var aAttribs = [
		"aVertexPosition",
		"aTextureCoord"
];
var aUniforms = [
		"uNotManipulatedMatrix",
		"uPerspectiveMatrixForShadow",
//for test	"uPerspectiveMatrix",
		"uSampler",
		"uRadiusOfSaturn"
];

//makeTextureOfSaturnFromLightPointOfViewForSaturn:function(gl,sNameSaturn,angle,sNameShader){
var auFunction = function(gl,sNameSaturn,angle,radiusOfSaturn){		//radiusOFSaturn is 1/2 of screen width to be drawn 画面いっぱいに土星を描く
	var notManipulatedMatrix,perspectiveForShadowMatrix;
	var member;

		//For the Saturn
		member = UnitsToDraw[sNameSaturn];

		// To vertex shader
		myShaders[sNameOfShader].attrib.aVertexPosition.assignBuffer(member.buffers.position,3);
		myShaders[sNameOfShader].attrib.aTextureCoord.assignBuffer(member.buffers.texture,2);
		member.buffers.bindElement();
//for test	mySendMatrix.perspective(gl,myShaders[sNameOfShader].uniform.uPerspectiveMatrix);
		mySendMatrix.accumeration(myShaders[sNameOfShader].uniform.uNotManipulatedMatrix,member.aMatricesNotManipulated,angle);
		notManipulatedMatrix = myMat4.arr;
		mySendMatrix.perspectiveForShadow(gl,myShaders[sNameOfShader].uniform.uPerspectiveMatrixForShadow,radiusOfSaturn,notManipulatedMatrix);
		perspectiveMatrixForShadow = myMat4.arr;
		myShaders[sNameOfShader].uniform.uRadiusOfSaturn.sendFloat(radiusOfSaturn);//kkk to check
		// To fragment shader
		myShaders[sNameOfShader].uniform.uSampler.sendInt(0);//gl.TEXTURE0<---variable if you prepared another texture as gl.TEXTURE1, you can use it by setting uSampler as 1.
		myTextures[member.nameTexture].activate(0);

		member.draw();//in which texture activated is for use

		return {nm:notManipulatedMatrix,ps:perspectiveMatrixForShadow};
};


/* */vs = vs.toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1];//.replace(/\n/g,BR).replace(/\r/g,"");
/* */fs = fs.toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1];//.replace(/\n/g,BR).replace(/\r/g,"");
/* */var funcShader = function(){
/* */	myShaders.create(sNameOfShader,vs,fs,aAttribs,aUniforms);
/* */};
/* */if('myShaders' in window){
/* */	console.log(sNameOfShader + "---ok1---created in myShaders");
/* */	funcShader();
/* */}else{
/* */	var count = 0;
/* */	var hoge = setInterval(function(){
/* */		if(++count > 1000){
/* */			clearInterval(hoge);
/* */			console.error("Can't create myShaders."+sNameOfShader);
/* */		}
/* */		if('myShaders' in window){
/* */			clearInterval(hoge);
/* */			console.log(sNameOfShader + "---ok2---created in myShaders");
/* */			funcShader();
/* */		}
/* */	},1);
/* */}
/* */var funcFBO = function(){
/* */	myFBOs.create(sNameOfShader,sModeOfFBO,colorBufferModeOfFBO,controllBlendColorDepthStencilOfFBO);//null---Color buffer is not to use.
/* */};
/* */if('myFBOs' in window){
/* */	console.log(sNameOfShader + "---ok1---created in myShaders");
/* */	funcFBO();
/* */}else{
/* */	var count = 0;
/* */	var hoge = setInterval(function(){
/* */		if(++count > 1000){
/* */			clearInterval(hoge);
/* */			console.error("Can't create myShaders."+sNameOfShader);
/* */		}
/* */		if('myShaders' in window){
/* */			clearInterval(hoge);
/* */			console.log(sNameOfShader + "---ok2---created in myShaders");
/* */			funcFBO();
/* */		}
/* */	},1);
/* */}
/* */

/* */var funcSendAttribUniform = function(){
/* */	mySendAttribUniform.create(sNameOfShader,auFunction);
/* */};
/* */if('mySendAttribUniform' in window){
/* */	console.log("mySendAttribUniform."+sNameOfShader + "---ok1---created");
/* */	funcSendAttribUniform();
/* */}else{
/* */	var count = 0;
/* */	var hoge = setInterval(function(){
/* */		if(++count > 1000){
/* */			clearInterval(hoge);
/* */			console.error("Can't create mySendAttribUniform."+sNameOfShader);
/* */		}
/* */		if('myShaders' in window){
/* */			clearInterval(hoge);
/* */			console.log("mySendAttribUniform"+sNameOfShader + "---ok2---created");
/* */			funcSendAttribUniform();
/* */		}
/* */	},1);
/* */}
/* */


/* */})();

