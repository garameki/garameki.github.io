libFileRelationship.create('myLabel');
libFileRelationship.myLabel.relatedTo='myMat4';

(function(){

	/** global scope **/
	myLabel = { };


//kkkk
	(function(){
		/* inner class */
		function Text(x,y,z,str,color){
			this.x=x;
			this.y=y;
			this.z=z;
			this.str=str;
			this.elementDiv=document.createElement("div");
			this.elementDiv.className='divGLText';
			this.elementDiv.style.color=color.rgba;
			document.getElementById("canvasContainer").appendChild(this.elementDiv);//kkk #canvasContainer only

//html part
//<div id='canvasContainer'>
//<canvas width=512 height=512></canvas>
//</div>
//this containers are going to vanish in future
			this.elementText = document.createTextNode("");
			this.elementText.className='textGLText';
			this.elementDiv.appendChild(this.elementText);
			this.elementText.nodeValue = str;

			var offset = libElement.getOffset(this.elementDiv.parentNode);//kkk to do that offsets get to be changable
			this.offsetLeft=0;//offset.left;
			this.offsetTop=0;//offset.top;
//			this.elementText.onclick=function(event){console.log("event=",event);};
		};
		Text.prototype.reposition = function(gl){
			// myMat4.load(pmat); 	must be done this outside until before arriving here
			// myMat4.multi(mvmat);	must be done this outside until before arriving here
			var newP = myMat4.get2D(this.x,this.y,this.z);
			if(newP[2]>1){
				this.elementText.nodeValue=this.str+' behind';
			}else{
				this.elementText.nodeValue=this.str;
			}
			this.elementDiv.style.left = Math.floor((newP[0]+1)*gl.canvas.width*0.5+this.offsetLeft).toString()+"px";
			this.elementDiv.style.top = Math.floor((1-newP[1])*gl.canvas.height*0.5+this.offsetTop).toString()+"px";
		};
		Text.prototype.setText = function(str){
			this.elementText.nodeValue=str;
		};
//i think that the functions of myMat4 must be limited not to use globaly but to be used by suitable functions.

		//outer class
		Object.defineProperty(myLabel,'join',{value:join,writable:false,enumerable:false,configurable:false});
		function join(sName){
			Object.defineProperty(myLabel,sName,{value:new Labels(),writable:false,enumerable:false,configurable:false});
		};
//○		Object.defineProperty(myLabel,'Labels',{value:Labels,writable:false,enumerable:true,configurable:false});
		function Labels(){
			this.aTexts = [];
		};
		Labels.prototype.addText = function(x,y,z,str,color){
			this.aTexts.push(new Text(x,y,z,str,color));
		};
		Labels.prototype.repos = function(gl,pmat,mvmat){
			myMat4.load(mvmat);// 	must be done outside until before arriving here
			myMat4.multiArray(pmat);//	must be done outside until before arriving here
			for(var ii=0,len=this.aTexts.length;ii<len;ii++){
				this.aTexts[ii].reposition(gl);
			}
		};

	})();

})();

