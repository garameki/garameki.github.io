libFileRelationship.create('myFBOs');
libFileRelationship.myFBOs.relatedTo='myInfo';


//******************************************** framebuffer **********************************************
/************************************************with****************************************************
//********************************** texture buffers & render buffer*************************************
/**
 *make render buffer with frame buffer and texture of void
*/
(function(){
//:myFBOs

	//問題はmyShaderと一緒に定義するときにはまだglが決まっていないことである

	myFBOs = { };
	Object.defineProperty(myFBOs,'create',{value:create,writable:false,enumerable:false,configurable:false});
	function create(sName,sMode,oColorBufferMode,funcControlCDS){
		Object.defineProperty(myFBOs,sName,{value:new FBO(sName,sMode,oColorBufferMode,funcControlCDS),writable:false,enumerable:true,configurable:true});
	};
	Object.defineProperty(myFBOs,'free',{value:free,enumerable:false,configurable:false});
	function free(){
		for(var name in myFBOs){
			myFBOs[name].deleteTextures();
			myFBOs[name].inactivate();
		}
	};

	/** the structure of color buffer mode using texImage2D **/
	var obj0 = null;
	var obj1 = {
		internalFormat:function(gl){return gl.RGBA;},
		format:function(gl){return gl.RGBA;},
		type:function(gl){return gl.UNSIGNED_SHORT_4_4_4_4;}
	};
	var obj2 = {
		internalFormat:function(gl){return gl.RGBA;},
		format:function(gl){return gl.RGBA;},
		type:function(gl){return gl.UNSIGNED_SHORT_5_5_5_1;}
	};
	var obj3 = {
		internalFormat:function(gl){return gl.ALPHA;},
		format:function(gl){return gl.ALPHA;},
		type:function(gl){return gl.UNSIGNED_BYTE;}
	};
	var obj4 = {
		internalFormat:function(gl){return gl.R8;},
		format:function(gl){return gl.RED;},
		type:function(gl){return gl.UNSIGNED_BYTE;}
	};
	
	Object.defineProperty(myFBOs,'none',{value:obj0,enumerable:false,configurable:false});
	Object.defineProperty(myFBOs,'colorBufferModeIsRGBA4444',{value:obj1,enumerable:false,configurable:false});
	Object.defineProperty(myFBOs,'colorBufferModeIsRGBA5551',{value:obj2,enumerable:false,configurable:false});
	Object.defineProperty(myFBOs,'colorBufferModeIsALPHA'	,{value:obj3,enumerable:false,configurable:false});
	Object.defineProperty(myFBOs,'colorBufferModeIsR8ForStencil',{value:obj4,enumerable:false,configurable:false});
	

	//reference
	//https://wgld.org/d/webgl/w051.html
	//http://www.chinedufn.com/webgl-shadow-mapping-tutorial/
	//https://stackoverflow.com/questions/41824631/how-to-work-with-framebuffers-in-webgl/41832778#41832778
	//http://www.wakayama-u.ac.jp/~tokoi/lecture/gg/ggnote13.pdf
	//http://www.songho.ca/opengl/gl_fbo.html
	/** inner class **/
	  //Texture, Framebuffer and Renderbuffer are necessary at once.
	var FBO = function(sName,sMode,oColorBufferMode,funcControlBCDS){
		//context
		this.gl = null;

		//definition of characteristic of this instance
		if(oColorBufferMode == null || oColorBufferMode == void 0)colorBufferMode = null;
		this.name = sName;
		this.sMode = sMode;
		this.oColorBufferMode = oColorBufferMode;
		this.funcControlBCDS = funcControlBCDS;
	

		//buffer
		this.framebuffer = null;
		this.renderbuffer = null;

		//buffer size
		this.buffWidth = null;
		this.buffHeight = null;

		//the setting before activation calling
		this.colorMasks = void 0;
		this.depthTest = void 0;
		this.stencilTest = void 0;

		//the textures using as buffer
		this.textureColorBuffer = null;
		this.textureDepthBuffer = null;
		this.textureStencilBuffer = null;
	};
	FBO.prototype.initialize = function(gl,buffWidth,buffHeight){
		if(this.gl!=null){
			if(this.framebuffer)this.gl.deleteFramebuffer(this.framebuffer);
			if(this.renderbuffer)this.gl.deleteRenderbuffer(this.renderbuffer);
			if(this.textureColorBuffer)this.gl.deleteTexture(this.textureColorBuffer);
			if(this.textureDepthBuffer)this.gl.deleteTexture(this.textureDepthBuffer);
			if(this.textureStencilBuffer)this.gl.deleteTexture(this.textureStencilBuffer);
		}
		this.gl = gl;
		this.framebuffer = gl.createFramebuffer();
		this.framebuffer._name = "framebuffer";
		this.renderbuffer = gl.createRenderbuffer();
		this.renderbuffer._name = "renderbuffer";
		var size = buffWidth * buffHeight;
//●		if(size > gl.getParameter(gl.MAX_RENDERBUFFER_SIZE))myInfo.main.caution = "framebuffer size is too large "+size;
		this.buffWidth = buffWidth;
		this.buffHeight = buffHeight;
	};

//{kkk
//	http://www.wakayama-u.ac.jp/~tokoi/lecture/gg/ggnote13.pdf
//	これらを入れれば、viewportのサイズを画面と同じにしなくてもいいのではないだろうか？==>どうやらちがうみたい。「繰り返ししない」ということみたいだ。https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter
//	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S,
//	GL_CLAMP_TO_EDGE);
//	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T,
//	GL_CLAMP_TO_EDGE);
//}

	FBO.prototype.initializeTextureColorBuffer = function(){
		/** prepare texture rendered into **/
		var gl = this.gl;
		if(this.textureColorBuffer)gl.deleteTexture(this.textureColorBuffer);
		this.textureColorBuffer = gl.createTexture();
		this.textureColorBuffer._name = "FramebufferColor";
			gl.bindTexture(gl.TEXTURE_2D,this.textureColorBuffer);//-->gl.TEXTURE[?]
			gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST);//kkk
			gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST);//kkk
//unchangable is not convenient				
//gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA ,this.buffWidth,this.buffHeight,0,gl.RGBA ,gl.UNSIGNED_SHORT_4_4_4_4,null);//pass no image into gl.TEXT[\d+]
//gl.texImage2D(  gl.TEXTURE_2D,0,gl.ALPHA,this.buffWidth,this.buffHeight,0,gl.ALPHA,gl.UNSIGNED_BYTE         ,null);//pass no image into gl.TEXT[\d+]
		gl.texImage2D(gl.TEXTURE_2D,0,this.oColorBufferMode.internalFormat(gl),this.buffWidth,this.buffHeight,0,this.oColorBufferMode.format(gl),this.oColorBufferMode.type(gl),null);//pass no image into gl.TEXT[\d+]


	};
