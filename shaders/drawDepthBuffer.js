/* */(function(){

var sNameOfShader = "drawTextureOfDepthBuffer";
libFileRelationship.create(sNameOfShader);
libFileRelationship[sNameOfShader].relatedTo='myShaders';



/**
 *	デプスバッファを補正して、カラーとして表示します。
 *	To draw the texture of depth buffer as the texture of color buffer
**/


var fs = (function(){/*
	uniform sampler2D uSampler;//color buffer

	varying lowp vec2 vCoord;
	void main(void){
		lowp float newCoordX = (vCoord.x + 1.0) * 0.5;
		lowp float newCoordY = (-vCoord.y + 1.0) * 0.5;
		lowp vec2 newCoord = vec2(newCoordX,newCoordY);

		lowp vec3 depth = texture2D(uSampler,newCoord).rgb;

		gl_FragColor = vec4((depth - vec3(0.9998)) * 5000.0,1.0);//遠いものよりも近いもの方がDEPTHが細かく感じられる

	//	discard;
	}
*/});

var vs = (function(){/*
	attribute vec2 aVertexPosition;

	varying lowp vec2 vCoord;
	void main(void){
		
		gl_Position = vec4(aVertexPosition,0.0,1.0);//x y z w
		vCoord = aVertexPosition.xy;
	}
*/});

fs = fs.toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1];//.replace(/\n/g,BR).replace(/\r/g,"");
vs = vs.toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1];//.replace(/\n/g,BR).replace(/\r/g,"");
var aAttribs = ["aVertexPosition"];
var aUniforms = ["uSampler"];

if('myShaders' in window){
	console.log(sNameOfShader + "---ok1---created in myShaders");
	myShaders.create(sNameOfShader,vs,fs,aAttribs,aUniforms);
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
			myShaders.create(sNameOfShader,vs,fs,aAttribs,aUniforms);
		}
	},1);
}

/* */})();

