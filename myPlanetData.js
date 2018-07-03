libFileRelationship.create('UnitsToDraw');
libFileRelationship['UnitsToDraw'].relatedTo='myLabel';


/* all the things to be wanted to draw must be thrown into 'oModel',e.g. shape or text with its position x,y,z*/
(function(){
/*
	UnitsToDraw-----+---------------(join)   <-function join     enumerable:false
			|
			+---------------plane    <-class Toolkit     enumerable:true
			|
			+---------------sun      <-class Toolkit     enumerable:true
			|
			+---------------earth    <-class Toolkit     enumerable:true
			.
			.
			.
*/


	UnitsToDraw = { };
	Object.defineProperty(UnitsToDraw,'join',{value:join,writable:false,enumerable:false,configurable:false});	
	function join(gl,sName,sNameTexture,shape,oMatrices,oValues){
		Object.defineProperty(UnitsToDraw,sName,{value:new ToolBox(gl,sName,sNameTexture,shape,oMatrices,oValues),writable:false,enumerable:true,configurable:false});
	}


	//
	//@param {myShape.obj} shape in which there are points,color,normal vector,indeces and so on
	//
	function ToolBox(gl,sName,sNameTexture,shape,oMatrices,oValues){
		this.sName = sName;
		this.gl = gl;

		/** matrix */
		this.aAccumeUnits = oMatrices.modelView;
		this.aAccumeUnitsLightDirectional = oMatrices.manipulatedRotation;//aLightsDirectional;
		this.aAccumeUnitsLightPoint = oMatrices.manipulated;//aLightsPoint;
		this.aMatricesNotManipulated=oMatrices.notManipulated;//aMatricesNotManipulated;

		/** value **/
		this.brightness = oValues.brightness;
		this.alpha = oValues.alpha;
		this.baseLight = oValues.baseLight;
		this.cassiniFactor = oValues.cassiniFactor;
		/** label **/
		this.labels = myLabel[sName];
		/** texture **/
		this.nameTexture = sNameTexture;
		/** shape **/
		this.draw = shape.draw;
		this.shape = shape;
		this.buffers = createBuffers(gl,shape,sName);


	};
	ToolBox.prototype.changeShape = function(shape){
		this.draw = shape.draw;
		this.buffers = createBuffers(this.gl,shape,this.sName);
	};

	/** inner function**/
	function createBuffers(gl,shape,sName){
		//生成したバッファをWebGLBufferにバインドしたら、
		//あとはそれにvertexのattributionをbufferDataを使って
		//頂点の座標、頂点の色、テキストデータなどをバッファに放り込むだけ

		//position to buffer
		var buffPositions = gl.createBuffer();
		buffPositions._name = sName+"-Position:"+shape.name;
		gl.bindBuffer(gl.ARRAY_BUFFER,buffPositions);
		gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(shape.pos),gl.STATIC_DRAW);

		//normal vectors to buffer//●
		var buffNormal = gl.createBuffer();
		buffNormal._name = sName+"-Normal:"+shape.name;
		gl.bindBuffer(gl.ARRAY_BUFFER,buffNormal);
		gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(shape.nor),gl.STATIC_DRAW);

		//color to buffer
		var buffColors = gl.createBuffer();//正方形のvertices
		buffColors._name = sName + "-Colors:"+shape.name;
		gl.bindBuffer(gl.ARRAY_BUFFER,buffColors);
		gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(shape.col),gl.STATIC_DRAW);

		//texture position to buffer
		var buffTextureCoordinate = gl.createBuffer();
		buffTextureCoordinate._name = sName+"-Texturecoord:"+shape.name;
		gl.bindBuffer(gl.ARRAY_BUFFER,buffTextureCoordinate);
		gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(shape.tex),gl.STATIC_DRAW);

		//indices to ELEMENT buffer
		var buffIndex = gl.createBuffer();
		buffIndex._name = sName + "-Index:"+shape.name;
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,buffIndex);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(shape.ind),gl.STATIC_DRAW);

		return {
			position : buffPositions,
			texture : buffTextureCoordinate,
			normal : buffNormal,
			color : buffColors,
			bindElement : function(){gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,buffIndex)}
		};
	};



})();//UnitsToDraw
