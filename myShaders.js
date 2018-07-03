libFileRelationship.create('myShaders');
libFileRelationship.myShaders.relatedTo='myInfo';


/**
 * make shader
*/
(function(){
//:myshaders
	myShaders = { };

	/** Property **/
	Object.defineProperty(myShaders,'createFromHTMLElement',{value:createFromTag,writable:false,enumerable:false,configurable:false});
	function createFromTag(gl,sName,sIdVertex,sIdFragment){
		var oVertexShader = getShaderFromTag(gl,sIdVertex);
		var oFragmentShader = getShaderFromTag(gl,sIdFragment);
		Object.defineProperty(myShaders,sName,{value:new Shader(sName,oVertexShader,oFragmentShader,gl),writable:false,enumerable:true,configrable:false});
	};
	Object.defineProperty(myShaders,'create',{value:createFromVariables,writable:false,enumerable:false,configurable:false});
	function createFromVariables(sName,sVertexShader,sFragmentShader,aAttribVariables,aUniformVariables){
		Object.defineProperty(myShaders,sName,{value:new Shader(sName,sVertexShader,sFragmentShader,aAttribVariables,aUniformVariables),writable:false,enumerable:true,configrable:false});
	};
	/** inner class **/
	var Shader = function(sNameShader,sVertexShader,sFragmentShader,aAttribVariables,aUniformVariables){
		this.gl = null;
		this.program = null;
		this.programName = sNameShader;
		this.sVertexShader = sVertexShader;
		this.sFragmentShader = sFragmentShader;
		this.aAttribVariables = aAttribVariables;
		this.aUniformVariables = aUniformVariables;
		this.attrib = { };
		this.uniform = { };
	};
	Shader.prototype.attach = function(gl){

		this.gl = gl;

		//compile
		var oVertexShader = compile(gl,gl.VERTEX_SHADER,this.sVertexShader,this.programName + "- vertex shader");
		var oFragmentShader = compile(gl,gl.FRAGMENT_SHADER,this.sFragmentShader,this.programName + "- fragment shader");

		//make shader program
		var shaderProgram = gl.createProgram();
		gl.attachShader(shaderProgram,oVertexShader);
		gl.attachShader(shaderProgram,oFragmentShader);
		gl.linkProgram(shaderProgram);

		//alert in case of falure
		if(!gl.getProgramParameter(shaderProgram,gl.LINK_STATUS)){
			alert("can't link both of the shaders vs:'"+this.programName + "- vertex shader"+"',fs:'"+this.programName + "- fragment shader"+"'");
			this.program = null;
		}else{
			this.program = shaderProgram;
			this.program._name = this.programName;
		}
		var ii;
		for(ii in this.aAttribVariables)this.getAttribLocation(this.aAttribVariables[ii]);
		for(ii in this.aUniformVariables)this.getUniformLocation(this.aUniformVariables[ii]);
	};
	Shader.prototype.activate = function(){
		if(this.program==null){
			alert("can't activate program '"+this.programName+"'");
		}else{
			this.gl.useProgram(this.program);
		}
	};

	/** inner function 1 **/
	function getShaderFromTag(gl,id){
		var shaderScript,theSource,currentChild,shadertype;

		shaderScript = document.getElementById(id);

		if(!shaderScript) {
			return null;
		}

		theSource = "";
		currentChild = shaderScript.firstChild;

		while(currentChild) {
			if(currentChild.nodeType == currentChild.TEXT_NODE){
				theSource += currentChild.textContent;
			}
			currentChild = currentChild.nextSibling;
		}

		if (shaderScript.type == "x-shader/x-fragment"){
			shadertype = gl.FRAGMENT_SHADER;
		} else if (shaderScript.type == "x-shader/x-vertex"){
			shadertype = gl.VERTEX_SHADER;
		} else {
			// unknown html tag type
//●			myInfo.main.error="Unknown html tag type for shader.The element type of shader program must be 'x-shader/x-vertex' or 'x-shader/x-fragment' now.";
			return null;
		}
		return compile(gl,shadertype,theSource,id);

	};
	/** inner function 2 **/
	function compile(gl,shadertype,theSource,sNameOfSource){

		var shader = gl.createShader(shadertype);

		gl.shaderSource(shader,theSource);

		gl.compileShader(shader);

		//recognize whether success to compile or not
		if (!gl.getShaderParameter(shader,gl.COMPILE_STATUS)) {
			alert("Shader compile error occured in " + sNameOfSource + " " + gl.getShaderInfoLog(shader));
			return null;
		}
		return shader;
	};


//●lll .attribとか.uniformとか、どうせ変数名は一意に決まるものなのだから、分けなくてよくね？

	/** For ATTRIBUTE variable **/
	Shader.prototype.getAttribLocation = function(sNameVariable){
		Object.defineProperty(this.attrib,sNameVariable,{value:new AttribVariable(this.gl,this.program,sNameVariable,this.programName),writable:false,enumerable:true,configurable:false});
	};
	/** inner class **/
	const normalize = false;
	const stride = 0;//shaderを呼び出すごとに進むバイト数//これは(buffer.slice((offset + i) * stride,size);)という意味
	const offset = 0;
	var AttribVariable = function(gl,prog,name,progName){
		this.gl = gl;
		this.loc = gl.getAttribLocation(prog,name);
		if(this.loc == -1 || this.loc == null){
//●			myInfo.main.error="Can't initialize attribute type of '"+name+"' variable, such that it's not used nor exist in '"+progName+"' shader.";
		} else {
			//●//●myInfo.main.info="'"+name+"' was enabled in '"+progName+"' program.";
		}
	};
	var flagError = false;
	AttribVariable.prototype.assignBuffer = function(buffer,numComponents){
		if(buffer==void 0 && !flagError){
//●			myInfo.main.error="buffer="+buffer+" in AttribVariable.prototype.assinBuffer()";
			flagError = true;
			stop();
		};
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER,buffer);
		this.gl.enableVertexAttribArray(this.loc);
		this.gl.vertexAttribPointer(this.loc,numComponents,this.gl.FLOAT,normalize,stride,offset);

//console.log("arrayBuffer=",this.gl.getParameter(this.gl.ARRAY_BUFFER_BINDING)," was pointed");
	};
	AttribVariable.prototype.assignArray = function(arr,numComponents){
		var buff = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER,buff);
		this.gl.bufferData(this.gl.ARRAY_BUFFER,new Float32Array(arr),this.gl.STATIC_DRAW);
		this.gl.enableVertexAttribArray(this.loc);
		this.gl.vertexAttribPointer(this.loc,numComponents,this.gl.FLOAT,normalize,stride,offset);
	};


	/** For UNIFORM variable **/
	Shader.prototype.getUniformLocation = function(sNameVariable){
		Object.defineProperty(this.uniform,sNameVariable,{value:new UniformVariable(this.gl,this.program,sNameVariable,this.programName),writable:false,enumerable:true,configurable:false});
	};
	/** inner class **/
	var UniformVariable = function(gl,prog,name,progName){
		this.gl = gl;
		this.loc = gl.getUniformLocation(prog,name);
		this._name = name;
		this._prog = prog;
		if(this.loc == -1 || this.loc == null){
//●			myInfo.main.error="Can't initialize uniform type of '"+name+"' variable, such that it's not used nor exist in '"+progName+"' shader.";
			stop();
		}
	};
	UniformVariable.prototype.sendFloat32Array = function(arr){
		this.gl.uniformMatrix4fv(this.loc,false,new Float32Array(arr));
	};
	UniformVariable.prototype.sendInt = function(value){
		this.gl.uniform1i(this.loc,value);
	};
	UniformVariable.prototype.sendFloat = function(value){
		this.gl.uniform1f(this.loc,value);
	};
	UniformVariable.prototype.sendFloat8 = function(num8){
		this.gl.uniform1f(this.loc,num8 / 255.0);//  (num8) ÷ (0xFF)
	};
})();
