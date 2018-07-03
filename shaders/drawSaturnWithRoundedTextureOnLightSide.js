/* */(function(){

var sNameOfShader = "drawSaturnWithRoundedTextureOnLightSide";
libFileRelationship.create(sNameOfShader);
libFileRelationship[sNameOfShader].relatedTo='myShaders';
libFileRelationship[sNameOfShader].relatedTo='myFBOs';
libFileRelationship[sNameOfShader].relatedTo='mySendAttribUniform';
libFileRelationship[sNameOfShader].relatedTo='mySendMatrix';
libFileRelationship[sNameOfShader].relatedTo='myTextures';
libFileRelationship[sNameOfShader].relatedTo='myMat4';
libFileRelationship[sNameOfShader].relatedTo='UnitsToDraw';
libFileRelationship[sNameOfShader].relatedTo='extMath';


/**
 *	四角い通常のテクスチャを用いて土星の影の部分の模様を描きます。
 *	To draw the surface not lit on the Saturn with its ordinary rectangle texture.
 *	The difference from common shader is that the part of the shape lit is folded forward to its center.
**/
/* */	var c8 = Math.normalize8;
/* */	var c24 = Math.normalize24;



/* customize below */

var sModeOfFBO = "CNDNSN";//C[NTR]D[NTR]S[NTR]//画面に描きます
var colorBufferModeOfFBO = myFBOs.colorBufferModeIsRGBA4444;//none , colorBufferModeIsRGBA4444 , colorBufferModeIsRGBA5551 or colorBufferModeIsALPHA
var controllBlendColorDepthStencilOfFBO = function(gl){
	/* ここにはgl.colorMask,gl.enable/disable(gl.DEPTH_TEST),gl.enable/disable(gl.STENCIL_TEST)を書かないでください。.activate()の中で定義済みです。 */

	/** BLENDER **/
	gl.disable(gl.BLEND);
	//gl.enable(gl.BLEND);

	/** COLOR **/
	gl.colorMask(true,true,true,true);
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

	uniform mediump float uBrightness;
	uniform sampler2D uSamplerRounded;

	varying mediump vec3 vNTimesEachRGB;//as same as vertex shader
	varying highp vec2 vTextureCoordRounded;

	void main(void) {
		highp vec4 texelColor = texture2D(uSamplerRounded,vTextureCoordRounded);
		gl_FragColor = vec4(uBrightness) * vec4(texelColor.rgb * vNTimesEachRGB,1.0);

		//座標を色分けで見やすくできる良い方法
		//gl_FragColor = vec4(1.0);//vec4(vPosition.rgb * vNTimesEachRGB,1.0);
	}
*/});

var vs = (function(){/*
	//'attribute' this type is used in vertex shader only.This type is assigned on buffers defined in js
	attribute vec3 aVertexPosition;//x y z
	attribute vec3 aVertexNormal;//x y z

	//The type of 'uniform' mainly matrices receipter from js
	uniform mat4 uModelViewMatrixInversedTransposed;
	uniform mat4 uModelViewMatrix;
	uniform mat4 uPerspectiveMatrix;
	uniform mat4 uManipulatedMatrix;
	uniform mat4 uPerspectiveMatrixForShadow;
	uniform mat4 uNotManipulatedMatrix;


	uniform float uBaseLight;// 0.0-1.0 ?
	uniform float uRadiusOfSaturn;

	varying mediump vec3 vNTimesEachRGB;//as same as vertex shader
	varying highp vec2 vTextureCoordRounded;

	//mat4 * vec3
	vec3 funcMult(mat4 m,vec3 v){
		return (m * vec4(v,1.0)).xyz;
	}
	//距離
	float funcLength(vec3 vector){
		return sqrt(dot(vector,vector));
	}
	void main(void) {

		//分ける　位置ベクトル　と　方向ベクトル
		//位置ベクトル....移動できる　回転できる
		//方向ベクトル....回転できる

	//point lighting
		//prepare Normal
		vec4 transformedNormal = uModelViewMatrixInversedTransposed * vec4(aVertexNormal,1.0);
		
//原点の移動後の位置を引く必要がある-->移動(by manipulation)する前の位置が、その位置
		//prepare light vectorg
		vec4 directional = -vec4(1.5) * normalize(uModelViewMatrix * vec4(aVertexPosition,1.0) - uManipulatedMatrix * vec4(0.0,0.0,0.0,1.0));//自分の中を照らしてるだけ

		//intensity of surface
		float quantity = max(dot(normalize(transformedNormal.xyz),directional.xyz),uBaseLight);//scalar quantity as the light intensity

		vec3 directionalLightColor = vec3(1,1,1);//RGB intensity

		//ambient light
		vec3 ambientLight = vec3(0.1,0.1,0.1);//This is not the direction but the intensity of color.It does not have relationship with Normal Vector in vertex data.It relates with only 'gl_Color'.

		vNTimesEachRGB = ambientLight + (directionalLightColor * quantity);


	//光の当たっている部分の点の再計算

		//光源の位置
		vec3 pL = funcMult(uManipulatedMatrix,vec3(0.0));
		//土星の中心の位置 o O 0
		vec3 pO = funcMult(uModelViewMatrix,vec3(0.0));
		//対象となる表面上の位置
		vec3 pP = funcMult(uModelViewMatrix,aVertexPosition); 
		//光源から土星の中心に向かう方向単位ベクトル
		vec3 vLN = normalize(pO -pL);
		//光源から見て光が当たっている部分と当たっていない部分の境界面と、光源と土星の中心を結んだ線の、交点
		float lenLO = funcLength(pO - pL);
		float beta = asin(uRadiusOfSaturn / lenLO);
		vec3 pC = lenLO * cos(beta) * cos(beta) * vLN + pL;
		//平面上の点の位置
		vec3 pQ = dot(vLN,pC-pP) * vLN + pP;
		//平面を隔てて、光源側(LP < LQ)か影側(LP > LQ)かを判断する
		float lLQ = funcLength(pQ - pL);
		float lLP = funcLength(pP - pL);
		vec3 pos;
		pos = lLP >= lLQ ? pQ : pP;

		gl_Position = uPerspectiveMatrix * vec4(pos,1.0);

	//テクスチャの位置を計算

//テクスチャを作成しているのと同じ座標を使っているのにもかかわらず、黒い部分がひらひらするのは、テクスチャのs,tの指定方法が間違っているということ。



		//平行光源
		//遠くなら平行光源positionVectorSaturnでいいけど、近くなると点光源の影響がでるよ。例えば、部屋を照らしている電球のすぐ近くに手をかざすと、大きな影ができるということ。平行光源では影の大きさは一定。
		vec3 positionVectorSaturn = normalize((uNotManipulatedMatrix * vec4(0.0,0.0,0.0,1.0) - vec4(0.0,0.0,0.0,1.0)).xyz);//原点から見た土星の方向ベクトルmeans PosSaturn - PosMovedOrigin

		//点光源
//		vec3 positionVectorSaturn = normalize((uNotManipulatedMatrix * vec4(aVertexPosition,1.0) - vec4(0.0,0.0,0.0,1.0)).xyz);//原点から見た土星の方向ベクトルmeans PosSaturn - PosMovedOrigin

		//ここでpositionVectorSaturnとorthographicMatrixを使って平行光源から見た物体のgl_Possitionを求め、そのgl_Colorを求め、shadowFactorをセットしたのち、perspectiveMatrixを使って新たにgl_Positionを設定しなおし、gl_Colorを設定する。
		//影は、色は黒、alphaは   変化なし  ですからね。


		vec3 centerVector = normalize(cross(positionVectorSaturn,vec3(0.0,0.0,-1.0)));//視線を土星に向ける It make observer's gaze to be in direction to the Saturn.
		float theta = acos(dot(positionVectorSaturn,vec3(0.0,0.0,-1.0)));
//●		float theta = acos(dot(positionVectorSaturn,vec3(0.0,0.0,1.0)));
		//quaternion
		float ncos = cos(-theta*0.5);
		float nsin = sin(-theta*0.5);

		float q0=ncos;
		float q1=centerVector.x*nsin;
		float q2=centerVector.y*nsin;
		float q3=centerVector.z*nsin;


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

		mat4 rotateLightDirection= mat4(qq0+qq1-qq2-qq3,qq12-qq03,qq13+qq02,0,qq12+qq03,qq0-qq1+qq2-qq3,qq23-qq01,0,qq13-qq02,qq23+qq01,qq0-qq1-qq2+qq3,0,0,0,0,1);

		//float a11=qq0+qq1-qq2-qq3;float a12=qq12-qq03;float a13=qq13+qq02;float a14=0.0;float a21=qq12+qq03;float a22=qq0-qq1+qq2-qq3;float a23=qq23-qq01;float a24=0.0;float a31=qq13-qq02;float a32=qq23+qq01;float a33=qq0-qq1-qq2+qq3;float a34=0.0;float a41=0.0;float a42=0.0;float a43=0.0;float a44=1.0;
		//mat4 rotateLightDirection= mat4(a11,a12,a13,a14,a21,a22,a23,a24,a31,a32,a33,a34,a41,a42,a43,a44);//元と同じ
		//mat4 rotateLightDirection= mat4(a11,a21,a31,a41,a12,a22,a32,a42,a13,a23,a33,a43,a14,a24,a34,a44);//元の転置

		vec4 xyzw = uPerspectiveMatrixForShadow * rotateLightDirection * uNotManipulatedMatrix * vec4(aVertexPosition,1.0);

		xyzw = vec4(xyzw.xy*0.996,xyzw.zw);
//○		xyzw = vec4(xyzw.xy*1.0,xyzw.zw);
		vTextureCoordRounded = (xyzw.xy / xyzw.w) * 0.5 + 0.5;



//		vec3 positionVectorSaturn = normalize((uNotManipulatedMatrix * vec4(0.0,0.0,0.0,1.0) - vec4(0.0,0.0,0.0,1.0)).xyz);//原点から見た土星の方向ベクトルmeans PosSaturn - PosMovedOrigin
//		vec3 centerVector = normalize(cross(positionVectorSaturn,vec3(0.0,0.0,-1.0)));//視線を土星に向ける It make observer's gaze to be in direction to the Saturn.
//		float theta = acos(dot(positionVectorSaturn,vec3(0.0,0.0,-1.0)));
//		//quaternion
//		float ncos = cos(-theta*0.5);
//		float nsin = sin(-theta*0.5);

//		float q0=ncos;
//		float q1=centerVector.x*nsin;
//		float q2=centerVector.y*nsin;
//		float q3=centerVector.z*nsin;


//		float qq0 = q0*q0;
//		float qq1 = q1*q1;
//		float qq2 = q2*q2;
//		float qq3 = q3*q3;

//		float qq12 = q1*q2*2.0;
//		float qq03 = q0*q3*2.0;
//		float qq13 = q1*q3*2.0;
//		float qq02 = q0*q2*2.0;
//		float qq23 = q2*q3*2.0;
//		float qq01 = q0*q1*2.0;

//		mat4 rotateLightDirection= mat4(qq0+qq1-qq2-qq3,qq12-qq03,qq13+qq02,0,qq12+qq03,qq0-qq1+qq2-qq3,qq23-qq01,0,qq13-qq02,qq23+qq01,qq0-qq1-qq2+qq3,0,0,0,0,1);

//		//float a11=qq0+qq1-qq2-qq3;float a12=qq12-qq03;float a13=qq13+qq02;float a14=0.0;float a21=qq12+qq03;float a22=qq0-qq1+qq2-qq3;float a23=qq23-qq01;float a24=0.0;float a31=qq13-qq02;float a32=qq23+qq01;float a33=qq0-qq1-qq2+qq3;float a34=0.0;float a41=0.0;float a42=0.0;float a43=0.0;float a44=1.0;
//		//mat4 rotateLightDirection= mat4(a11,a12,a13,a14,a21,a22,a23,a24,a31,a32,a33,a34,a41,a42,a43,a44);//元と同じ
//		//mat4 rotateLightDirection= mat4(a11,a21,a31,a41,a12,a22,a32,a42,a13,a23,a33,a43,a14,a24,a34,a44);//元の転置

//		mediump vec4 xyzw = uPerspectiveMatrixForShadow * rotateLightDirection * uNotManipulatedMatrix * vec4(aVertexPosition,1.0);
//		vTextureCoordRounded = (xyzw.xy / xyzw.w) * 0.5 + 0.5;

	}
*/});

// ************************************************************************************************************************************************

var aAttribs = [
	"aVertexPosition",
	"aVertexNormal"
];
var aUniforms = [
	"uModelViewMatrixInversedTransposed",
	"uModelViewMatrix",
	"uPerspectiveMatrix",
	"uManipulatedMatrix",
	"uBaseLight",
	"uNotManipulatedMatrix",
	"uPerspectiveMatrixForShadow",
	"uBrightness",
	"uSamplerRounded",
	"uRadiusOfSaturn"
];



//drawSaturnWithRoundedTextureOnLightSide:function(gl,sNameSaturn,angle,sNameShader){
var auFunction = function(gl,sNameSaturn,angle,radiusOfSaturn){

	var member,pmat,mvmat,nmmat;
		member = UnitsToDraw[sNameSaturn];
		/** To vertex shader **/
		myShaders[sNameOfShader].attrib.aVertexPosition.assignBuffer(member.buffers.position,3);
		myShaders[sNameOfShader].attrib.aVertexNormal.assignBuffer(member.buffers.normal,3);
		member.buffers.bindElement();

		mySendMatrix.perspective(gl,myShaders[sNameOfShader].uniform.uPerspectiveMatrix);
		pmat = myMat4.arr;//sended data above
		mySendMatrix.accumeration(myShaders[sNameOfShader].uniform.uModelViewMatrix,member.aAccumeUnits,angle);
		mvmat = myMat4.arr;//sended data above
		mySendMatrix.modelViewInversedTransposed(myShaders[sNameOfShader].uniform.uModelViewMatrixInversedTransposed,mvmat);
		mySendMatrix.accumeration(myShaders[sNameOfShader].uniform.uNotManipulatedMatrix,member.aMatricesNotManipulated,angle);
		nmmat = myMat4.arr;
		mySendMatrix.perspectiveForShadow(gl,myShaders[sNameOfShader].uniform.uPerspectiveMatrixForShadow,radiusOfSaturn,nmmat);
		mySendMatrix.accumeration(myShaders[sNameOfShader].uniform.uManipulatedMatrix,member.aAccumeUnitsLightPoint,angle);
		myShaders[sNameOfShader].uniform.uBaseLight.sendFloat(member.baseLight);
		/** Tofragment shader **/
		myShaders[sNameOfShader].uniform.uBrightness.sendFloat(member.brightness);

		//"uSamplerRounded"---わかりやすいため呼び出し側でsend
		member.draw();//in which texture activated is for use
		member.labels.repos(gl,pmat,mvmat);
}

// ************************************************************************************************************************************************

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