//reference of CAUTION 4.1.5 Framebuffer Object Attachments ------ https://www.khronos.org/registry/webgl/specs/latest/2.0/#TEXTURE_TYPES_FORMATS_FROM_DOM_ELEMENTS_TABLE
	FBO.prototype.initializeTextureDepthBuffer = function(){
		/** prepare texture rendered into **/
		//https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_depth_texture
		var gl = this.gl;
		if(this.textureDepthBuffer)gl.deleteTexture(this.textureDepthBuffer);
		this.textureDepthBuffer = gl.createTexture();
		this.textureDepthBuffer._name = "FramebufferDepth";
			gl.bindTexture(gl.TEXTURE_2D,this.textureDepthBuffer);//-->gl.TEXTURE[?]
			gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST);//kkk
			gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST);//kkk
//low quality to render	gl.texImage2D(gl.TEXTURE_2D,0,gl.DEPTH_COMPONENT16,this.buffWidth,this.buffHeight,0,gl.DEPTH_COMPONENT,gl.UNSIGNED_INT,null);//pass no image into gl.TEXT[\d+]
			gl.texImage2D(gl.TEXTURE_2D,0,gl.DEPTH24_STENCIL8,this.buffWidth,this.buffHeight,0,gl.DEPTH_STENCIL,gl.UNSIGNED_INT_24_8,null);//pass no image into gl.TEXT[\d+]
	};
	FBO.prototype.initializeTextureStencilBuffer = function(gl){
		/** prepare texture rendered into **/
		//https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_depth_texture
		var gl = this.gl;
		if(this.textureStencilBuffer)gl.deleteTexture(this.textureStencilBuffer);
		this.textureStencilBuffer = gl.createTexture();
		this.textureStencilBuffer._name = "FramebufferStencil";
			gl.bindTexture(gl.TEXTURE_2D,this.textureStencilBuffer);//-->gl.TEXTURE[?]
			gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST);//kkk
			gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST);//kkk
			gl.texImage2D(gl.TEXTURE_2D,0,gl.DEPTH24_STENCIL8,this.buffWidth,this.buffHeight,0,gl.DEPTH_STENCIL,gl.UNSIGNED_INT_24_8,null);//pass no image into gl.TEXT[\d+]
	};
	FBO.prototype.activate = function(mode){

		//注意CNDNSNでもviewportは変化しますので、使い終わったら.inactivate()を実行してください

		var sMode;
		if(mode == null || mode == void 0){
			sMode = this.sMode;
		}else{
			sMode = mode;
		}

		var gl = this.gl;

		//reference
		//http://www.wakayama-u.ac.jp/~tokoi/lecture/gg/ggnote13.pdf
		// ビューポートをフレームバッファオブジェクトのサイズに合わせる
		//glViewport(0 --- x coord in canvas, 0 --- y coord in canvas, fboWidth, fboHeight);
		gl.viewport(0,0,this.buffWidth,this.buffHeight);

		//for resetting up at the time of inactivation()
		this.colorMasks =  gl.getParameter(gl.COLOR_WRITEMASK);
		this.depthTest =   gl.getParameter(gl.DEPTH_TEST);
		this.stencilTest = gl.getParameter(gl.STENCIL_TEST);//kkk他にもいっぱい種類あるぞ...https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getParameter

//console.log("viewport-FBO:",this.vWidth,this.vHeight);

		var matches,nameBuff;
		matches = sMode.match(/C[NTR]D[NTR]S[NTR]|C[NTR]S[NTR]D[NTR]|D[NTR]C[NTR]S[NTR]|D[NTR]S[NTR]C[NTR]|S[NTR]C[NTR]D[NTR]|S[NTR]D[NTR]C[NTR]/g);
		if(matches == null){
//●			myInfo.main.error = "FBO.*.activate('HERE') 's HERE is wrong strings";
			return;
		}
		matches = sMode.match(/CNDNSN/);
		if(matches == null){
			gl.bindFramebuffer(gl.FRAMEBUFFER,this.framebuffer);
		} else {
			gl.bindFramebuffer(gl.FRAMEBUFFER,null);
			this.funcControlBCDS(gl);//shaderフォルダの中で定義されたものがこのクラスに渡されているはず
			return;//******** return ************
		}
		matches = sMode.match(/CR/);
		if(matches != null){
			matches = sMode.match(/DR|SR/);
			if(matches != null){
//●				myInfo.main.error = "FBO.*.activate('HERE') 's HERE contains CR and, DR, SR or both";//レンダーバッファはカラーと他のものと一緒には使えない
				return;
			}
		}
		matches = sMode.match(/R/);
		if(matches == null){
			gl.bindRenderbuffer(gl.RENDERBUFFER,null);
		}else{
			gl.bindRenderbuffer(gl.RENDERBUFFER,this.renderbuffer);
		}

		nameBuff = "COLOR BUFFER ATTACHING TO :";
		matches = sMode.match(/C(.)/);
		var mode = matches[1];
		switch(mode){
			case "N":
				gl.colorMask(false,false,false,false);
//●				myInfo.main.colorbufferattach = nameBuff + "None";
				break;
			case "T":
				if(this.oColorBufferMode==myFBOs.none){
//●					myInfo.main.error = "Please specify the colorBufferMode of myFBOs."+this.name+".activate()";
				}else if(this.oColorBufferMode==void 0){
//●エ					myInfo.main.error = "Please check the colorBufferMode argument of myFBOs."+this.name+"which is 'undefined'.";
				}
				gl.colorMask(true,true,true,true);
				this.initializeTextureColorBuffer();
				gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D, this.textureColorBuffer, 0);


//●				myInfo.main.colorbufferattach = nameBuff + "Texture";
				break;
			case "R":
				gl.colorMask(true,true,true,true);
				gl.renderbufferStorage(gl.RENDERBUFFER,gl.RGBA4,this.buffWidth,this.buffHeight);
				gl.framebufferRenderbuffer(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.RENDERBUFFER,this.renderbuffer);//gl.DEPTH_ATTACHMENT--means-->bit format
//●				myInfo.main.colorbufferattach = nameBuff + "Renderbuffer";
				break;
			default:
		}
		matches = sMode.match(/DRSR|SRDR|DRC.SR|SRC.DR/g);
		if(matches != null){
			gl.enable(gl.DEPTH_TEST);
			gl.enable(gl.STENCIL_TEST);
			gl.renderbufferStorage(gl.RENDERBUFFER,gl.DEPTH_STENCIL,this.buffWidth,this.buffHeight);
			gl.framebufferRenderbuffer(gl.FRAMEBUFFER,gl.DEPTH_STENCIL_ATTACHMENT,gl.RENDERBUFFER,this.renderbuffer);
//●			myInfo.main.depthbufferattach = "  DEPTH BUFFER ATTACHING TO : Renderbuffer";
//●			myInfo.main.stencilbufferattach = "STENCIL BUFFER ATTACHING TO : Renderbuffer";
			this.funcControlBCDS(gl);//shaderフォルダの中で定義されたものがこのクラスに渡されているはず
			return;// *********** return **************
		}
		nameBuff = "DEPTH BUFFER ATTACHING TO : ";
		matches = sMode.match(/D(.)/);
		var mode = matches[1];
		switch(mode){
			case "N":
				gl.disable(gl.DEPTH_TEST);
//●				myInfo.main.depthbufferattach = nameBuff + "None";
				break;
			case "T":
				gl.enable(gl.DEPTH_TEST);
				this.initializeTextureDepthBuffer();
				gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT,gl.TEXTURE_2D, this.textureDepthBuffer, 0);
