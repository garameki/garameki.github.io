	/**
	 * ˜f¯‚Ì‘å‚«‚³‚ÆŽ¿—Ê‚ðŠi”[ collection of the size and the mass of planets
	 * @param {number} minifyGravity    mass x mififyGravity -> new 'mass' that you can get by 'earthMass = myFacts.planets.earth.mass' 
	 * 					The setter recalculate all mass of members in myFacts.planets
	 * @param {number} minifySize	is as same as above
	**/

/* */(function(){

	libFileRelationship.create('myFacts');

	myFacts = { };

	const minifyGravity = 1.0;	//0.001 ~ 1
	const minifySize    = 1.0;	//000000000000000000????????????


	var temp = 24;

	const planets = {
		"sun":{
			"revRadius":0,
			"parent":"",
			"radius":695508,
			"mass":1.9891e+9,
			"periodRevolution":null,
			"rotationHour":654

		},
		"jupiter":{
			"revRadius":77830e+4,
			"parent":"sun",
			"radius":69911,
			"mass":1.8986e+6,
			"periodRevolution":11.85678,
			"rotationHour":9.924


		},
		"saturn":{
			"revRadius":142700e+4,
			"parent":"sun",
			"radius":58232,
			"mass":5.683e+5,
			"periodRevolution":29.42415,
			"rotationHour":10.2336


		},
		"uranus":{
			"revRadius":286900e+4,
			"parent":"sun",
			"radius":25362,
			"mass":86832,
			"periodRevolution":83.74921,
			"rotationHour":-17.2333


		},
		"neptune":{
			"revRadius":44960e+4,
			"parent":"sun",
			"radius":24622,
			"mass":102430,
			"periodRevolution":163.7267,
			"rotationHour":16.1


		},
		"earth":{
			"revRadius":14960e+4,
			"parent":"sun",
			"radius":6371,
			"mass":5973,
			"periodRevolution":1.0,
			"rotationHour":23.928


		},
		"venus":{
			"revRadius":10800e+4,
			"parent":"sun",
			"radius":6051,
			"mass":4868,
			"periodRevolution":0.161596,
			"rotationHour":-5832



		},
		"mars":{
			"revRadius":22790e+4,
			"parent":"sun",
			"radius":3390,
			"mass":641,
			"periodRevolution":24.624,
			"rotationHour":24.6167


		},
		"ganymede":{
			"revRadius":1070000,
			"parent":"jupiter",
			"radius":2631,
			"mass":148,
			"periodRevolution":0.01960274,
			"rotationHour":temp


		},
		"titan":{
			"revRadius":1221930,
			"parent":"saturn",
			"radius":2576,
			"mass":134,
			"periodRevolution":0.0436849315,
			"rotationHour":temp


		},
		"mercury":{
			"revRadius":5790e+4,
			"parent":"sun",
			"radius":2439,
			"mass":330,
			"periodRevolution":0.240850,
			"rotationHour":1407.5

		},
		"callisto":{
			"revRadius":1883000,
			"parent":"jupiter",
			"radius":2410,
			"mass":107,
			"periodRevolution":0.0457233,
			"rotationHour":temp


		},
		"io":{
			"revRadius":421600,
			"parent":"jupiter",
			"radius":1821,
			"mass":89,
			"periodRevolution":0.004846575,
			"rotationHour":temp


		},
		"moon":{
			"revRadius":384400,
			"parent":"earth",
			"radius":1737,
			"mass":73,
			"periodRevolution":0.07485397,
			"rotationHour":655.7208


		},
		"europa":{
			"revRadius":670900,
			"parent":"jupiter",
			"radius":1561,
			"mass":48,
			"periodRevolution":0.009728767,
			"rotationHour":temp


		},
		"triton":{
			"revRadius":354800,
			"parent":"neptune",
			"radius":1353,
			"mass":21,
			"periodRevolution":0.01610136986,
			"rotationHour":temp


		},
		"pluto":{
			"revRadius":591300e+4,
			"parent":"sun",
			"radius":1185,
			"mass":13,
			"periodRevolution":245.4306,
			"rotationHour":153.2808


		},
		"iapetus":{
			"revRadius":3560820,
			"parent":"saturn",
			"radius":736,
			"mass":2,
			"periodRevolution":0.21734520547,
			"rotationHour":temp


		},
		"tethys":{
			"revRadius":294619,
			"parent":"saturn",
			"radius":533,
			"mass":0.62,
			"periodRevolution":0.0051726,
			"rotationHour":temp


		},
		"mimas":{
			"revRadius":185404,
			"parent":"saturn",
			"radius":198,
			"mass":0.037,
			"periodRevolution":0.0025808,
			"rotationHour":temp


		}
	};

	myFacts.planets = { };



	myFacts.planets.gravity = 9.8;
	let name;
	for(let name in planets){
		myFacts.planets[name] = { };
		if(planets[name].parent == "sun"){
			myFacts.planets[name].revRadius = planets[name].revRadius*0.001;
		} else {
			myFacts.planets[name].revRadius = planets[name].revRadius;
		}
		myFacts.planets[name].radius = planets[name].radius;
		myFacts.planets[name].mass = planets[name].mass;
		myFacts.planets[name].parent = planets[name].parent;
		myFacts.planets[name].periodRevolution = planets[name].periodRevolution;
		myFacts.planets[name].rotationHour = planets[name].rotationHour;
		
	}


/* */})();


