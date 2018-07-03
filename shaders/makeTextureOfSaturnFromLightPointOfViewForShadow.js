/* */(function(){

var sNameOfShader = "makeTextureOfSaturnFromLightPointOfViewForShadow";
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
 *	土星に影を描くために、光源から見た土星に影を落とすためのシェーダーです。
 *	土星本体を描くmakeTextureOfSaturnFromLightPointOfViewForSaturnに続く、土星本体に影を落とすためのシェーダーです。
 *	色のある所は不透明の黒で描きます。黒い部分は透明にして描きます。これにより、影が描かれます。
 *	FBOはmakeTextureOfSaturnFromLightPointOfViewForSaturnのものをそのまま使います。
 *	
**/

/* customize below */

var sModeOfFBO = "CNDNSN";//C[NTR]D[NTR]S[NTR]//今回は使いません
var colorBufferModeOfFBO = myFBOs.colorBufferModeIsRGBA5551;//none , colorBufferModeIsRGBA4444 , colorBufferModeIsRGBA5551 or colorBufferModeIsALPHA
var controllBlendColorDepthStencilOfFBO = function(gl){ };//使わない

var fs = (function(){/*


	uniform lowp float uBrightness;//Saturn2---1.0 ring--arbitrary to send

	uniform sampler2D uSampler;

	varying highp vec2 vTextureCoord;

	void main(void) {
		highp vec4 texelColor = texture2D(uSampler,vTextureCoord);//ja version
//		highp float gg = 1.0/pow(max(dot(texelColor,texelColor),1.0),3.0);//暗いものほど透明にする
		mediump float gg = pow(max(min(dot(texelColor.rgb,texelColor.rgb),1.0),0.0001),5.0);//暗いものほど透明にする

		gl_FragColor = vec4(uBrightness)*vec4(0.0,0.0,0.0,(gg+0.5)/2.0);
//		gl_FragColor = vec4(uBrightness)*vec4(1.0,1.0,1.0,1.0);//(gg+0.5)/2.0);//for test view

	}
*/});

var vs = (function(){/*
	attribute vec3 aVertexPosition;//x y z
	attribute vec2 aTextureCoord;//x y


	varying highp vec2 vTextureCoord;
	varying highp vec3 vNTimesEachRGB;

	uniform mat4 uNotManipulatedMatrix;
	uniform mat4 uPerspectiveMatrixForShadow;
	uniform mat4 uPerspectiveMatrix;// for test view
	uniform mat4 uQMatrix;



	void main(void) {

		gl_Position = uPerspectiveMatrixForShadow * uQMatrix * uNotManipulatedMatrix * vec4(aVertexPosition,1.0);
//		gl_Position = uPerspectiveMatrix          * uQMatrix * uNotManipulatedMatrix * vec4(aVertexPosition,1.0);//for test view


		vTextureCoord = aTextureCoord;



	}
*/});
var aAttribs = [
		"aVertexPosition",
		"aTextureCoord"
];
var aUniforms = [
		"uSampler",
		"uBrightness",
		"uNotManipulatedMatrix",
		"uPerspectiveMatrixForShadow",
		"uQMatrix",
		"uPerspectiveMatrix"//テスト用
];



//makeTextureOfSaturnFromLightPointOfViewForShadow:function(gl,aNames,angle,sNameShader,parentNotManipulatedMatrix,parentPerspectiveMatrixForShadow){
var auFunction = function(gl,aNames,angle,parentNotManipulatedMatrix,parentPerspectiveMatrixForShadow){

	var member;

		// For other objects
	for(var ii in aNames){
		member = UnitsToDraw[aNames[ii]];

		// To vertex shader
		myShaders[sNameOfShader].attrib.aVertexPosition.assignBuffer(member.buffers.position,3);
		myShaders[sNameOfShader].attrib.aTextureCoord.assignBuffer(member.buffers.texture,2);
		member.buffers.bindElement();

//for test
		mySendMatrix.perspective(gl,myShaders[sNameOfShader].uniform.uPerspectiveMatrix);//for test
//new
		mySendMatrix.quaternion(myShaders[sNameOfShader].uniform.uQMatrix,parentNotManipulatedMatrix);
		mySendMatrix.accumeration(myShaders[sNameOfShader].uniform.uNotManipulatedMatrix,member.aMatricesNotManipulated,angle);
		myShaders[sNameOfShader].uniform.uPerspectiveMatrixForShadow.sendFloat32Array(parentPerspectiveMatrixForShadow);
		// To fragment shader
		myShaders[sNameOfShader].uniform.uBrightness.sendFloat(member.brightness);
		myShaders[sNameOfShader].uniform.uSampler.sendInt(0);//gl.TEXTURE0<---variable if you prepared another texture as gl.TEXTURE1, you can use it by setting uSampler as 1.
		myTextures[member.nameTexture].activate(0);

		member.draw();//in which texture activated is for use

	}
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

