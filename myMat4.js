libFileRelationship.create('myMat4');

/**
*define matrixes
 *
 * This is specifid for 4x4 Matrix computation.
 *	The answer is re-restored to _a[1-4][1-4]. 
 *@variable {number} _nStacked    a number of being stacked
 *@variable {number} _det determinant
 *@variable {number} _x[1-4][1-4] a element of temporary result matrix
 *@variable {number} _s[1-4][1-4] a element of stack matrix to push and/or pull
 *@variable {number} _a[1-4][1-4] a element of accumerate matrix e.g. answer of a calculation like multiplication
 *
*/
(function(){
	//result
	var _x11=void 0,_x12=void 0,_x13=void 0,_x14=void 0,_x21=void 0,_x22=void 0,_x23=void 0,_x24=void 0,_x31=void 0,_x32=void 0,_x33=void 0,_x34=void 0,_x41=void 0,_x42=void 0,_x43=void 0,_x44=void 0;//target matrix
	//stack
	var _s11=void 0,_s12=void 0,_s13=void 0,_s14=void 0,_s21=void 0,_s22=void 0,_s23=void 0,_s24=void 0,_s31=void 0,_s32=void 0,_s33=void 0,_s34=void 0,_s41=void 0,_s42=void 0,_s43=void 0,_s44=void 0;//stack matrix
	//accumeration
	var _a11=void 0,_a12=void 0,_a13=void 0,_a14=void 0,_a21=void 0,_a22=void 0,_a23=void 0,_a24=void 0,_a31=void 0,_a32=void 0,_a33=void 0,_a34=void 0,_a41=void 0,_a42=void 0,_a43=void 0,_a44=void 0;//answer matrix


	//mymat4
	myMat4 = { };
	Object.defineProperty(myMat4,'loadIdentity'	,{value:prepareAM,writable:false,enumerable:true,configurable:false});
	Object.defineProperty(myMat4,'loadZero'		,{value:clearToZeroAM,writable:false,enumerable:true,configurable:false});
	Object.defineProperty(myMat4,'loadPerspective'	,{value:preparePM,writable:false,enumerable:true,configurable:false});
	Object.defineProperty(myMat4,'loadOrthography'	,{value:prepareOM,writable:false,enumerable:true,configurable:false});
	Object.defineProperty(myMat4,'trans'		,{value:translateAM,writable:false,enumerable:true,configurable:false});
	Object.defineProperty(myMat4,'rot'		,{value:rotateAM,writable:false,enumerable:true,configurable:false});
	Object.defineProperty(myMat4,'storeTo'		,{value:storeA44ToArray,writable:false,enumerable:true,configurable:false});
	Object.defineProperty(myMat4,'load'		,{value:loadToA44,writable:false,enumerable:true,configurable:false});
	Object.defineProperty(myMat4,'inverse'		,{value:inverseAM,writable:false,enumerable:true,configurable:false});
	Object.defineProperty(myMat4,'transpose'	,{value:transposeAM,writable:false,enumerable:true,configurable:false});

	Object.defineProperty(myMat4,'get2D'		,{value:getNew2DPosition,writable:false,enumerable:true,configurable:false});


	Object.defineProperty(myMat4,'get3D'		,{value:getNew3DPosition,writable:false,enumerable:true,configurable:false});
	function getNew3DPosition(x,y,z){
		var w=1;

		// P・_A = P`
		_x11=_a11*x+_a21*y+_a31*z+_a41*w;
		_x12=_a12*x+_a22*y+_a32*z+_a42*w;
		_x13=_a13*x+_a23*y+_a33*z+_a43*w;
		_x14=_a14*x+_a24*y+_a34*z+_a44*w;
		return [_x11,_x12,_x13];
/*

		// _A・P = P'
		_x11=_a11*x+_a12*y+_a13*z+_a14*w;
		_x21=_a21*x+_a22*y+_a23*z+_a24*w;
		_x31=_a31*x+_a32*y+_a33*z+_a34*w;
		_x41=_a41*x+_a42*y+_a43*z+_a44*w;
		_x11=_x11/_x41;
		_x21=_x21/_x41;
		_x31=_x31/_x41;
		return [_x11,_x21,_x31];
*/
	};


	function getNew2DPosition(x,y,z){
		var w=1;

		// P・_A = P`
		_x11=_a11*x+_a21*y+_a31*z+_a41*w;
		_x12=_a12*x+_a22*y+_a32*z+_a42*w;
		_x13=_a13*x+_a23*y+_a33*z+_a43*w;
		_x14=_a14*x+_a24*y+_a34*z+_a44*w;
		if(Math.floor(_x14*1000)/1000==0)_x14=0.000000001;
		_x11=_x11/_x14;
		_x12=_x12/_x14;
		_x13=_x13/_x14;
		return [_x11,_x12,_x13];
/*

		// _A・P = P'
		_x11=_a11*x+_a12*y+_a13*z+_a14*w;
		_x21=_a21*x+_a22*y+_a23*z+_a24*w;
		_x31=_a31*x+_a32*y+_a33*z+_a34*w;
		_x41=_a41*x+_a42*y+_a43*z+_a44*w;
		_x11=_x11/_x41;
		_x21=_x21/_x41;
		_x31=_x31/_x41;
		return [_x11,_x21,_x31];
*/
	};

	Object.defineProperty(myMat4,'multiArray'		,{value:multiplyArray,writable:false,enumerable:true,configurable:false});

	Object.defineProperty(myMat4,'arr',{get:function(){return [_a11,_a12,_a13,_a14,_a21,_a22,_a23,_a24,_a31,_a32,_a33,_a34,_a41,_a42,_a43,_a44];},enumerable:true,configurable:false});

//	Object.defineProperty(myMat4,'push'		,{value:pushAM,writable:false,enumerable:false,configurable:false});//for local scope of here
//	Object.defineProperty(myMat4,'pop'		,{value:popAM,writable:false,enumerable:false,configurable:false});//for local scope of here

	/**
	 *
	 *make accumeration matrix Zero matrix
	 *
	*/
	function clearToZeroAM(){//createAccumerateMatrix as Unit Matrix

		_a11 = 0;	_a12 = 0;	_a13 = 0;	_a14 = 0;
		_a21 = 0;	_a22 = 0;	_a23 = 0;	_a24 = 0;
		_a31 = 0;	_a32 = 0;	_a33 = 0;	_a34 = 0;
		_a41 = 0;	_a42 = 0;	_a43 = 0;	_a44 = 0;
	};
	/**
	 *
	 *Prepare accumerate matrix
	 *
	*/
	function prepareAM(){//createAccumerateMatrix as Unit Matrix

		_a11 = 1;	_a12 = 0;	_a13 = 0;	_a14 = 0;
		_a21 = 0;	_a22 = 1;	_a23 = 0;	_a24 = 0;
		_a31 = 0;	_a32 = 0;	_a33 = 1;	_a34 = 0;
		_a41 = 0;	_a42 = 0;	_a43 = 0;	_a44 = 1;
	};
		//Stack
	/**
	 *DO NOT ADD THIS FUNCTION TO myMat4'S PROPERTY! ONLY USE IN THIS (FUNCTION)();.
	 *Push accumerate matrix to a stack
	 *
	*/
	function pushA44(){//pushAccumerateMatrixToStack(){
		_s11=_a11;_s12=_a12;_s13=_a13;_s14=_a14;
		_s21=_a21;_s22=_a22;_s23=_a23;_s24=_a24;
		_s31=_a31;_s32=_a32;_s33=_a33;_s34=_a34;
		_s41=_a41;_s42=_a42;_s43=_a43;_s44=_a44;
	};
	/**
	 *ONLY USE IN THIS FUNCTION
	 *Pop a stack matrix to accumerate matrix
	 *
	*/
	function popA44(){//popAccumerateMatrixFromStack(){
		_a11=_s11;_a12=_s12;_a13=_s13;_a14=_s14;
		_a21=_s21;_a22=_s22;_a23=_s23;_a24=_s24;
		_a31=_s31;_a32=_s32;_a33=_s33;_a34=_s34;
		_a41=_s41;_a42=_s42;_a43=_s43;_a44=_s44;
	};
		//IO
	/**
	 *Restore Accumeration matrix elements to Type Array value
	 *	this function is simmilar to the myMat4's property .arr to get elements of _a
	*/
	function storeA44ToArray(arr){// = function storeAccumeMatrixToArray(arr){
		arr[0]=_a11;	arr[1]=_a12;	arr[2]=_a13;	arr[3]=_a14;
		arr[4]=_a21;	arr[5]=_a22;	arr[6]=_a23;	arr[7]=_a24;
		arr[8]=_a31;	arr[9]=_a32;	arr[10]=_a33;	arr[11]=_a34;
		arr[12]=_a41;	arr[13]=_a42;	arr[14]=_a43;	arr[15]=_a44;
	};
		//Matrix operation
	/*
	 *
	 *Load array to accumerate matrix
	 *
	 *@param {Array(16)} arr 4x4matrix
	 *
	*/
	function loadToA44(arr){// = function loadMatrixToAccumerateMatrix(arr){
		_a11=arr[0]; _a12=arr[1]; _a13=arr[2]; _a14=arr[3];
		_a21=arr[4]; _a22=arr[5]; _a23=arr[6]; _a24=arr[7];
		_a31=arr[8]; _a32=arr[9]; _a33=arr[10];_a34=arr[11];
		_a41=arr[12];_a42=arr[13];_a43=arr[14];_a44=arr[15];
	};
	/**
	 *
	 *Inverse of homo 4x4 Matrix with Adjugate Formula
	 *
	*/
	function inverseAM(){//inverseAccumerateMatrix(){
		_x11=_a11*(+_a22*_a33*_a44+_a23*_a34*_a42+_a24*_a32*_a43-_a24*_a33*_a42-_a22*_a34*_a43-_a23*_a32*_a44);
		_x21=_a21*(-_a12*_a33*_a44-_a13*_a34*_a42-_a14*_a32*_a43+_a14*_a33*_a42+_a12*_a34*_a43+_a13*_a32*_a44);
		_x31=_a31*(+_a12*_a23*_a44+_a13*_a24*_a42+_a14*_a22*_a43-_a14*_a23*_a42-_a12*_a24*_a43-_a13*_a22*_a44);
		_x41=_a41*(-_a12*_a23*_a34-_a13*_a24*_a32-_a14*_a22*_a33+_a14*_a23*_a32+_a12*_a24*_a33+_a13*_a22*_a34);
		_det = _x11+_x21+_x31+_x41;
		_x11=+_a22*_a33*_a44+_a23*_a34*_a42+_a24*_a32*_a43-_a24*_a33*_a42-_a22*_a34*_a43-_a23*_a32*_a44;
		_x12=-_a21*_a33*_a44-_a23*_a34*_a41-_a24*_a31*_a43+_a24*_a33*_a41+_a21*_a34*_a43+_a23*_a31*_a44;
		_x13=+_a21*_a32*_a44+_a22*_a34*_a41+_a24*_a31*_a42-_a24*_a32*_a41-_a21*_a34*_a42-_a22*_a31*_a44;
		_x14=-_a21*_a32*_a43-_a22*_a33*_a41-_a23*_a31*_a42+_a23*_a32*_a41+_a21*_a33*_a42+_a22*_a31*_a43;
		_x21=-_a12*_a33*_a44-_a13*_a34*_a42-_a14*_a32*_a43+_a14*_a33*_a42+_a12*_a34*_a43+_a13*_a32*_a44;
		_x22=+_a11*_a33*_a44+_a13*_a34*_a41+_a14*_a31*_a43-_a14*_a33*_a41-_a11*_a34*_a43-_a13*_a31*_a44;
		_x23=-_a11*_a32*_a44-_a12*_a34*_a41-_a14*_a31*_a42+_a14*_a32*_a41+_a11*_a34*_a42+_a12*_a31*_a44;
		_x24=+_a11*_a32*_a43+_a12*_a33*_a41+_a13*_a31*_a42-_a13*_a32*_a41-_a11*_a33*_a42-_a12*_a31*_a43;
		_x31=+_a12*_a23*_a44+_a13*_a24*_a42+_a14*_a22*_a43-_a14*_a23*_a42-_a12*_a24*_a43-_a13*_a22*_a44;
		_x32=-_a11*_a23*_a44-_a13*_a24*_a41-_a14*_a21*_a43+_a14*_a23*_a41+_a11*_a24*_a43+_a13*_a21*_a44;
		_x33=+_a11*_a22*_a44+_a12*_a24*_a41+_a14*_a21*_a42-_a14*_a22*_a41-_a11*_a24*_a42-_a12*_a21*_a44;
		_x34=-_a11*_a22*_a43-_a12*_a23*_a41-_a13*_a21*_a42+_a13*_a22*_a41+_a11*_a23*_a42+_a12*_a21*_a43;
		_x41=-_a12*_a23*_a34-_a13*_a24*_a32-_a14*_a22*_a33+_a14*_a23*_a32+_a12*_a24*_a33+_a13*_a22*_a34;
		_x42=+_a11*_a23*_a34+_a13*_a24*_a31+_a14*_a21*_a33-_a14*_a23*_a31-_a11*_a24*_a33-_a13*_a21*_a34;
		_x43=-_a11*_a22*_a34-_a12*_a24*_a31-_a14*_a21*_a32+_a14*_a22*_a31+_a11*_a24*_a32+_a12*_a21*_a34;
		_x44=+_a11*_a22*_a33+_a12*_a23*_a31+_a13*_a21*_a32-_a13*_a22*_a31-_a11*_a23*_a32-_a12*_a21*_a33;
		_a11=_x11/_det;_a12=_x21/_det;_a13=_x31/_det;_a14=_x41/_det;
		_a21=_x12/_det;_a22=_x22/_det;_a23=_x32/_det;_a24=_x42/_det;
		_a31=_x13/_det;_a32=_x23/_det;_a33=_x33/_det;_a34=_x43/_det;
		_a41=_x14/_det;_a42=_x24/_det;_a43=_x34/_det;_a44=_x44/_det;
	};
	/**
	 *
	 *Transpose homo 4x4x Matrix of accumerate matirx
	 *
	*/
	function transposeAM(){// = function transposeAccumerateMatrix(){
		_x11=_a11;_x12=_a21;_x13=_a31;_x14=_a41;
		_x21=_a12;_x22=_a22;_x23=_a32;_x24=_a42;
		_x31=_a13;_x32=_a23;_x33=_a33;_x34=_a43;
		_x41=_a14;_x42=_a24;_x43=_a34;_x44=_a44;

		_a11=_x11;_a12=_x12;_a13=_x13;_a14=_x14;
		_a21=_x21;_a22=_x22;_a23=_x23;_a24=_x24;
		_a31=_x31;_a32=_x32;_a33=_x33;_a34=_x34;
		_a41=_x41;_a42=_x42;_a43=_x43;_a44=_x44;
	};
	/**
	 *Translate homo 4x4matrix of accumerate matrix
	 *
	 *@arg {number} x,y,z quantity of translation 
	 *
	*/
	function translateAM(x,y,z){// = function accumerateTranslation(x,y,z){

		pushA44();
		_a11=1; _a12=0; _a13=0; _a14=0;
		_a21=0; _a22=1; _a23=0; _a24=0;
		_a31=0; _a32=0; _a33=1; _a34=0;
		_a41=x; _a42=y; _a43=z; _a44=1;

		multiply();
	};
	/**
	 *Rotation around arbitrary vector using quaternions
	 *
	 *@param {Point} pp that line through 
	 *@param {number} vx,vy,vz elements of vector
	 *@param {number} theta angle in radians which rotate around a line-axis with right-hand screw rotation.
	 *
	*/
	function rotateAM(vx,vy,vz,theta){

	

		var len=1/Math.sqrt(vx*vx+vy*vy+vz*vz);
		var vx=vx*len,vy=vy*len,vz=vz*len;

		var cos = Math.cos(-theta*0.5);
		var sin = Math.sin(-theta*0.5);

		var q0=cos;
		var q1=vx*sin;
		var q2=vy*sin;
		var q3=vz*sin;

		var qq0 = q0*q0;
		var qq1 = q1*q1;
		var qq2 = q2*q2;
		var qq3 = q3*q3;

		var qq12 = q1*q2*2;
		var qq03 = q0*q3*2;
		var qq13 = q1*q3*2;
		var qq02 = q0*q2*2;
		var qq23 = q2*q3*2;
		var qq01 = q0*q1*2;

		pushA44();//_S <- _A
		_a11=qq0+qq1-qq2-qq3;	_a12=qq12-qq03;		_a13=qq13+qq02;		_a14=0;
		_a21=qq12+qq03;		_a22=qq0-qq1+qq2-qq3;	_a23=qq23-qq01;		_a24=0;
		_a31=qq13-qq02;		_a32=qq23+qq01;		_a33=qq0-qq1-qq2+qq3;	_a34=0;
		_a41=0;			_a42=0;			_a43=0;			_a44=1;

		multiply();

	};
	/**
	 *Make perspective matrix
	 *
	 *@arg {number} fov radian
	 *@arg {number} aspect width/height of screen
	 *@arg {number} near ?nearest distance to be able to take 
	 *@arg {number} far ?farthest distance to be able to take
	*/
	function preparePM(fovy,aspectRatio,near,far){// = function makePerspectiveMatrix(fov,aspectRatio,near,far){

		if(near == far){
			PRINT_CAUTION.innerHTML += "far equals to near in makePMatrix().<br>";
			return null;
		}
		var s = 1.0 / Math.tan(fovy / 2);
		var nf = 1 / (near - far);

		_a11 = s/aspectRatio;	_a12 = 0;	_a13 = 0;			_a14 = 0;
		_a21 = 0;		_a22 = s;	_a23 = 0;			_a24 = 0;
		_a31 = 0;		_a32 = 0;	_a33 = (far + near) * nf;	_a34 = -1;
		_a41 = 0;		_a42 = 0;	_a43 = 2 * far * near * nf;	_a44 = 0;


		//PRINT2.innerHTML = near.toString() + "&nbsp;&nbsp;&nbsp;" + far.toString() + "&nbsp&nbsp&nbsp" + (far*near*nf).toString();
		//https://www.scratchapixel.com/lessons/3d-basic-rendering/perspective-and-orthographic-projection-matrix/building-basic-perspective-projection-matrix
	};
	/**
	 *Make orthographic matrix
	 *
	 *@arg {number} fov radian
	 *@arg {number} aspect width/height of screen
	 *@arg {number} near ?nearest distance to be able to take 
	 *@arg {number} far ?farthest distance to be able to take
	 *
	 *cite
	 *https://www.scratchapixel.com/lessons/3d-basic-rendering/perspective-and-orthographic-projection-matrix/orthographic-projection-matrix
	*/
	function prepareOM(left,right,top,bottom,near,far,aspectRatio){

		if(near >= far){
			PRINT_CAUTION.innerHTML += "far is equal or smaller compared with near in myMat4 prepareOM.<br>";
		}
		if(left >= right){
			PRINT_CAUTION.innerHTML += "right is equal or smaller compared with left in myMat4 prepareOM.<br>";
		}
		if(bottom >= top){
			PRINT_CAUTION.innerHTML += "top is equal or smaller compared with bottom in myMat4 prepareOM.<br>";
		}
		var rml = 1/(right - left);
		var tmb = 1/(top - bottom);
		var fmn = 1/(far - near);

		_a11 = 2*rml;			_a12 = 0;			_a13 = 0;			_a14 = 0;
		_a21 = 0;			_a22 = 2*tmb;			_a23 = 0;			_a24 = 0;
		_a31 = 0;			_a32 = 0;			_a33 = -2*fmn;			_a34 = 0;
		_a41 = -(right + left) * rml;	_a42 = -(top + bottom) * tmb;	_a43 = -(far + near) * fmn;	_a44 = 1;

/*
		_a11 = 2*rml;			_a12 = 0;			_a13 = 0;			_a41 = 0;
		_a21 = 0;			_a22 = 2*tmb;			_a23 = 0;			_a42 = 0;
		_a31 = 0;			_a32 = 0;			_a33 = -2*fmn;			_a43 = 0;
		_a14 = -(right + left) * rml;	_a24 = -(top + bottom) * tmb;	_a34 = -(far + near) * fmn;	_a44 = 1;
*/
		//PRINT2.innerHTML = near.toString() + "&nbsp;&nbsp;&nbsp;" + far.toString() + "&nbsp&nbsp&nbsp" + (far*near*nf).toString();
		//https://www.scratchapixel.com/lessons/3d-basic-rendering/perspective-and-orthographic-projection-matrix/building-basic-perspective-projection-matrix
	};
	function multiply(){
		multiplyStack44Accume44();
//		multiplyAccume44Stack44();
	};


	/**
	 * _A <- _S * _A
	*/
	function multiplyStack44Accume44(){

		_x11=_s11*_a11+_s12*_a21+_s13*_a31+_s14*_a41;_x12=_s11*_a12+_s12*_a22+_s13*_a32+_s14*_a42;_x13=_s11*_a13+_s12*_a23+_s13*_a33+_s14*_a43;_x14=_s11*_a14+_s12*_a24+_s13*_a34+_s14*_a44;
		_x21=_s21*_a11+_s22*_a21+_s23*_a31+_s24*_a41;_x22=_s21*_a12+_s22*_a22+_s23*_a32+_s24*_a42;_x23=_s21*_a13+_s22*_a23+_s23*_a33+_s24*_a43;_x24=_s21*_a14+_s22*_a24+_s23*_a34+_s24*_a44;
		_x31=_s31*_a11+_s32*_a21+_s33*_a31+_s34*_a41;_x32=_s31*_a12+_s32*_a22+_s33*_a32+_s34*_a42;_x33=_s31*_a13+_s32*_a23+_s33*_a33+_s34*_a43;_x34=_s31*_a14+_s32*_a24+_s33*_a34+_s34*_a44;
		_x41=_s41*_a11+_s42*_a21+_s43*_a31+_s44*_a41;_x42=_s41*_a12+_s42*_a22+_s43*_a32+_s44*_a42;_x43=_s41*_a13+_s42*_a23+_s43*_a33+_s44*_a43;_x44=_s41*_a14+_s42*_a24+_s43*_a34+_s44*_a44;
		_a11=_x11;_a12=_x12;_a13=_x13;_a14=_x14;
		_a21=_x21;_a22=_x22;_a23=_x23;_a24=_x24;
		_a31=_x31;_a32=_x32;_a33=_x33;_a34=_x34;
		_a41=_x41;_a42=_x42;_a43=_x43;_a44=_x44;

	};
	/**
	 * _A <- A * S
	*/
	function multiplyAccume44Stack44(){

		_x11=_a11*_s11+_a12*_s21+_a13*_s31+_a14*_s41;_x12=_a11*_s12+_a12*_s22+_a13*_s32+_a14*_s42;_x13=_a11*_s13+_a12*_s23+_a13*_s33+_a14*_s43;_x14=_a11*_s14+_a12*_s24+_a13*_s34+_a14*_s44;
		_x21=_a21*_s11+_a22*_s21+_a23*_s31+_a24*_s41;_x22=_a21*_s12+_a22*_s22+_a23*_s32+_a24*_s42;_x23=_a21*_s13+_a22*_s23+_a23*_s33+_a24*_s43;_x24=_a21*_s14+_a22*_s24+_a23*_s34+_a24*_s44;
		_x31=_a31*_s11+_a32*_s21+_a33*_s31+_a34*_s41;_x32=_a31*_s12+_a32*_s22+_a33*_s32+_a34*_s42;_x33=_a31*_s13+_a32*_s23+_a33*_s33+_a34*_s43;_x34=_a31*_s14+_a32*_s24+_a33*_s34+_a34*_s44;
		_x41=_a41*_s11+_a42*_s21+_a43*_s31+_a44*_s41;_x42=_a41*_s12+_a42*_s22+_a43*_s32+_a44*_s42;_x43=_a41*_s13+_a42*_s23+_a43*_s33+_a44*_s43;_x44=_a41*_s14+_a42*_s24+_a43*_s34+_a44*_s44;
		_a11=_x11;_a12=_x12;_a13=_x13;_a14=_x14;
		_a21=_x21;_a22=_x22;_a23=_x23;_a24=_x24;
		_a31=_x31;_a32=_x32;_a33=_x33;_a34=_x34;
		_a41=_x41;_a42=_x42;_a43=_x43;_a44=_x44;

	};

	Object.defineProperty(myMat4,'rotXYZ',{value:rotateXYZ});//no use of accumerator'_a'
	function rotateXYZ(axisX,axisY,axisZ,theta,x,y,z){
		var len=1/Math.sqrt(axisX*axisX+axisY*axisY+axisZ*axisZ);
		var vx=axisX*len,vy=axisY*len,vz=axisZ*len;

		var cos = Math.cos(-theta*0.5);
		var sin = Math.sin(-theta*0.5);

		var q0=cos;
		var q1=vx*sin;
		var q2=vy*sin;
		var q3=vz*sin;

		var qq0 = q0*q0;
		var qq1 = q1*q1;
		var qq2 = q2*q2;
		var qq3 = q3*q3;

		var qq12 = q1*q2*2;
		var qq03 = q0*q3*2;
		var qq13 = q1*q3*2;
		var qq02 = q0*q2*2;
		var qq23 = q2*q3*2;
		var qq01 = q0*q1*2;

		_x11=qq0+qq1-qq2-qq3;	_x12=qq12-qq03;		_x13=qq13+qq02;
		_x21=qq12+qq03;		_x22=qq0-qq1+qq2-qq3;	_x23=qq23-qq01;
		_x31=qq13-qq02;		_x32=qq23+qq01;		_x33=qq0-qq1-qq2+qq3;

		var p=new Array(3);
		//右から座標を掛ける (4x4)x(4x1)
		p[0]=_x11*x+_x12*y+_x13*z;
		p[1]=_x21*x+_x22*y+_x23*z;
		p[2]=_x31*x+_x32*y+_x33*z;

		return p;
	};

	/**
	 *multiply Array
	 *@param {Array} arr Its capacity is 16.
	*/
	function multiplyArray(arr){
		pushA44();
		loadToA44(arr);
		multiply();
	};
})();//myMat4

