/* */(function(){

var sNameOfShader = "drawPolygonMoreTransparentlyOnStencil";
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
 *	デプスバッファを補正して、カラーとして表示します。
 *	To draw the texture of depth buffer as the texture of color buffer
**/


/* */	var c8 = Math.normalize8;
/* */	var c24 = Math.normalize24;

/* customize below */

var sModeOfFBO = "CTDTSN";//C[NTR]D[NTR]S[NTR]
var colorBufferModeOfFBO = myFBOs.colorBufferModeIsRGBA4444;//none , colorBufferModeIsRGBA4444 , colorBufferModeIsRGBA5551 or colorBufferModeIsALPHA
var controllBlendColorDepthStencilOfFBO = function(gl){
	/* ここにはgl.colorMask,gl.enable/disable(gl.DEPTH_TEST),gl.enable/disable(gl.STENCIL_TEST)を書かないでください。.activate()の中で定義済みです。 */

	/** BLENDER **/
//	gl.disable(gl.BLEND);
	gl.enable(gl.BLEND);
	gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);

	/** COLOR **/
	gl.colorMask(true,true,true,true);
	gl.clearColor(c8(0x00),c8(0x00),c8(0x00),c8(0x00));
	gl.clear(gl.COLOR_BUFFER_BIT);

	/** DEPTH **/
//	gl.disable(gl.DEPTH_TEST);
	gl.enable(gl.DEPTH_TEST);
	gl.clearDepth(c24(0xFFFFFF));
	gl.clear(gl.DEPTH_BUFFER_BIT);
	gl.depthFunc(gl.LEQUAL);

	/** STENCIL **/
	//ダメgl.disable(gl.STENCIL_TEST);

};


var fs = (function(){/*

//hint
//	varying lowp vec2 vTextureCoord;//as same as vertex shader
//	varying lowp vec3 vNTimesEachRGB;//as same as vertex shader
	varying highp vec2 vTextureCoord;//as same as vertex shader
	varying highp vec3 vNTimesEachRGB;//as same as vertex shader

	uniform mediump float uBrightness;
	uniform sampler2D uSamplerStencil;//stencil
	uniform sampler2D uSampler;//texture of polygon

	varying highp vec4 vStencilCoord;
	uniform lowp int uRefStencil;//この上には描かない

	//original AND function from https://gist.github.com/EliCDavis/f35a9e4afb8e1c9ae94cce8f3c2c9b9aint
	lowp int AND(lowp int n1,lowp int n2){
	    lowp float v1 = float(n1);
	    lowp float v2 = float(n2);
	    lowp int byteVal = 1;
	    lowp int result = 0;
	    for(int i = 0; i < 32; i++){
	        bool keepGoing = v1>0.0 || v2 > 0.0;
	        if(keepGoing){
	            bool addOn = mod(v1, 2.0) > 0.0 && mod(v2, 2.0) > 0.0;
	            if(addOn){
	                result += byteVal;
	            }
	            v1 = floor(v1 / 2.0);
	            v2 = floor(v2 / 2.0);
	            byteVal *= 2;
	        } else {
	            return result;
	        }
	    }
	    return result;
	}
	void main(void) {

		highp vec4 texelColor = texture2D(uSampler,vTextureCoord);//ja version
		highp float gg = 1.0/pow(max(dot(texelColor,texelColor),1.0),3.0);//暗いものほど透明にする

		lowp float st8 = texture2D(uSamplerStencil,(vStencilCoord.xy / vStencilCoord.w) * 0.5 + 0.5).r;//この式は胆です

		if(AND(int(st8*256.0),uRefStencil) == 0){//the result of bitwise ANDing isn't zero shows Don't write color.
			gl_FragColor = vec4(uBrightness)*vec4(texelColor.rgb * vNTimesEachRGB,1.0);
		}else{
			gl_FragColor = vec4(uBrightness)*vec4(texelColor.rgb * vNTimesEachRGB,1.0-gg);//kkk0.2->0.5
		};
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
	uniform mat4 uManipulatedRotationMatrix;


//●
	uniform mat4 uManipulatedMatrix;


	uniform float uBaseLight;// 0.0-1.0 ?
	uniform float uPointSizeFloat;//a float value

//hint
//	varying lowp vec2 vTextureCoord;
//	varying lowp vec3 vNTimesEachRGB;
	varying lowp vec2 vTextureCoord;
	varying lowp vec3 vNTimesEachRGB;

	varying highp vec4 vStencilCoord;//ステンシルテクスチャの座標

	void main(void) {
//●kkk

		vStencilCoord = uPerspectiveMatrix * uModelViewMatrix * vec4(aVertexPosition,1.0);
		gl_Position = vStencilCoord;//uPerspectiveMatrix * uModelViewMatrix * vec4(aVertexPosition,1.0);

		gl_PointSize = uPointSizeFloat;
		vTextureCoord = aTextureCoord;

		//分ける　位置ベクトル　と　方向ベクトル
		//位置ベクトル....移動できる　回転できる
		//方向ベクトル....回転できる

//		// How to simulate 1 directional and ambient light
//		// prepare Normal
//		vec4 transformedNormal = uModelViewMatrixInversedTransposed * vec4(aVertexNormal,1.0);
//		//prepare Light 1
//		vec3 directional = normalize(vec3(0.0,0.0,1.0));
//		vec3 directionalNew = vec3(2.0) * normalize(uManipulatedRotationMatrix * vec4(directional,1.0)).xyz;//(intension of light)*2//a new position of the light
//		//calculation intensity of lit surface
//		float quantity = max(dot(transformedNormal.xyz,directionalNew),uBaseLight);//scalar quantity as the light intensity
//		//set color of light
//		vec3 directionalLightColor = vec3(1,1,1);
//		//set color of ambient light
//		vec3 ambientLight = vec3(0.1,0.1,0.1);//This is not the direction but the intensity of color.It does not have relationship with Normal Vector in vertex data.It relates with only 'gl_Color'.
//		//calc total
//		vNTimesEachRGB = ambientLight + (directionalLightColor * quantity);
//	// a effect    please go inside of planets
//		vec4 transformedNormal = uModelViewMatrixInversedTransposed * vec4(aVertexNormal,1.0);
//		vec4 directional = uModelViewMatrixInversedTransposed * vec4(aVertexPosition,1.0);
//		directional = directional / directional.w;
//		float quantity = max(dot(normalize(transformedNormal.xyz),directional.xyz),uBaseLight);//scalar quantity as the light intensity
//		vec3 directionalLightColor = vec3(1,1,1);//RGB intensity
//		vec3 ambientLight = vec3(0.1,0.1,0.1);//This is not the direction but the intensity of color.It does not have relationship with Normal Vector in vertex data.It relates with only 'gl_Color'.
//		vNTimesEachRGB = ambientLight + (directionalLightColor * quantity);
	//point lighting
		//prepare Normal
		vec4 transformedNormal = uModelViewMatrixInversedTransposed * vec4(aVertexNormal,1.0);
		
//原点の移動後の位置を引く必要がある-->移動(by manipulation)する前の位置が、その位置
		//prepare light vectorg
//		vec4 directional = uModelViewMatrixInversedTransposed * vec4(aVertexPosition,1.0);
//		directional = directional / directional.w;
		vec4 directional = -vec4(1.5) * normalize(uModelViewMatrix * vec4(aVertexPosition,1.0) - uManipulatedMatrix * vec4(0.0,0.0,0.0,1.0));//自分の中を照らしてるだけ
//		vec4 directional = normalize(uModelViewMatrix * vec4(aVertexPosition,1.0) - uModelViewMatrix * vec4(0.0,0.0,0.0,1.0));//中も外も明るい
//対象点の移動行列 * 対象点の元の位置ベクトル - 原点の移動にかかった行列 * 原点の元の位置ベクトル
//		vec4 directional = normalize(uModelViewMatrix * vec4(aVertexPosition,0.0));//平行移動の効果を無くす// = normalize(uModelViewMatrix * vec4(aVertexPosition,1.0) - uModelViewMatrix * vec4(0.0,0.0,0.0,1.0));
//		vec4 directional = normalize(vec4(0.0,0.0,1.0,1.0));
//		vec directional = vec3(2.0) * normalize(uManipulatedRotationMatrix * vec4(directional,1.0)).xyz;//(intension of light)*2//a new position of the light
//		vec directional = vec3(2.0) * normalize(uModelViewMatrix * vec4(directional,1.0)).xyz;//(intension of light)*2//a new position of the light
//		vec directional = normalize(uManipulatedRotationMatrix * vec4(directional,1.0)).xyz;//brightness*2//a new position of the light
		

		//intensity of surface
		float quantity = max(dot(normalize(transformedNormal.xyz),directional.xyz),uBaseLight);//scalar quantity as the light intensity

		vec3 directionalLightColor = vec3(1,1,1);//RGB intensity

		//ambient light
		vec3 ambientLight = vec3(0.1,0.1,0.1);//This is not the direction but the intensity of color.It does not have relationship with Normal Vector in vertex data.It relates with only 'gl_Color'.

		vNTimesEachRGB = ambientLight + (directionalLightColor * quantity);

//		gl_Position = uPerspectiveMatrix * uModelViewMatrix * vec4(aVertexPosition,1.0);

	}
*/});

var aAttribs = [
		"aVertexPosition",
		"aVertexNormal",
		"aTextureCoord"
];
var aUniforms = [
		"uPerspectiveMatrix",
		"uModelViewMatrix",
		"uPointSizeFloat",
		"uModelViewMatrixInversedTransposed",
		"uBaseLight",
//		"uManipulatedRotationMatrix",
		"uBrightness",
		"uManipulatedMatrix",
		"uSamplerStencil",
		"uSampler",
		"uRefStencil"//描かないステンシル番号のビット和
];

var auFunction = function(gl,names,angle){
//drawPolygonMoreTransparentlyOnStencil:function(gl,names,angle,sNameOfShader){
	var member,pmat,mvmat;
	for(var num in names){//the last is the texture that is gotten by framebuffer
		member = UnitsToDraw[names[num]];
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
//		mySendMatrix.accumeration(myShaders[sNameOfShader].uniform.uManipulatedRotationMatrix,member.aAccumeUnitsLightDirectional,angle);
		mySendMatrix.accumeration(myShaders[sNameOfShader].uniform.uManipulatedMatrix,member.aAccumeUnitsLightPoint,angle);
		myShaders[sNameOfShader].uniform.uBaseLight.sendFloat(member.baseLight);
		/** Tofragment shader **/
		myShaders[sNameOfShader].uniform.uBrightness.sendFloat(member.brightness);

		myShaders[sNameOfShader].uniform.uSampler.sendInt(0);//gl.TEXTURE0<---variable if you prepared another texture as gl.TEXTURE1, you can use it by setting uSampler as 1.
		myTextures[member.nameTexture].activate(0);

		member.draw();//in which texture activated is for use
		member.labels.repos(gl,pmat,mvmat);
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
