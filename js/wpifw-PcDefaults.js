/* Acceptable arguments
------------------------------------------- */
//console.log(Dice.roll("1d2"));
//console.log(Dice.roll(2));
//console.log(Dice.roll(4, 8));
//console.log(Dice.roll("sdsd"));

wpifw.Dice = {
	roll : function(q, d) {	
		var t = 0;
		if (typeof q === 'undefined') {
			q = 2;
			d = 6;
		}		
		if (typeof q !== "number") {
			var split = q.split('d');
			var qt = split[0];
			q = Number(qt);
			var dt = split[1];
			d = Number(dt);
		}
		if (typeof q !== "number" || isNaN(q))
			q = 2;
		if (typeof d !== "number" || isNaN(d))
			d = 6; //default to 6 sided.
		for (var i = 0; i < q; i ++) {
			var r = ~~(Math.random() * ((d + 1) - 1)) + 1;
			t += r;	
		}
	return t;
	},
}

/*Enumeration function. 
------------------------------------------- */
//Loops over all names in object (includes functions and prototype properties).
//These are filtered out. Returns Array.

function lookUp(defaultProperty) {
	
	var name, 
		propertyArray = []; 
		
	for (name in defaultProperty) {
		
		if (typeof defaultProperty[name] !== 'function') {
			propertyArray.push(defaultProperty[name]);
		}
		
	}
	return propertyArray;
}

wpifw.getPcDefaults = function ( callback ) {
	
	var defaultsUrl = "/wp-json/wp/v2/character_defaults";
	
	wpifw.pcDefaultsRequest = new XMLHttpRequest();
			
		wpifw.pcDefaultsRequest.onreadystatechange = function() { 
		
		if (this.readyState == 4 && this.status == 200) {
				
				wpifw.processPcDefaults(this.responseText);
				var message = 'character defaults done';
				callback( message );

			};
		}
		wpifw.pcDefaultsRequest.open( "GET", defaultsUrl, true );  
		wpifw.pcDefaultsRequest.send( null );
	
}

wpifw.processPcDefaults = function ( response ) {
	
	//console.log( response )
	
	wpifw.PcDefaultsResponse = JSON.parse( response );
	
	var numberOfDefaults = wpifw.PcDefaultsResponse.length;
	
	//console.log( numberOfDefaults )
	
	wpifw.pcDefaults = {};
	
	for ( var i = 0; i < numberOfDefaults; i++ ) {
		
		var charId = wpifw.PcDefaultsResponse[i]['id'],
			title = wpifw.PcDefaultsResponse[i]['title'].rendered,
			alignment_value = wpifw.PcDefaultsResponse[i]['custom_meta']['character_defaults'][title]['alignment'],
			gender_value = wpifw.PcDefaultsResponse[i]['custom_meta']['character_defaults'][title]['gender'],
			behaviour_value = wpifw.PcDefaultsResponse[i]['custom_meta']['character_defaults'][title]['behaviour'],
			skill_value = wpifw.PcDefaultsResponse[i]['custom_meta']['character_defaults'][title]['skill'],
			stamina_value = wpifw.PcDefaultsResponse[i]['custom_meta']['character_defaults'][title]['stamina'],
			luck_value = wpifw.PcDefaultsResponse[i]['custom_meta']['character_defaults'][title]['luck'],
			gold_value = wpifw.PcDefaultsResponse[i]['custom_meta']['character_defaults'][title]['gold'];
		
		wpifw.pcDefaults[charId] = { species : charId, alignment : alignment_value, gender : gender_value, behaviour : behaviour_value, skill : skill_value, stamina : stamina_value, luck : luck_value, gold : gold_value, title : title };
	};

	var charId = 999,
		title = 'classless',
		alignment_value = [],
		gender_value = [],
		behaviour_value = [],
		skill_value = [],
		stamina_value = [],
		luck_value = [],
		gold_value = [];
			
	wpifw.pcDefaults[charId] = { species : charId, alignment : alignment_value, gender : gender_value, behaviour : behaviour_value, skill : skill_value, stamina : stamina_value, luck : luck_value, gold : gold_value, title : title };
}

/*Example Usage 
------------------------------------------- */
//console.log(lookUp(pcDefaults).length);
//console.log(lookUp(pcDefaults)[0].species);
//console.log(lookUp(pcDefaults.human)[1]);
//console.log(lookUp(pcDefaults.human.gender).length);
//console.log(lookUp(pcDefaults.human.gender)[1]);

/* Variable key 
------------------------------------------- */
//n = name, sp = species, a = alignment, g = gender, b = behaviour, sk = skill, st = stamina, l = luck, gd = gold;

