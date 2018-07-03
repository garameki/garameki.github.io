/* */(function(){

var sNameOfShader = "makeStencilFromTextureOnBlack";
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

/*
 *	�J�b�V�[�j�����i���F�j�𓧖��ɂ��ĕ`�悷��
 *	To make black part of pixel transparent pixel to draw
**/



/* customize below */

var sModeOfFBO = "CTDNSN";//C[NTR]D[NTR]S[NTR]
var colorBufferModeOfFBO = myFBOs.colorBufferModeIsR8ForStencil;//none , colorBufferModeIsRGBA4444 , colorBufferModeIsRGBA5551, colorBufferModeIsALPHA or colorBufferModeIsR8ForStencil
var controllBlendColorDepthStencilOfFBO = function(gl){
if(true){
	/* �����ɂ�gl.colorMask,gl.enable/disable(gl.DEPTH_TEST),gl.enable/disable(gl.STENCIL_TEST)�������Ȃ��ł��������B.activate()�̒��Œ�`�ς݂ł��B */

	/** BLENDER **/
	//color(RGBA) = (sourceColor * sfactor) + (destinationColor * dfactor)
	gl.disable(gl.BLEND);
	//gl.enable(gl.BLEND);
	//gl.blendFunc(gl.SRC_ALPHA,gl.ZERO);//ONE_MINUS_SRC_ALPHA);

	/** COLOR --> for stencil use as gl.R8 **/
	gl.colorMask(true,false,false,false);
	gl.clearColor(c8(0x00),c8(0x00),c8(0x00),c8(0x00));//��
	gl.clear(gl.COLOR_BUFFER_BIT);//��

	/** DEPTH **/
//	gl.clearDepth(c24(0xFFFFFF));
//	gl.clear(gl.DEPTH_BUFFER_BIT);
//	gl.depthFunc(gl.LEQUAL);

	/** STENCIL **/
	//�_��gl.disable(gl.STENCIL_TEST);
}//boolean
};

var fs = (function(){/*

//	varying lowp vec2 vTextureCoord;
	varying highp vec2 vTextureCoord;

	uniform sampler2D uSampler;
	uniform lowp float refStencil;//this will be changed to 8bit for 1.0~0.0//precision�𑼂̂��̂Ɠ��ꂵ�Ȃ���==�����܂������܂���!!

	void main(void) {

		mediump vec4 texelColor = texture2D(uSampler,vTextureCoord);
		mediump float gg = pow(max(min(dot(texelColor.rgb,texelColor.rgb),1.0),0.0001),1.2);//�Â����̂قǓ����ɂ���
		if(gg > 0.5){
			gl_FragColor = vec4(0.0,0.0,0.0,0.0);//gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA)�͕K�{
		}else{
			gl_FragColor = vec4(refStencil,0.0,0.0,0.0);//gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA)�͕K�{
			//discard;
			//gl_FragColor = vec4(refStencil,0.0,0.0,0.0);//gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA)�͕K�{
		}
	}
*/});


var vs = (function(){/*
	attribute vec3 aVertexPosition;//x y z
	attribute vec2 aTextureCoord;//x y

	uniform mat4 uModelViewMatrix;
	uniform mat4 uPerspectiveMatrix;

//	varying lowp vec2 vTextureCoord;
	varying highp vec2 vTextureCoord;


	void main(void) {
		gl_Position = uPerspectiveMatrix * uModelViewMatrix * vec4(aVertexPosition,1.0);
		vTextureCoord = aTextureCoord;
	}
*/});

var aAttribs = ["aVertexPosition","aTextureCoord"];
var aUniforms = ["uModelViewMatrix","uPerspectiveMatrix","uSampler","refStencil"];

/** for mySendAttribUniform **/
var auFunction = function(gl,names,angle,nRefStencil){

	myShaders[sNameOfShader].uniform.refStencil.sendFloat8(nRefStencil);//common with all members
	var member;
	for(var num in names){
		member = UnitsToDraw[names[num]];
		/** To vertex shader **/
		myShaders[sNameOfShader].attrib.aVertexPosition.assignBuffer(member.buffers.position,3);
		myShaders[sNameOfShader].attrib.aTextureCoord.assignBuffer(member.buffers.texture,2);
		member.buffers.bindElement();

		mySendMatrix.perspective(gl,myShaders[sNameOfShader].uniform.uPerspectiveMatrix);
		mySendMatrix.accumeration(myShaders[sNameOfShader].uniform.uModelViewMatrix,member.aAccumeUnits,angle);
		/** Tofragment shader **/
		myShaders[sNameOfShader].uniform.uSampler.sendInt(1);//gl.TEXTURE0<---variable if you prepared another texture as gl.TEXTURE1, you can use it by setting uSampler as 1.
		myTextures[member.nameTexture].activate(1);


		member.draw();//in which texture activated is for use
	}
},


/* */fs = fs.toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1];//.replace(/\n/g,BR).replace(/\r/g,"");
/* */vs = vs.toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1];//.replace(/\n/g,BR).replace(/\r/g,"");
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


//�쐬���������́i�ړI�j����A""�Ȃ�""��K�v�Ƃ��Ă���̂����t���ōl����Ɖ������₷��

//3.Stencil Texture���쐬���܂�
//2.Alpha Texture����쐬���܂�
//1.�e�N�X�`���[�̍��̕�������Color Texture��Alpha��p�����܂�



