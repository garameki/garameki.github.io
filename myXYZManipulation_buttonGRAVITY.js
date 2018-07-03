libFileRelationship.create('myXYZManipulation_buttonGRAVITY');
libFileRelationship.myXYZManipulation_buttonGRAVITY.relatedTo='myXYZManipulation';



	//for using under controlled space ship, follow to key board
/* */(function(){

//GRAVITY BUTTONS

//button type : Non-exclusive

//return {Object} myXYZManipulation.buttonGRAVITY


///////////////// attach buttons after loading DOM //////////////////////
let counter = 0;
let collection;
const hoge = setInterval(funcHoge,10);
function funcHoge() {
	collection = document.getElementsByTagName('body');
	if(collection.length != 0 && 'myXYZManipulation' in window) {
		clearInterval(hoge);
		Object.defineProperty(myXYZManipulation,'buttonGRAVITY',{get:function(){return class_oValues;},enumerable:false,configurable:false});
		addButtons();
	} else {
		if(++counter > 100) {
			clearInterval(hoge);
			console.error("Can't find a object 'myXYZManipulation' or a HTML element 'body'.");
		}
	}
};
//////////////////////////////// Buttons to add ////////////////////////////////////
function addButtons() {

	const left = 900;
	const top = 100;
	let args;

	//myXYZRevolutionsに登録されている(登録される)名前でなくてはなりません。
	//myFacts.planetsに登録されている(登録される)名前でなくてはなりません。
	const aButtons = [
		//title text,value
	//	['Sun','sun'],
		['Mercury','mercury'],
		['Venus','venus'],
		['Earth','earth'],
		['Mars','mars'],
		['Jupiter','jupiter'],
		['Saturn','saturn'],
		['Uanus','uranus'],
		['Neptune','neptune'],
		['Pluto','pluto'],
		['Moon','moon']
	];
	for(let ii in aButtons) {
		args = aButtons[ii];
		createButton(args[0],left,ii * 20 + top,args[0],args[1]);
	}
};//addButtons

////////////////// Instances //////////////////////////////////////////////

const oInstances = { };
function createButton(sIdentifier,left,top,text,sNamePlanet){
	const element = document.createElement('button');
	oInstances[sIdentifier] = new Button(element,"red","white",sNamePlanet);
	element.style.position = 'absolute';
	element.style.left = left.toString() + 'px';
	element.style.top  = top.toString() + 'px';
	element.innerText = text;
	element.addEventListener('click',oInstances[sIdentifier].click(),false);
	document.getElementsByTagName('body')[0].appendChild(element);
};

////////////////////////////////////// class difinition ////////////////////////////////
let class_oValues={ };//initial value,It is the reason that the deleting components is easy why I use object
function Button(element,sColorON,sColorOFF,sNamePlanet){
	this.value = sNamePlanet;
	this.switch = false;
	this.element = element;
	this.switch = false;
	this.bgcolorON = sColorON;
	this.bgcolorOFF = sColorOFF;
	element.style.backgroundColor = this.bgcolorOFF;
};
Button.prototype.click = function(){
	const myself = this;
	return function() {
		if(myself.switch) {
			myself.turnOFF();
		} else {
		//●	for(let name in oInstances) {
		//●		oInstances[name].turnOFF();
		//●	}
			myself.turnON();
		}
	};//return
};
Button.prototype.turnON = function() {
	Object.defineProperty(class_oValues,this.value,{value:null,writable:false,enumerable:true,configurable:true});//Set configurable:TRUE to be able to delete this property
	this.switch = true;
	this.element.style.backgroundColor = this.bgcolorON;
};
Button.prototype.turnOFF = function(){
	delete class_oValues[this.value];//this simplicity is the reason why I choiced the type of Object instead of Array.
	this.switch = false;
	this.element.style.backgroundColor = this.bgcolorOFF;
};




/* */})();