wpifw.Uid = -1;
wpifw.Pc = function(n, sp, a, g, b, sk, st, l, gd) { 
	
	wpifw.Uid = wpifw.Uid + 1;
	
	if  ( typeof sp === "number" )
		{ sp = sp + ""; }
	var species = sp;
	
	if ( species === '' )
		species = '999'; 
	
	if (typeof species !== "string") {
		var nSpecies = lookUp(wpifw.pcDefaults).length;
		var speciesKey  = Math.floor(Math.random() * nSpecies);
		
		if (speciesKey > 0) {
			species = lookUp(wpifw.pcDefaults)[speciesKey].species;
		} else {
			species = '999';
		}
	} 
	
	var name = n;
	var alignment = a;
	//console.log(name);
	//console.log( species );
	//console.log( alignment );
	
		if (typeof alignment !== "string" ) {
			var alignmentArray = lookUp(wpifw.pcDefaults[species].alignment);	
			var alignmentLength = alignmentArray.length;
			if (alignmentLength > 0) {	
			} else {
				 alignmentArray.push("Friend", "Foe", "Neutral");
			}
			var alignmentKey  = Math.floor(Math.random() * alignmentArray.length);
			alignment = alignmentArray[alignmentKey];
		} 
		
//	if (typeof name !== "string" || name === "Unknown" ) {
//		name = wpifw.pcDefaults[species].title;	
//		var randomCharacter = true;
//	} else {
//		var randomCharacter = false;
//	}

	var gender = g;
		if (typeof gender !== "string" && species !== 'classless') {
			var genderArray = lookUp(wpifw.pcDefaults[species].gender);	
			var genderLength = genderArray.length;
			if (genderLength > 0) {	
			} else {
				 genderArray.push("Male", "Female", "It");
			}
			var genderKey  = Math.floor(Math.random() * genderArray.length);
			gender = genderArray[genderKey];
		} 

	var behaviour = b;
		if (typeof behaviour !== "string" && species != 'classless') {
			var behaviourArray = lookUp(wpifw.pcDefaults[species].behaviour);	
			var behaviourLength = behaviourArray.length;
			if (behaviourLength > 0) {	
			} else {
				 behaviourArray.push("Attacker", "Defender");
			}
			var behaviourKey  = Math.floor(Math.random() * behaviourArray.length);
			behaviour = behaviourArray[behaviourKey];
		} else {
			behaviour = 'Attacker';
		}

	var skill = sk;
		if (typeof skill !== "number" && species !== 'classless') {
			if ( typeof skill === 'object' ) {
				skill = skill + "";
				skill = wpifw.Dice.roll(skill);
			} else {
				var skillString = lookUp(wpifw.pcDefaults[species].skill);
				var skillRoll = skillString[0];
				if(typeof skillRoll === "string") {
					skill = wpifw.Dice.roll(skillRoll);
				} else {
					skill = wpifw.Dice.roll(2); 
				}
			}
		} else if ( typeof skill !== "number" && species === 'classless' ) {
			console.log( 'skill is not a number and species IS classless' );
			skill = wpifw.Dice.roll(2); 
		} 
		skillString = "", skillRoll = "";

	var stamina = st;
		if (typeof stamina !== "number" && species !== 'classless') {
			if ( typeof stamina === 'object' ) {
				stamina = stamina + "";
				stamina = wpifw.Dice.roll(stamina);
			} else {
				var staminaString = lookUp(wpifw.pcDefaults[species].stamina);
				var staminaRoll = staminaString[0];
				if(typeof staminaRoll === "string") {
					stamina = wpifw.Dice.roll(staminaRoll);
				} else {
					stamina = wpifw.Dice.roll(2); 
				}
			}
		} else if ( typeof stamina !== "number" && species === 'classless' ){
			stamina = wpifw.Dice.roll(2); 
		}
		staminaString = "", staminaRoll = "";

	var luck = l;
		if (typeof luck !== "number" && species !== 'classless') {
			if ( typeof luck === 'object' ) {
				luck = luck + "";
				luck = wpifw.Dice.roll(luck);
			} else {
				var luckString = lookUp(wpifw.pcDefaults[species].luck);
				var luckRoll = luckString[0];
				if(typeof luckRoll === "string") {
					luck = wpifw.Dice.roll(luckRoll);
				} else {
					luck = wpifw.Dice.roll(2); 
				}
			}
		} else if ( typeof luck !== "number" && species === 'classless' ){
			luck = wpifw.Dice.roll(2); 
		}
		luckString = "", luckRoll = "";

	var gold = gd;
		if (typeof gold !== "number" && species !== 'classless') {
			if ( typeof gold === 'object' ) {
				gold = gold + "";
				gold = wpifw.Dice.roll(gold);
			} else {
				var goldString = lookUp(wpifw.pcDefaults[species].gold);
				var goldRoll = goldString[0];
				if(typeof goldRoll === "string") {
					gold = wpifw.Dice.roll(goldRoll);
				} else {
					if (typeof goldRoll === "number") {
						gold = goldRoll;
					} else {
						gold = wpifw.Dice.roll(2); 
					}
				}
			}
		} else if ( typeof gold !== "number" && species === 'classless' ){
			gold = wpifw.Dice.roll(2); 
		}
		goldString = "", goldRoll = "";
		
	var struck = false;
	this.struck = struck;	
		
	//this.randomCharacter = randomCharacter;
	this.Uid = wpifw.Uid;
	this.name = name;
	this.species = species;
	this.alignment = alignment;
	this.gender = gender;
	this.behaviour = behaviour;
	this.skill = skill;
	this.stamina = stamina;
	this.luck = luck;
	this.gold = gold;
	this.attackScore = 0;

};

