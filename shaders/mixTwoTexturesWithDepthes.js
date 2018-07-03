/* */(function(){

var sNameOfShader = "mixTwoTexturesWithDepthes";
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

	var sModeOfFBO = "CNDNSN";//to turn of the frame buffer //C[NTR]D[NTR]S[NTR]
	var colorBufferModeOfFBO = myFBOs.none;//[none | colorBufferModeIsRGBA4444 | colorBufferModeIsRGBA5551 | colorBufferModeIsALPHA]
	var controllColorDepthStencilOfFBO = function(gl){

	/** BLEND この効果はalpha<1.0のときに現れます。**/
	gl.disable(gl.BLEND);//https://stackoverflow.com/questions/11633950/opengl-blend-modes-vs-shader-blending
//	gl.enable(gl.BLEND);
//	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);//テクスチャの黒は透過
	gl.blendFunc(gl.SRC_COLOR,gl.ONE_MINUS_SRC_COLOR);

	/** COLOR **/
	gl.colorMask(true,true,true,true);


	/** DEPTH **/
//	gl.disable(gl.DEPTH_TEST);
	gl.enable(gl.DEPTH_TEST);//shader内でgl_FragCoord.zを参照したいのだが===> 三角形のzが得られるだけ We can get z of this triangles
	gl.clearDepth(c24(0xFFFFFF));
//	gl.clearDepth(1.0);
	gl.clear(gl.DEPTH_BUFFER_BIT);
	gl.depthFunc(gl.LEQUAL);

//kkk shader内で新しいDEPTH BUFFER TEXTUREを作りたいよね!!!!gl_FragCoord.z = とすればよいのでしょうか?
//	やって、テストしてみましょうspaceShip shaderのやつを0.0にして、どうなるかを観察しましょう

	/** STENCIL **/
	gl.disable(gl.STENCIL_TEST);

	
};


var fs = (function(){/*
	uniform sampler2D uSampler0;//color buffer of source
	uniform sampler2D uSampler1;//depth buffer of source
	uniform sampler2D uSampler2;//color buffer of destination
	uniform sampler2D uSampler3;//depth buffer of destination(地)

	varying mediump vec2 vCoord;
	void main(void){
//gl.DEPTH_COMPONENT16
//gl.DEPTH24_STENCIL8 <===It's high quality for DEPTH_TESTing to draw objects which have z coordinate each other.

		//.rだけに16bitすべてが入っています。g,b,aはゼロです;.r contains all 16 bit. g, b and a has zero value each other.

		highp float depthSource = texture2D(uSampler1,vCoord).r * 16777216.0;
		highp float depthDestination = texture2D(uSampler3,vCoord).r * 16777216.0;

		//gl_FragCoord.zは現在渡されているrectangleのもの(aVertexPositionから計算したもの)だから、画面上のものとは別物。!!!!!!!!!
		//だから、以前に描いたもののDEPTHと比べたいときには以前描いたもののDEPTH TEXTUREを用意して、それと比べなければならない

		//16ビットなので、texelに65536を描けると整数になります probablement
//		if(depthSource * 65536.0 > depthDestination * 65536.0){
		if(depthSource < depthDestination){
			gl_FragColor = vec4(texture2D(uSampler0,vCoord).rgb,1.0);
		}else{
			gl_FragColor = vec4(texture2D(uSampler2,vCoord).rgb,1.0);
//			discard;
		}
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
	"uSampler1",
	"uSampler2",
	"uSampler3"
];
var funcShader = function(){
	myShaders.create(sNameOfShader,vs,fs,aAttribs,aUniforms);
};
if('myShaders' in window){
	console.log(sNameOfShader + "---ok1---created in myShaders");
	funcShader();
}else{
	var count = 0;
	var hoge = setInterval(function(){
		if(++count > 1000){
			clearInterval(hoge);
			console.error("Can't create myShaders."+sNameOfShader);
		}
		if('myShaders' in window){
			clearInterval(hoge);
			console.log(sNameOfShader + "---ok2---created in myShaders");
			funcShader();
		}
	},1);
}
var funcFBO = function(){
	myFBOs.create(sNameOfShader,sModeOfFBO,colorBufferModeOfFBO,controllColorDepthStencilOfFBO);//null---Color buffer is not to use.
};
if('myFBOs' in window){
	console.log(sNameOfShader + "---ok1---created in myShaders");
	funcFBO();
}else{
	var count = 0;
	var hoge = setInterval(function(){
		if(++count > 1000){
			clearInterval(hoge);
			console.error("Can't create myShaders."+sNameOfShader);
		}
		if('myShaders' in window){
			clearInterval(hoge);
			console.log(sNameOfShader + "---ok2---created in myShaders");
			funcFBO();
		}
	},1);
}

})();