/**
 *multiply template
 *K <- G・F
 *M <- K
 *
*/
//k11=g11*f11+g12*f21+g13*f31+g14*f41;k12=g11*f12+g12*f22+g13*f32+g14*f42;k13=g11*f13+g12*f23+g13*f33+g14*f43;k14=g11*f14+g12*f24+g13*f34+g14*f44;
//k21=g21*f11+g22*f21+g23*f31+g24*f41;k22=g21*f12+g22*f22+g23*f32+g24*f42;k23=g21*f13+g22*f23+g23*f33+g24*f43;k24=g21*f14+g22*f24+g23*f34+g24*f44;
//k31=g31*f11+g32*f21+g33*f31+g34*f41;k32=g31*f12+g32*f22+g33*f32+g34*f42;k33=g31*f13+g32*f23+g33*f33+g34*f43;k34=g31*f14+g32*f24+g33*f34+g34*f44;
//k41=g41*f11+g42*f21+g43*f31+g44*f41;k42=g41*f12+g42*f22+g43*f32+g44*f42;k43=g41*f13+g42*f23+g43*f33+g44*f43;k44=g41*f14+g42*f24+g43*f34+g44*f44;
//m11=k11;m12=k12;m13=k13;m14=k14;
//m21=k21;m22=k22;m23=k23;m24=_324;
//m31=k31;m32=k32;m33=k33;m34=k34;
//m41=k41;m42=k42;m43=k43;m44=k44;
//kgfm
