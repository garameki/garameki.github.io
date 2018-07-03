libFileRelationship.create('mySendMatrix');
libFileRelationship.mySendMatrix.relatedTo='myVec3';
libFileRelationship.mySendMatrix.relatedTo='myMat4';

//　There are 6 kind of matrices to be sended.
//
// + Quaternion
// + Perspective matrix for shadow
// + Orthographic matrix
// + Perspective matrix
// + Inversed model view matrix
// + Multiplicated Matrix of given matrices for model view matrix or others






/* */(function(){

mySendMatrix = { };


// * SEND QUATERNION ROTATION MATRIX
// * @param {vari} myShader[sNameShader].uniform[sNameVariable] object which has several functions to send value(s) to the shader program
// * @param {parentNotManipulatedMatrix} Array(16)
// * @param {parentParentPosition} Array(3) the position of connected parent's connected parent
Object.defineProperty(mySendMatrix,"quaternion",{value:sendQMatrix,enumerable:true,configurable:false});
function sendQMatrix(vari,parentNotManipulatedMatrix){//"parentPosition"を-Z軸上に回転移動させるための行列
	var length = myVec3.length;
	var normalize = myVec3.normalize;
	var dot = myVec3.dot;
	var cross = myVec3.cross;

	myMat4.load(parentNotManipulatedMatrix);//parent's matrix
	var parentPos = myMat4.get2D(0,0,0);	//calc parent position and normalize
	var theta = Math.acos(dot(normalize(parentPos),[0,0,-1]));
	var axis = normalize(cross(parentPos,[0,0,-1]));//基準側が2番目。1番目は位置ベクトル
	myMat4.loadIdentity();//set Identity vector into myMat4.arr
	myMat4.rot(axis[0],axis[1],axis[2],theta);//accumeration of multiplications to myMat4.arr
	vari.sendFloat32Array(myMat4.arr);
};

Object.defineProperty(mySendMatrix,"perspectiveForShadow",{value:sendPerspectiveMatrixForShadow,enumerable:true,configurable:false});
function sendPerspectiveMatrixForShadow(gl,vari,radius,notManipulatedMatrix){
	myMat4.load(notManipulatedMatrix);
	var aXYZ = myMat4.get2D(0,0,0);
	var length = Math.sqrt(aXYZ[0]*aXYZ[0]+aXYZ[1]*aXYZ[1]+aXYZ[2]*aXYZ[2]);

	var theta = Math.asin(radius/length);
	var fieldOfView = 2.0 * theta;//二倍
	var zNear = 0.01;//equals to perspective matrix
	var zFar = length * Math.cos(theta) * Math.cos(theta);//the distance from the point of light to the plane P1
	var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;

	myMat4.loadPerspective(fieldOfView,aspect,zNear,zFar);
	vari.sendFloat32Array(myMat4.arr);

};

Object.defineProperty(mySendMatrix,"orthegraphic",{value:sendOrthographicMatrix,enumerable:true,configurable:false});
function sendOrthographicMatrix(gl,vari){

		//https://www.scratchapixel.com/lessons/3d-basic-rendering/perspective-and-orthographic-projection-matrix/orthographic-projection-matrix		from cite site:
		//orthographic matrix...myMat4 already has a property defined
	var right	=  70.0;
	var left	= -70.0;
	var top		=  70.0;
	var bottom	= -70.0;
	var far		=  3500.0;
	var near	= -3500.0;
	var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;

	myMat4.loadOrthography(left,right,top,bottom,near,far,aspect);
	vari.sendFloat32Array(myMat4.arr);

};

Object.defineProperty(mySendMatrix,"perspective",{value:sendPerspectiveMatrix,enumerable:true,configurable:false});
function sendPerspectiveMatrix(gl,vari){

	/*
		from cite site:
		Create a perspective matrix, a special matrix that is
		used to simulate the distortion of perspective in a camera.
		Our field of view is 45 degrees, with a (width/height)
		ratio that matches the display size of the canvas
		and we only want ot see objects between 0.1 units
		and 100 units away from the camera.
	*/
		//perspective matrix...myMat4 already has a property defined about this
//	var fieldOfView = 70 * Math.PI / 180;	//in radian;
	var fieldOfView = 20 * Math.PI / 180;	//in radian;
	var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
	var zNear = 10;
	var zFar = 100000000000000000.0;

	myMat4.loadPerspective(fieldOfView,aspect,zNear,zFar);
	vari.sendFloat32Array(myMat4.arr);
};

Object.defineProperty(mySendMatrix,"modelViewInversedTransposed",{value:sendModelViewMatrixInversedTransposed,enumerable:true,configurable:false});
function sendModelViewMatrixInversedTransposed(vari,mvMatrix){
 	//各面の法線ベクトルの向きを更新＆拡大縮小にともなうずれを修正してくれる便利なベクトルをシェーダーに送る。
 	//send a matrix which rotates and translate normal vector and which makes the direction of normal vectors correct,especially when magnifiring was done to its body

	//https://msdn.microsoft.com/ja-jp/library/ms810476.aspx
	//	says the reason why 'inverse & transpose' must be done.
	myMat4.load(mvMatrix);
	myMat4.inverse();
	myMat4.transpose();
	vari.sendFloat32Array(myMat4.arr);
};

Object.defineProperty(mySendMatrix,"accumeration",{value:sendAccumeratedMatrix,enumerable:true,configurable:false});
function sendAccumeratedMatrix(vari,arrAccumelateToMyMat4,timeSpan){//to get a matrix computed from many kind purpose matrices to accumerate
	myMat4.loadIdentity();
	for(var ii=0,len=arrAccumelateToMyMat4.length;ii<len;ii++){
		arrAccumelateToMyMat4[ii](timeSpan);
	}
	vari.sendFloat32Array(myMat4.arr);
};

/* */})();

