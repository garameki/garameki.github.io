libFileRelationship.create('myTextures');
libFileRelationship.myTextures.relatedTo='myInfo';

//******************************* TEXTURE ******************************************************


/**
 *for managing texture files and its entity only one object below
*/
(function(){

		//reference
		//https://stackoverflow.com/questions/11292599/how-to-use-multiple-textures-in-webgl
		//https://stackoverflow.com/questions/8688600/context-getimagedata-on-localhost
	/** inner class **/
	var Texture = function(gl,sName){
		this.gl = gl;
		this.texture = gl.createTexture();
		this.texture._name = sName;
		console.log("myTextures.js  this.texture=",this.texture);
		this.readyImage = false;
	};
	Texture.prototype.activate = function(num){
		this.gl.activeTexture(this.gl.TEXTURE0 + Number(num));//https://stackoverflow.com/questions/11292599/how-to-use-multiple-textures-in-webgl toji answered
		this.gl.bindTexture(this.gl.TEXTURE_2D,this.texture);
	};

	function nearestGreaterOrEqualPowerOf2(v) {
	  return Math.pow(2, Math.ceil(Math.log2(v)));
	}
	Texture.prototype.readFile = function(filename){
		var gl = this.gl;
		var image = new Image();
		image.src = rootHTTPImages+filename;//via server
		var myself = this;
		image.onload = function (){
			myself.readyImage = true;

			var size = image.naturalWidth*image.naturalHeight;
			if(size > Number(gl.getParameter(gl.MAX_TEXTURE_SIZE))){
//				myInfo.main.caution="The size is over  '"+filename+"' "+size;
			}
			gl.bindTexture(gl.TEXTURE_2D,myself.texture);
			if(false){
				//https://webglfundamentals.org/webgl/lessons/webgl-2-textures.html
				gl.texParameteri (gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
				gl.texParameteri (gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR_MIPMAP_NEAREST);//gl.TEXTURE_2Dにbit演算している？gl.ACTIVE_TEXTURE
				gl.texImage2D    (gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,image);
				gl.generateMipmap(gl.TEXTURE_2D);//gl.TEXTURE_2Dをmipmapに適用
			}else{
				//https://stackoverflow.com/questions/46931351/how-to-add-interpolation-using-webgl-vertex-and-fragment-shaders-to-the-image
				const newWidth = nearestGreaterOrEqualPowerOf2(image.width);
				const newHeight = nearestGreaterOrEqualPowerOf2(image.height);
				gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, newWidth, newHeight, 0, gl.RGB, gl.UNSIGNED_BYTE, null);
				gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, gl.RGB, gl.UNSIGNED_BYTE, image);
				gl.generateMipmap(gl.TEXTURE_2D);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);			//gl.CLAMP_TO_EDGE);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);			//gl.CLAMP_TO_EDGE);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);

			}//boolean


		};

	};
	Texture.prototype.import = function(texture){
		this.texture = texture;
	};

	
	//textures
	myTextures = { };

	var rootHTTPImages = "textures/";//default

	Object.defineProperty(myTextures,'changeRoot',{value:changeRootForImage,writable:false,enumerable:false,configurable:false});
	function changeRootForImage(sFolda){
		rootHTTPImages = sFolda;
		//code to recognize whether it exists or not
	};

	Object.defineProperty(myTextures,'join',{value:join,writable:false,enumerable:false,configurable:false});
	function join(gl,sName){
		var instance = new Texture(gl,sName);
		Object.defineProperty(myTextures,sName,{value:instance,writable:false,enumerable:true,configurable:false});
//		instance.readFile();
	};

})();//myTextures





/*	a trivia how to use prentheses () with '||'
// recycling same object
function withValue(value) {
  var d = withValue.d || (
    withValue.d = {
      enumerable: false,
      writable: false,
      configurable: false,
      value: null
    }
  );
  d.value = value;
  return d;
}
// ... and ...
Object.defineProperty(obj, 'key', withValue('static'));
*/


