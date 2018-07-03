/* */(function(){

var sNameOfShader = "drawTextureOnClipSpace";
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
 *	draw a texture on clipping space
**/



/* */	var c8 = Math.normalize8;
/* */	var c24 = Math.normalize24;


/* customize below */
var sModeOfFBO = "CNDNSN";//to turn of the frame buffer //C[NTR]D[NTR]S[NTR]//Žg‚í‚È‚¢
var colorBufferModeOfFBO = myFBOs.none;//[none | colorBufferModeIsRGBA4444 | colorBufferModeIsRGBA5551 | colorBufferModeIsALPHA]
var controllColorDepthStencilOfFBO = function(gl){

	/** BLEND ‚±‚ÌŒø‰Ê‚Íalpha<1.0‚Ì‚Æ‚«‚ÉŒ»‚ê‚Ü‚·B**/
	gl.disable(gl.BLEND);

	/** COLOR **/
	gl.colorMask(true,true,true,true);

	/** DEPTH **/
	gl.disable(gl.DEPTH_TEST);

	/** STENCIL **/
	gl.disable(gl.STENCIL_TEST);

};


var fs = (function(){/*
	uniform sampler2D uSampler;//color buffer of source

	varying mediump vec2 vCoord;
	void main(void){

		gl_FragColor = vec4(texture2D(uSampler,vCoord).rgb,1.0);

	}
*/});

var vs = (function(){/*
	attribute vec2 aVertexPosition;

	varying mediump vec2 vCoord;
	vec2 toCoord(vec4 pos){
		mat4 toCoordMatrix = mat4(0.5/pos.w , 0.0 , 0.0 , 0.0 , 0.0 , -0.5/pos.w , 0.0 , 0.0 , 0.0 , 0.0 , 0.0 , 0.0 , 0.5 , 0.5 , 0.0 , 1.0);
		vec4 coord = toCoordMatrix * pos;	
		return coord.xy;
	}
	void main(void){
		
		//vCoord = vec2(aVertexPosition.x * 0.5 + 0.5,-aVertexPosition.y * 0.5 + 0.5);
		vCoord = toCoord(vec4(aVertexPosition,0.0,1.0));
		gl_Position = vec4(aVertexPosition,0.0,1.0);//x y z w

	}
*/});

fs = fs.toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1];//.replace(/\n/g,BR).replace(/\r/g,"");
vs = vs.toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1];//.replace(/\n/g,BR).replace(/\r/g,"");

var aAttribs = [
	"aVertexPosition"
];
var aUniforms = [
	"uSampler"
];

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
/* */	myFBOs.create(sNameOfShader,sModeOfFBO,colorBufferModeOfFBO,controllColorDepthStencilOfFBO);//null---Color buffer is not to use.
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
/* */})();
