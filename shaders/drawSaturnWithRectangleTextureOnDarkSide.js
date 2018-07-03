/* */(function(){

var sNameOfShader = "drawSaturnWithRectangleTextureOnDarkSide";
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

	varying mediump vec3 vNTimesEachRGB;//as same as vertex shader
	varying lowp vec2 vTextureCoordRectangle;
	varying lowp float vZclip;

	uniform mediump float uBrightness;
	uniform sampler2D uSamplerRectangle;

	void main(void) {
		highp vec4 texelColor;
	//	if(vZclip >= 1.0){
			texelColor = texture2D(uSamplerRectangle,vTextureCoordRectangle);
			gl_FragColor = vec4(uBrightness) * vec4(texelColor.rgb * vNTimesEachRGB,1.0);
	//	}else{
	//		discard;
	//	}

	//		gl_FragColor = vec4(1.0);//vec4(vPosition.rgb * vNTimesEachRGB,1.0);//座標を色分けで見やすくできる良い方法
	}
*/});

var vs = (function(){/*
	//'attribute' this type is used in vertex shader only.This type is assigned on buffers defined in js
	attribute vec3 aVertexPosition;//x y z
	attribute vec3 aVertexNormal;//x y z
	attribute vec2 aTextureCoord;//x y

	//The type of 'uniform' mainly matrices receipter from js
	uniform mat4 uModelViewMatrixInversedTransposed;
	uniform mat4 uModelViewMatrix;
	uniform mat4 uPerspectiveMatrix;
	uniform mat4 uManipulatedMatrix;


	uniform float uBaseLight;// 0.0-1.0 ?

	uniform float uRadiusOfSaturn;

	varying mediump vec3 vNTimesEachRGB;//as same as vertex shader
	varying lowp vec2 vTextureCoordRectangle;
	varying lowp float vZclip;

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
		float lLO = funcLength(pO - pL);
		float theta = asin(uRadiusOfSaturn / lLO);
		vec3 pC = lLO * cos(theta) * cos(theta) * vLN + pL;
		//平面上の点の位置
		vec3 pQ = dot(vLN,pC-pP) * vLN + pP;
		//平面を隔てて、光源側(LP < LQ)か影側(LP > LQ)かを判断する
		float lLQ = funcLength(pQ - pL);
		float lLP = funcLength(pP - pL);
		vec3 pos;
		pos = lLP < lLQ ? pQ : pP;


		gl_Position = uPerspectiveMatrix * vec4(pos,1.0);

	//テクスチャの位置を計算
		vTextureCoordRectangle = aTextureCoord;

	}
*/});

// ************************************************************************************************************************************************

var aAttribs = [
	"aVertexPosition",
	"aVertexNormal",
	"aTextureCoord"
];
var aUniforms = [
	"uModelViewMatrixInversedTransposed",
	"uModelViewMatrix",
	"uPerspectiveMatrix",
	"uManipulatedMatrix",
	"uBaseLight",
	"uBrightness",
	"uSamplerRectangle",
	"uRadiusOfSaturn"
];

// ************************************************************************************************************************************************

//drawSaturnWithRectangleTextureOnDarkSide:function(gl,sNameSaturn,angle,sNameShader){
var auFunction = function(gl,angle,sNameSaturn,radiusOfSaturn){    //to draw full of saturn on screen

		var member,pmat,mvmat,nmmat;
		member = UnitsToDraw[sNameSaturn];
		/** To vertex shader **/
		myShaders[sNameOfShader].attrib.aVertexPosition.assignBuffer(member.buffers.position,3);
		myShaders[sNameOfShader].attrib.aVertexNormal.assignBuffer(member.buffers.normal,3);
		myShaders[sNameOfShader].attrib.aTextureCoord.assignBuffer(member.buffers.texture,2);
		member.buffers.bindElement();

		mySendMatrix.perspective(gl,myShaders[sNameOfShader].uniform.uPerspectiveMatrix);
		pmat = myMat4.arr;//sended data above
		mySendMatrix.accumeration(myShaders[sNameOfShader].uniform.uModelViewMatrix,member.aAccumeUnits,angle);
		mvmat = myMat4.arr;//sended data above
		mySendMatrix.modelViewInversedTransposed(myShaders[sNameOfShader].uniform.uModelViewMatrixInversedTransposed,mvmat);
		mySendMatrix.accumeration(myShaders[sNameOfShader].uniform.uManipulatedMatrix,member.aAccumeUnitsLightPoint,angle);

		myShaders[sNameOfShader].uniform.uRadiusOfSaturn.sendFloat(radiusOfSaturn);//kkk to check

		myShaders[sNameOfShader].uniform.uBaseLight.sendFloat(member.baseLight);
		/** Tofragment shader **/
		myShaders[sNameOfShader].uniform.uBrightness.sendFloat(member.brightness);

		//"uSamplerRounded"---わかりやすいため呼び出し側でsend
		member.draw();//in which texture activated is for use
		member.labels.repos(gl,pmat,mvmat);
};

// *****************************************************************************************************************************


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