wpifw.Pc.prototype.attack = function () {
	
	if ( this.randomCharacter == true ) { 
		if (this.gender == 'Male' || this.gender == 'Female') {
			characterName = "The " + this.gender + " " + this.name;
		} else {
			characterName = "The " + this.name;
		}
		
	} else { 
		characterName = this.name;
	}

	this.attackScore = wpifw.Dice.roll(2) + this.skill;
	
	if ( this.name == 'You' ) {
		wpifw.combat.combatView.strikeArray.push( 'You' );
		wpifw.combat.combatView.strikeScoreArray.push( this.attackScore );
	} else {
		wpifw.combat.combatView.strikeArray.push( characterName );
		wpifw.combat.combatView.strikeScoreArray.push( this.attackScore );
	}
}

wpifw.Pc.prototype.wound = function ( callback ) {

	var gender = this.gender,
		subjectPronoun,
		possesivePronoun,
		//objectPronoun,
		woundAdjective;
	
	if ( gender == 'Male' ) { subjectPronoun = 'He'; possesivePronoun = 'His';
	} else if ( gender == 'Female' ) { subjectPronoun = 'She';	possesivePronoun = 'Her';
	} else { subjectPronoun = 'It'; possesivePronoun = 'Its';
	}
	
	var woundAmount = wpifw.Dice.roll(1, 2);
	
	if ( woundAmount == 1 ) { woundAdjective = 'lighly'; }	
	else { woundAdjective = 'badly'; }
	
	this.stamina = this.stamina - woundAmount;
	
	if ( this.name == 'You' ) {
		//wpifw.local.player.stamina = wpifw.local.player.stamina - woundAmount;
		console.log('you have been wounded and lose ' + woundAmount + ' stamina');
		if ( typeof( Storage ) !== "undefined" ) {
			localStorage.setItem('wpifw_Player', JSON.stringify(wpifw.local.player));
		}
	}
	
	if ( this.randomCharacter == true ) { 
		if (this.gender == 'Male' || this.gender == 'Female') {
			characterName = "The " + this.gender + " " + this.name;
		} else {
			characterName = "The " + this.name;
		}
		
	} else { 
		characterName = this.name;
	}
	
	if ( this.stamina <= 0 ) { 
		if ( this.name == 'You' ) {
			wpifw.combat.combatView.woundArray.push( "You have been hit.<br /><span class='woundAdj'>You receive a heavy blow.</span><br/ >Your stamina is " + this.stamina + ".<br/ >You have been defeated.<br/ ><br/ >" );
		} else {
			wpifw.combat.combatView.woundArray.push( characterName + " has been hit.<br /><span class='woundAdj'>" + subjectPronoun + " receives a heavy blow.</span><br/ >" + possesivePronoun + " stamina is now " + this.stamina + ".<br/ >" + subjectPronoun + " has been defeated.<br/ ><br/ >" );
		}
		callback('dead');
	} else {
		if ( this.name == 'You' ) {
			wpifw.combat.combatView.woundArray.push( "You have been hit.<br /><span class='woundAdj'>You have been " + woundAdjective + " wounded.</span><br/ >Your stamina is now " + this.stamina + ".<br/ ><br/ >" );
		} else {
			wpifw.combat.combatView.woundArray.push( characterName + " has been hit.<br /><span class='woundAdj'>" + subjectPronoun + " has been " + woundAdjective + " wounded.</span><br/ >" + possesivePronoun + " stamina is now " + this.stamina + ".<br/ ><br/ >" );
		}
		callback('wound');
	}
}

wpifw.Pc.prototype.getCombatStats = function ( callback ) {
	
	if ( typeof(callback) == "function") {
		
		var combatStats = {};
		combatStats.Uid = this.Uid;
		combatStats.name = this.name;
		combatStats.gender = this.gender;
		combatStats.randomCharacter = this.randomCharacter;		
		combatStats.alignment = this.alignment;
		combatStats.stamina = this.stamina;
		combatStats.skill = this.skill;
		combatStats.attackScore = this.attackScore;
		combatStats.combatTarget = this.combatTarget;
		combatStats.state = this.state;
		
		callback( combatStats );
	}
}