//●				myInfo.main.depthbufferattach = nameBuff + "Texture";
				break;
			case "R":
				gl.enable(gl.DEPTH_TEST);
				gl.renderbufferStorage(gl.RENDERBUFFER,gl.DEPTH_COMPONENT16,this.buffWidth,this.buffHeight);
				gl.framebufferRenderbuffer(gl.FRAMEBUFFER,gl.DEPTH_ATTACHMENT,gl.RENDERBUFFER,this.renderbuffer);//gl.DEPTH_ATTACHMENT--means-->bit format
//●				myInfo.main.depthbufferattach = nameBuff + "Renderbuffer";
				break;
			default:
		}
		nameBuff = "STENCIL BUFFER ATTACHING TO :";
		matches = sMode.match(/S(.)/);
		var mode = matches[1];
		switch(mode){
			case "N":
				gl.disable(gl.STENCIL_TEST);
//●				myInfo.main.stencilbufferattach = nameBuff + "None";
				break;
			case "T":
				gl.enable(gl.STENCIL_TEST);
				this.initializeTextureStencilBuffer();
				gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.STENCIL_ATTACHMENT,gl.TEXTURE_2D, this.textureStencilBuffer, 0);
//●				myInfo.main.stencilbufferattach = nameBuff + "Texture";
				break;
			case "R":
				gl.enable(gl.STENCIL_TEST);
				gl.renderbufferStorage(gl.RENDERBUFFER,gl.STENCIL_INDEX8,this.buffWidth,this.buffHeight);
				gl.framebufferRenderbuffer(gl.FRAMEBUFFER,gl.STENCIL_ATTACHMENT,gl.RENDERBUFFER,this.renderbuffer);//gl.DEPTH_ATTACHMENT--means-->bit format
