libFileRelationship.create('libElement');
/* */(function(){











//libElement
libElement = { };

/**
 *calculate  total offsetTop and offsetLeft of ancestors recursively
 *@param {DOMElement} element 
*/
Object.defineProperty(libElement,'getOffset',{value:getOffset,enumerable:true,configurable:false});
function getOffset(element){
	function getAllOffset(element){
		if(element.tagName=='HTML') return {left:0,top:0};
		var left = element.offsetLeft;
		var top = element.offsetTop;
		var parentOffset = getAllOffset(element.parentNode);
		return {left:left+parentOffset.left,top:top+parentOffset.top};
	};
	return getAllOffset(element);
};










/* */})();
