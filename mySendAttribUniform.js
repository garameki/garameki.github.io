libFileRelationship.create('mySendAttribUniform');

/* */(function(){


mySendAttribUniform = { };

Object.defineProperty(mySendAttribUniform,"create",{value:create,enumerable:false,configurable:false});
function create(sName,func){
	Object.defineProperty(mySendAttribUniform,sName,{value:func,enumerable:true,configurable:false});
};


/* */})();