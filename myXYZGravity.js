libFileRelationship.create('myXYZGravity');
libFileRelationship.myXYZGravity.relatedTo='myInfo';
libFileRelationship.myXYZGravity.relatedTo='myVec3';
libFileRelationship.myXYZGravity.relatedTo='myXYZ';


	//for using gravity, follow to gravity (between members only)
/* */(function(){

myXYZGravity = { };

var aMember = [];
var Member = function(mass,x,y,z,vx,vy,vz){
	myXYZ.SuperMember.call(this);	
	this.m = mass;
	this.x=x;
	this.y=y;
	this.z=z;
	this.vx=vx;
	this.vy=vy;
	this.vz=vz;
};
myXYZ.inherits(Member);

Object.defineProperty(myXYZGravity,'length',{get:function(){return aMember.length;}});

Object.defineProperty(myXYZGravity,'member',{value:getMemberByIndex});
function getMemberByIndex(){
	return function(num){
		if(num>=aMember.length || num<0){
			myInfo.caution('number is out of range. num='+num.toString());
		}
		return aMember[num];
	};
};
Object.defineProperty(myXYZGravity,'createMember',{value:createMember});
function createMember(m,x,y,z,vx,vy,vz){
	var mem =new Member(m,x,y,z,vx,vy,vz);
	aMember.push(mem);
	return mem;
};
Object.defineProperty(myXYZGravity,'reposAll',{value:repositionAll});
function repositionAll(dt){

	dt=dt/50;
	g=1/5;
	var mem1,mem2,dist,force;
	var sumFx,sumFy,sumFz;
	var len = aMember.length;
	for(var ii=0;ii<len;ii++){
		sumFx=0;sumFy=0;sumFz=0;
		mem1=aMember[ii];
		for(var jj=0;jj<len;jj++){
			if(ii==jj){
				//nothing to do
			}else{
				mem2=aMember[jj];
				dist = 1/((mem1.x-mem2.x)*(mem1.x-mem2.x)+(mem1.y-mem2.y)*(mem1.y-mem2.y)+(mem1.z-mem2.z)*(mem1.z-mem2.z));
				force = -g*mem1.m*mem2.m*dist;
//console.log("force=",force);
				dist=Math.pow(dist,0.5);
				sumFx += force * (mem1.x-mem2.x)*dist;
				sumFy += force * (mem1.y-mem2.y)*dist;
				sumFz += force * (mem1.z-mem2.z)*dist;
			}
		}

		mem1.x+=mem1.vx*dt;
		mem1.y+=mem1.vy*dt;
		mem1.z+=mem1.vz*dt;
		mem1.vx+=sumFx*dt/mem1.m;
		mem1.vy+=sumFy*dt/mem1.m;
		mem1.vz+=sumFz*dt/mem1.m;
	}
//	var mem;
//	for(var kk=0;kk<aMember.length;kk++){
//		mem = aMember[kk];
//		console.log("mem["+kk.toString()+"] x:",mem.x,"y:",mem.y,"z:",mem.z);
//	}
};
/* */})();

