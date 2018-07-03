libFileRelationship.create('myXYZ');
libFileRelationship.myXYZ.relatedTo='myMat4';

	//for translating and/or rotating members above

	//constants

	const radPerMinute = Math.PI/180/365/24/60;// [rad/min]  １年で一周するとき、１分で何ラジアンか。

	/**
	 * @param {Object} memberXYZ  instance of myXYZManipulated,myXYZRevolutions or myXYZGravity
	**/

(function(){
	/** global scope **/
	myXYZ = { };

	Object.defineProperty(myXYZ,'inherits',{value:inherits,enumerable:false,configurable:false});	
	function inherits(childCtor) {
	  parentCtor =SuperMember;
	  /** @constructor */
	  function tempCtor() {};
	  tempCtor.prototype = parentCtor.prototype;
	  childCtor.superClass_ = parentCtor.prototype;
	  childCtor.prototype = new tempCtor();
	  /** @override */
	  childCtor.prototype.constructor = childCtor;
	};

	//class
	Object.defineProperty(myXYZ,'SuperMember',{value:SuperMember,enumerable:false,configurable:false});
	function SuperMember(){

	};
	SuperMember.prototype.x = void 0;
	SuperMember.prototype.y = void 0;
	SuperMember.prototype.z = void 0;
	SuperMember.prototype.reposition = function(time){
		//interface to override
		alert("In SuperMember reposition() was not overrided yet.  this=",this);
	};
	SuperMember.prototype.ratioTime = 1;






	/* for myXYZ object families */
	Object.defineProperty(myXYZ,'replaceView',{value:replaceCenterAndDirection});
	function replaceCenterAndDirection(memberXYZ){
		return function(time){
			myMat4.multiArray(memberXYZ.matAccume);
		};
	};
	Object.defineProperty(myXYZ,'replaceViewNotTranslated',{value:replaceCenterAndDirectionNotTranslated});
	function replaceCenterAndDirectionNotTranslated(memberXYZ){
		return function(time){
			myMat4.multiArray(memberXYZ.matAccumeNotTranslated);
		};
	};
	Object.defineProperty(myXYZ,'replaceViewNotRotated',{value:replaceCenterAndDirectionNotRotated});
	function replaceCenterAndDirectionNotRotated(memberXYZ){
		return function(time){
			myMat4.multiArray(memberXYZ.matAccumeNotRotated);
		};
	};
	Object.defineProperty(myXYZ,'replaceOrigin',{value:replaceCenterToOriginOf});
	function replaceCenterToOriginOf(memberXYZ){
		return function(time){
			myMat4.trans(-memberXYZ.x,-memberXYZ.y,-memberXYZ.z);
		};
	};



	/* for usually use */
	Object.defineProperty(myXYZ,'none'	,{value:doNothing,enumerable:true});
	function doNothing(){
		return function(time){
			//do nothing
		};
	};
//	Object.defineProperty(myXYZ,'random'	,{value:random,enumerable:true});//paste randome place in space
//	function random(){
//		const rx = Math.floor(Math.random()*100)/10;
//		const ry = Math.floor(Math.random()*100)/10;
//		const rz = Math.floor(Math.random()*100)/10;
//		const ratioPerYear = Math.random() * 3;//0 ~ 3
//		const tx = 2-Math.floor(Math.random()*4);
//		const ty = 2-Math.floor(Math.random()*4);
//
//		return function(dtime_minute){
//
//			//model view matrix...myMat4 was already defined in global scope
//			myMat4.trans(tx,ty,-6.0);
//			myMat4.rotO(rx,ry,rz,ratioPerYear * radPerMinute * time_minute);
//		}
//	};

//	Object.defineProperty(myXYZ,'axisY'	,{value:axisY,writable:false,enumerable:true});
//	function axisY(ratioPerYear){
//		var vx = 0;
//		var vy = 1;
//		var vz = 0;
//
//		return function(time_minute){
//			//model view matrix...myMat4 was already defined in global scope
//			myMat4.rot(vx,vy,vz,ratioPerYear * radPerMinute * time_minute);
//		}
//	};



	Object.defineProperty(myXYZ,'trans',{value:translateMember,enumerable:true});
	function translateMember(memberXYZ){
		return function(time){
			myMat4.trans(memberXYZ.x,memberXYZ.y,memberXYZ.z);
		};
	};
	Object.defineProperty(myXYZ,'translate',{value:translateArbitraryQuantity,enumerable:true});
	function translateArbitraryQuantity(x,y,z){
		return function(time){
			myMat4.trans(x,y,z);
		};
	};
	Object.defineProperty(myXYZ,'rotate',{value:rotate,writable:false,enumerable:true});
	function rotate(rx,ry,rz,deg){
		//@param {number} rx,ry,rz	vector of axis which is center of rotation
		//@param {number} ratio		ratio of rotation speed

		const rad = deg*Math.PI/180;
		return function(time){
			//model view matrix...myMat4 was already defined in global scope
			myMat4.rot(rx,ry,rz,rad);
		}
	};
	Object.defineProperty(myXYZ,'rotation',{value:rotation,writable:false,enumerable:true});
	function rotation(rx,ry,rz,rotationHour,deg0){
		//@param {number} rx,ry,rz	vector of axis which is center of rotation
		//@param {number} ratio		ratio of rotation speed

		const ratio = 2 * Math.PI / rotationHour / 60;//1 rotation per 24 hour
		const rad0 = deg0*Math.PI/180;
		return function(timeTotal_minute){
			//model view matrix...myMat4 was already defined in global scope
			myMat4.rot(rx,ry,rz,ratio * timeTotal_minute + rad0);
		}
	};
	Object.defineProperty(myXYZ,'gotoOrigin',{value:gotoOrigin,writable:false,enumerable:true});
	function gotoOrigin(){
		return function(time){
			myMat4.loadZero();
		};
	};

})();

