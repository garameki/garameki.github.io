libFileRelationship.create('myInfo');

/**
 * print informations on html element
**/
(function(){
//:myInfo
	myInfo = { };

	Object.defineProperty(myInfo,'create',{value:create,writable:true,enumerable:false,configurable:false});
	function create(sName,nLeft,nTop){
		Object.defineProperty(myInfo,sName,{value:new PrintText(sName,nLeft,nTop),writable:false,enumerable:true,configurable:false});
		Object.defineProperty(myInfo[sName],'createLine',{value:createLine(sName),writable:false,enumerable:true,configurable:false});
	};
	function createLine(sName){
		return function(sNameChild,sColor,sBackColor,nSize){
			myInfo[sName].elep.innerHTML+="<span class='"+sName+sNameChild+"'></span><br>";
			//https://stackoverflow.com/questions/30070865/event-that-occurs-after-appendchild
			var targets,target,count=0;
			var hoge = setInterval(function(){
				targets = myInfo[sName].elep.getElementsByClassName(sName+sNameChild);
				if(targets.length!=0){
					clearInterval(hoge);
					target = targets[0];
					target.style.color = sColor;
					target.style.backgroundColor = sBackColor;
					target.style.fontSize = nSize;
					if(myInfo[sName][sNameChild]!=void 0){
						console.error("too early to use the setter 'myInfo."+sName+"."+sNameChild+"='");
					}
					Object.defineProperty(myInfo[sName],sNameChild,{set:function(str){
						target.innerText=str;
					},enumerable:true,configurable:false});
				}else if(++count>100){
					clearInterval(hoge);
					console.error("myInfo."+sName+"."+sNameChild+" might be not able to attach withinto DOM.");
				}
//●			},0.001);
			},1000);
		};
	};
	/** inner class **/
	var body;
	function PrintText(sName,nLeft,nTop){
		body = document.getElementsByTagName('body');
		if(body.length==0){
			console.caution("DOM is not ready yet about 'myInfo."+sName+"', too early to use");
			return null;
		}
		var elep = document.createElement('P');
		body[0].appendChild(elep);
		elep.style.position='absolute';
//		elep.style.zIndex=10000;
		elep.style.left=nLeft.toString()+'px';
		elep.style.top=nTop.toString()+'px';
		elep.style.padding='15px';
		elep.style.borderStyle='dashed';
		elep.style.borderColor='gold';
		elep.style.borderWidth='8px';

		this.elep = elep;

		elep.innerHTML="<span style='padding-left:5px;padding-right:5px;color:white;background-color:blue;position:absolute;left:-15px;top:-10px;'>"+sName+"</span>";
	};
	Object.defineProperty(PrintText.prototype,'caution',{set:setterCaution,enumerable:true,configurable:false});
	function setterCaution(str){
		this.print(str,"black","yellow");
	};
	Object.defineProperty(PrintText.prototype,'error',{set:setterError,enumerable:true,configurable:false});
	function setterError(str){
		this.print(str,"white","red");
	};
	Object.defineProperty(PrintText.prototype,'info',{set:setterInformation,enumerable:true,configurable:false});
	function setterInformation(str){
		this.print(str,"white","blue");
	};

	/** inner function **/
	var styleCommon = 'font-size:12px;padding-left:5px;padding-right:5px;';
	PrintText.prototype.print = function(str,sFColor,sBColor){
		this.elep.innerHTML+="<span style='color:"+sFColor+";background-color:"+sBColor+";"+styleCommon+"'>・"+str+"</span><br>";		
	};


})();

