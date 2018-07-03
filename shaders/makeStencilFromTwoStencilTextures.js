/* */(function(){

var sNameOfShader = "makeStencilFromTwoStencilTextures";
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
 *	二つのテクスチャーをデプステストありでクリップ空間に描く(それぞれのデプスバッファテクスチャーが必要です(24bit))
 *	To draw two textures with depth test (according to each depth texture(24bit) to 'depth test')
**/





/* customize below */
var sModeOfFBO = "CTDNSN";//to turn of the frame buffer //C[NTR]D[NTR]S[NTR]//使わない
var colorBufferModeOfFBO = myFBOs.colorBufferModeIsR8ForStencil;//[none | colorBufferModeIsRGBA4444 | colorBufferModeIsRGBA5551 | colorBufferModeIsALPHA | colorBufferModeIsR8ForStencil]
var controllColorDepthStencilOfFBO = function(gl){

	/** BLEND この効果はalpha<1.0のときに現れます。**/
	gl.disable(gl.BLEND);

	/** COLOR **/
	gl.colorMask(true,false,false,false);
	gl.clearColor(c8(0xFF),c8(0x00),c8(0x00),c8(0x00));
	gl.clear(gl.COLOR_BUFFER_BIT);

	/** DEPTH **/
	gl.disable(gl.DEPTH_TEST);

	/** STENCIL **/
	gl.disable(gl.STENCIL_TEST);

};


var fs = (function(){/*
	uniform sampler2D uSampler0;//stencil buffer of source
	uniform sampler2D uSampler1;//stencil buffer of source
	varying mediump vec2 vCoord;

	//original AND function from https://gist.github.com/EliCDavis/f35a9e4afb8e1c9ae94cce8f3c2c9b9aint
	lowp int AND(lowp float n1,lowp float n2){
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
	lowp int OR(lowp int n1, lowp int n2){
	    lowp float v1 = float(n1);
	    lowp float v2 = float(n2);
	    lowp int byteVal = 1;
	    lowp int result = 0;
	    for(int i = 0; i < 32; i++){
	        bool keepGoing = v1>0.0 || v2 > 0.0;
	        if(keepGoing){
	            bool addOn = mod(v1, 2.0) > 0.0 || mod(v2, 2.0) > 0.0;
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
	void main(void){

		lowp int ref0 = int(texture2D(uSampler0,vCoord).r * 256.0);
		lowp int ref1 = int(texture2D(uSampler1,vCoord).r * 256.0);

		gl_FragColor = vec4(float(OR(ref0,ref1)) / 256.0,0.0,0.0,0.0);//because of using gl.R8 as INTERNALFORMAT 
	}
*/});

var vs = (function(){/*
	attribute vec2 aVertexPosition;

	varying mediump vec2 vCoord;
	void main(void){
		
		vCoord = aVertexPosition.xy * 0.5 + 0.5;
		gl_Position = vec4(aVertexPosition,0.0,1.0);//x y z w

	}
*/});

fs = fs.toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1];//.replace(/\n/g,BR).replace(/\r/g,"");
vs = vs.toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1];//.replace(/\n/g,BR).replace(/\r/g,"");

var aAttribs = [
	"aVertexPosition"
];
var aUniforms = [
	"uSampler0",
	"uSampler1"
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