//●				myInfo.main.stencilbufferattach = nameBuff + "Renderbuffer";
				break;
			default:
		}
		this.funcControlBCDS(gl);//shaderフォルダの中で定義されたものがこのクラスに渡されているはず
	};
	FBO.prototype.inactivate = function(){
		var gl=this.gl;
		gl.viewport(0,0,gl.canvas.width,gl.canvas.height);
//console.log("viewport-3:",gl.canvas.width,gl.canvas.height);
		gl.bindTexture(gl.TEXTURE_2D,null);
		gl.bindFramebuffer(gl.FRAMEBUFFER,null);
		gl.bindRenderbuffer(gl.RENDERBUFFER,null);

		if(this.colorMasks)gl.colorMask(this.colorMasks[0],this.colorMasks[1],this.colorMasks[2],this.colorMasks[3]);
		if(this.depthTest)gl.enable(gl.DEPTH_TEST);
		else gl.disable(gl.DEPTH_TEST);
		if(this.stencilTest)gl.enable(gl.STENCIL_TEST);
		else gl.disable(gl.STENCIL_TEST);
	};
	FBO.prototype.deleteTextures = function(){//kkk名前変えた方がいいreleaseTextruesとか。でも、initializeで自動的に前のがdeleteされるから、いらないかも==>いや、最終的には使い終わったらメモリを解放するべきだ。
	//lll	//https://github.com/KhronosGroup/WebGL/blob/master/sdk/tests/conformance/rendering/framebuffer-texture-clear.html
	//lll	this.gl.deleteTexture(this.textureColorBuffer);
	//lll	this.gl.deleteTexture(this.textureDepthBuffer);
	//lll	this.gl.deleteTexture(this.textureStencilBuffer);
	};
})();
