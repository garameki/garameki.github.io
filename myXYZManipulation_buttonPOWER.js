libFileRelationship.create('myXYZManipulation_buttonPOWER');
libFileRelationship.myXYZManipulation_buttonPOWER.relatedTo='myXYZManipulation';

console.error("This is POWER");

//exclusive swiches


	//for using under controlled space ship, follow to key board
/* */(function(){

//POWER BUTTON

//button type exclusive

//return value {Number} myXYZManipulation.buttonPOWER

/////////////////////// attach buttons after loading DOM /////////////////////////////////////
let counter = 0;
let collection;
const hoge = setInterval(funcHoge,10);
function funcHoge() {
	collection = document.getElementsByTagName('body');
	if(collection.length != 0 && 'myXYZManipulation' in window) {
		clearInterval(hoge);
		Object.defineProperty(myXYZManipulation,'buttonPOWER',{get:function(){return classValue;},enumerable:false,configurable:false});
		addButtons();
	} else {
		if(++counter > 100) {
			clearInterval(hoge);
			console.error("Can't find a object 'myXYZManipulation' or a HTML element 'body'.");
		}
	}
};

function addButtons() {

	const left = 750;
	const top = 100;
	let args;

	const aButtons = [
		['Maximum','for So Far Planets',1],
		['High','for Far Planets',0.1],
		['Middle','for Near Planets',0.01],
		['Low','Nearby planet',0.001],
		['Minimum','Adjust orbital',0.0001]
	];
	for(let ii in aButtons) {
		args = aButtons[ii];
		createButton(args[0],left,ii * 20 + top,args[1],args[2]);
	}
};//addButtons

///////////////////////////////// create button instances ////////////////////////////////////////
const oInstances = { };
function createButton(sName,left,top,text,power){
	const element = document.createElement('button');
	oInstances[sName] = new Button(element,"red","white",power);
	element.style.position = 'absolute';
	element.style.left = left.toString() + 'px';
	element.style.top  = top.toString() + 'px';
	element.innerText = text;
	element.addEventListener('click',oInstances[sName].click(),false);
	document.getElementsByTagName('body')[0].appendChild(element);
};

///////////////////// class definition /////////////////////////////////////
const classNONE = 0;
let classValue = classNONE;
function Button(element,sColorON,sColorOFF,power){
	this.value = power;
	this.switch = false;
	this.element = element;
	this.bgcolorON = sColorON;
	this.bgcolorOFF = sColorOFF;
	element.style.backgroundColor = this.bgcolorOFF;
};
Button.prototype.click = function(){
	const myself = this;
	return function() {
		if(myself.switch) {
//			myself.turnOFF();//can't turn off all switches
		} else {
			for(let name in oInstances) {
				oInstances[name].turnOFF();
			}
			myself.turnON();
		}
	};//return
};
Button.prototype.turnON = function() {
	classValue = this.value;
	this.switch = true;
	this.element.style.backgroundColor = this.bgcolorON;
};
Button.prototype.turnOFF = function(){
	classValue = classNONE;
	this.switch = false;
	this.element.style.backgroundColor = this.bgcolorOFF;
};


/* */})();

