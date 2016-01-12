wpifw.generatePlayer = function( callback ) {
	
	
	
	wpifw.local = {};
	wpifw.local.player = {};
	
	wpifw.playerSceneNumber = -1;
	wpifw.getCoverImage( wpifw.coverImage );
	
}

wpifw.isEmpty = function(obj)  {
	var numClasses = [];
	for(var prop in obj) {
		numClasses.push(prop);
		if (numClasses.length > 1 ) {
			return false;
		}
	}
	return true;
}

wpifw.adjustSceneAnchor = function() {

	sceneAnchor = document.getElementById('currentScene');
	sceneAnchor.parentNode.removeChild( sceneAnchor );
	wpifw.playerSceneNumber = wpifw.playerSceneNumber + 1; 
	article.innerHTML += '<a id="currentScene"></a>';
}

wpifw.createPlayer = function( callback ) {

	wpifw.adjustSceneAnchor();
	//Insert form
	var scene = document.createElement( 'div' );
	scene.className = 'scene';
	article.appendChild( scene );
	
	var characterForm = document.createElement( 'form' );
	characterForm.id = 'characterForm';
	
	if ( wpifw.playerSceneNumber == 0 ) {
		chapter = '';
	} else {
		chapter = wpifw.playerSceneNumber;
	}
	
	var sceneNumberText = document.createTextNode( chapter );
	
	var sceneNumberEl = document.createElement('p');
	var sceneNumberDiv = document.createElement('div');
	
	sceneNumberEl.appendChild( sceneNumberText );
	sceneNumberEl.id = 'sceneNumberEl';
	sceneNumberDiv.appendChild( sceneNumberEl );
	sceneNumberDiv.id = 'sceneNumberDiv';
	characterForm.appendChild( sceneNumberDiv );

	/// check for custom preface ///
		
	if ( wpifw.allowPreface !== 'on') {	
	
		var newPlayerHeadText = document.createTextNode('A choosable-path story'),
			newPlayerHead = document.createElement('h2');
		
		newPlayerHead.appendChild( newPlayerHeadText );
		characterForm.appendChild( newPlayerHead );	
		
		var newPlayerText = document.createTextNode('In this story YOU get to choose how the drama unfolds. Every section concludes with choices that you have to make. The choices you make will alter the story, taking you down new paths and giving you new choices.');
		var newPlayerPara = document.createElement('p');
		
		var newPlayer2ndText = document.createTextNode('Some choices will help you complete your story sucessfully, others could be fatal! If you fail, start again and learn from your mistake.');
		var newPlayer2ndPara = document.createElement('p');
		
		newPlayerPara.appendChild( newPlayerText );
		characterForm.appendChild( newPlayerPara );
		
		newPlayer2ndPara.appendChild( newPlayer2ndText );
		characterForm.appendChild( newPlayer2ndPara );
	
		if ( wpifw.allowFight ) {
			var newPlayerSubText = document.createTextNode('But before embarking on your adventure, you must first create a character to play in the story and determine your own strengths and weaknesses.');
			var newPlayerSubPara = document.createElement('p');
			newPlayerSubPara.appendChild( newPlayerSubText );
			characterForm.appendChild( newPlayerSubPara );
			
		}
	
	} else {
		
		var prefaceDiv = document.createElement('div');
		prefaceDiv.id = 'custom-preface';
		prefaceDiv.innerHTML = wpifw.preface;
		
		characterForm.appendChild( prefaceDiv );
		
	}
	
	// End custom preface ///
	
	var newPlayerWishText = document.createTextNode('Do you wish to...');
	var newPlayerWishPara = document.createElement('h4');
	newPlayerWishPara.appendChild( newPlayerWishText );
	characterForm.appendChild( newPlayerWishPara );
	
	var characterOptions = document.createElement('div');
	characterOptions.className = 'character-options';
	
	var playButton = document.createElement( 'button' );
	var randomButton = document.createElement( 'button' );
	
	randomButton.id = 'random';
	randomButton.className = 'buttons-2';
	
	playButton.id = 'play';
	playButton.className = 'buttons-2';
	
	
	var playButtonText = document.createTextNode('Create a new character');
	if ( wpifw.allowFight ) {
		var randomButtonText = document.createTextNode('Use a random character');
	} else {
		var randomButtonText = document.createTextNode('Begin reading...');
	}
	
	playButton.appendChild( playButtonText );
	randomButton.appendChild( randomButtonText );
	
	characterForm.appendChild( characterOptions );
	
	if ( wpifw.allowFight )
		characterOptions.appendChild( playButton );
	characterOptions.appendChild( randomButton );
	
	scene.appendChild(characterForm);
	var message = 'player generated';
	var coverImage = document.getElementById('cover-image');
	
	playButton.addEventListener( 'click', function( e ) { 
		e.preventDefault();
		//coverImage.style.display = 'none';
		wpifw.createPlayerForm( this, callback );
		wpifw.scrollTo( this );
		//callback( message );
	});
	
	randomButton.addEventListener( 'click', function( e ) { 
		e.preventDefault();
		if ( coverImage )
			coverImage.style.display = 'none';
		var newPlayerForm = document.getElementById('newPlayerForm');
		if ( newPlayerForm )
			newPlayerForm.parentNode.removeChild( newPlayerForm );
			
		
		
		wpifw.local.player = new wpifw.Pc('You');
		wpifw.local.player.alignment = 'Friend';
		
		var characterForm = document.getElementById('characterForm');
		characterForm.style.display = 'none';
		wpifw.getScene( wpifw.openingScene );
		
		if ( typeof( Storage ) !== "undefined" ) {
			localStorage.setItem('wpifw_Player', JSON.stringify(wpifw.local.player));
		}
	});
		
	var scroller = document.getElementById('scrollsvg');
		
		if ( scroller )
		scroller.addEventListener( 'click', wpifw.coverScroll );
		

}

wpifw.coverScroll = function() {
	
	wpifw.scrollTo( sceneNumberDiv );
}

wpifw.createPlayerForm = function( elm, callback ) {

	elm.removeEventListener( 'click', callback );
	
	if ( !document.getElementById('newPlayerForm') ) {
		
		
		
		var newPlayerForm = document.createElement( 'form' );
		//hr = document.createElement( 'hr' )
		//newPlayerForm.appendChild( hr );
		
		var newPlayerText = document.createTextNode('Please enter a name for your character:');
		var newPlayerPara = document.createElement('p');
		newPlayerPara.id = 'newPlayerPara';
		newPlayerPara.appendChild( newPlayerText );
		
		newPlayerForm.appendChild( newPlayerPara );

		newPlayerForm.id = 'newPlayerForm';
		newPlayerForm.setAttribute('autocomplete', 'off');
		newPlayerForm.setAttribute('onsubmit', 'return false');
		
		var scene = document.getElementsByClassName('scene');
		scene[0].appendChild( newPlayerForm );
		
		var divArray = ['name', 'species', 'gender', 'behaviour', 'stats'];
		for( var key in divArray ) {
			//var elmLabel = document.createElement('label');
			//var elmLabelText = document.createTextNode(divArray[key]);
			//elmLabel.appendChild( elmLabelText );
			var elm = document.createElement('div');
			elm.id = divArray[key];
			newPlayerForm.appendChild( elm );
			//elm.appendChild( elmLabel );
			elm.style.display = 'none';
		}
		
		var name = document.getElementById('name'),
			species = document.getElementById('species'),
			gender = document.getElementById('gender'),
			behaviour = document.getElementById('behaviour'),
			stats = document.getElementById('stats');		
		
		var speciesText = document.createTextNode('Please select a character type:');
		var speciesPara = document.createElement('p');
		speciesPara.id = 'speciesPara';
		speciesPara.appendChild( speciesText );
		species.appendChild( speciesPara );
		
		var genderText = document.createTextNode('Next, choose a gender:');
		var genderPara = document.createElement('p');
		genderPara.id = 'genderPara';
		genderPara.appendChild( genderText );
		gender.appendChild( genderPara );
		
		gender.innerHTML += '<div id="Male" style="display:none"><input name="gender" id="male" type="radio" value="male">Male</input></div><div id="Female" style="display:none"><input name="gender" id="female" value="female" type="radio">Female</input></div><div id="It" style="display:none"><input name="gender" id="it" value="it" type="radio">It</input></div>';

		var newPlayerIntroText = document.createTextNode("Your character's strengths and weaknesses are represented as scores for SKILL, STAMINA and LUCK and you'll be required to call on them throughout your adventure.");
		var newPlayerIntroPara = document.createElement('p');
		newPlayerIntroPara.id = 'newPlayerIntroPara';
		
		
		newPlayerIntroPara.appendChild( newPlayerIntroText );
		
		
		var statsPara = document.createElement('div');
		statsPara.innerHTML  = "<h6>Skill</h6><p>Your skill score reflects your manual dexterity and your general fighting ability; the higher the better.</p>";
		statsPara.innerHTML += "<h6>Stamina</h6><p>Your stamina score reflects your general constitution, your determination and your overall fitness; the higher your stamina score, the longer you will be able to survive.</p>";
		statsPara.innerHTML += "<h6>Luck</h6><p>Your luck score represents your ability to influence events. Don't rely on luck too often as it does run out!</p><a id='playerStatHeading'>&nbsp;</a><h6>Player Statistics</h6>";
		
		stats.appendChild( newPlayerIntroPara );
		stats.appendChild( statsPara );
		
		var playerName = document.createElement( 'input' );
		playerName.id = 'Name';
		name.appendChild( playerName );
		name.style.display = 'block';
		
		wpifw.classless  = false;
		if (wpifw.isEmpty(wpifw.pcDefaults))
			wpifw.classless  = true;
			
		playerName.addEventListener('focus', function() {
					
			this.addEventListener('keyup', function() {

				if ( this.value !== '' ) {
					if ( wpifw.classless === true ) {
						gender.style.display = 'block';
						maleEl = document.getElementById("Male");
						maleEl.style.display = 'block';
						femaleEl = document.getElementById("Female");
						femaleEl.style.display = 'block';
					} else {
						species.style.display = 'block';
					}
				} else {
					species.style.display = 'none';
					spSelect.options[0].selected = 'selected';
					gender.style.display = 'none';
					stats.style.display = 'none';
				}
			});
			
			
		});
	
		var spSelect = document.createElement( 'select' );
		spSelect.id = 'Species';
		
		var opt = document.createElement("option");
		opt.value= 'classless';
		opt.innerHTML = 'Select...';
		spSelect.appendChild( opt );
				
		if (! wpifw.isEmpty(wpifw.pcDefaults)) {
		
			for ( var key in wpifw.pcDefaults ) {
				
				for (  var i = 0; i < wpifw.pcDefaults[key].alignment.length; i++ ) {
				
					if ( wpifw.pcDefaults[key].alignment[i] == "Friend" ) {
						
						console.log( 'can be friend' );
						opt = document.createElement("option");
						opt.value = key;
						if ( key !== '999' ) {
							opt.innerHTML = wpifw.pcDefaults[key].title;
							spSelect.appendChild( opt );
						}
						
					} else {
						
						if (spSelect.length <= 1) {
							wpifw.classless  = true;
						}
					}
				}
			} 
		} 
		
		species.appendChild( spSelect );
		
		newPlayerForm.addEventListener( 'change', function ( e ) {
			
			var selectedSpecies = e.target.value;
			
			if ( e.target.id == 'Species' ) {
				
				wpifw.local.selectedSpecies = spSelect.options[spSelect.selectedIndex].value;
				
				var skillValue = document.getElementById('skill-value'),
					staminaValue = document.getElementById('stamina-value'),
					luckValue = document.getElementById('luck-value'),
					goldValue = document.getElementById('gold-value');	
					
				if ( skillValue ) {
					skillValue.innerHTML = '0';
					staminaValue.innerHTML = '0';
					luckValue.innerHTML = '0';
					goldValue.innerHTML = '0';
				}
				
				if ( !(e.target.value == 'none' || e.target.value == 'random' ) ) {
					
					var genderDivs = gender.getElementsByTagName('div');

					for ( var i = 0; i < 3; i++ ) {
						genderDivs[i].style.display = 'none';
					}

					var gendersArray = wpifw.pcDefaults[selectedSpecies].gender;
					
					gender.style.display = 'block';
					for (var key in gendersArray ) {
						radioKey = document.getElementById( gendersArray[key] );
						radioKey.style.display = 'block';
					}
				}
				
			} else if ( e.target.parentNode.parentNode.id == 'gender' ) {
				
				var genderEl = document.getElementById('genderPara');
				wpifw.scrollTo( genderEl );
				
				stats.style.display = 'block';
				
				wpifw.scrollTo( newPlayerIntroPara );
				
				if ( !document.getElementById('player-stats') )
					stats.innerHTML += '<table id="player-stats"><tbody><tr><td>Stamina</td><td id="stamina-value">0</td><td>Skill</td><td id="skill-value">0</td></tr><tr><td>Luck</td><td id="luck-value">0</td><td>Gold</td><td id="gold-value">0</td></tr></tbody></table><div id="generate-btns"><p>Select "Generate Player Statistics" to assign random values for your character scores. Hint: Keep on selecting until you are happy with your scores! When ready, select "Begin Reading..."</p><button class="buttons-2" id="generate-stats" style="display:inline-block">Generate Player Statistics</button><button class="buttons-2" style="display:none" id="start-read">Begin reading...</button></div>';

				var skillValue = document.getElementById('skill-value'),
					staminaValue = document.getElementById('stamina-value'),
					luckValue = document.getElementById('luck-value'),
					goldValue = document.getElementById('gold-value'),				
					genStats = document.getElementById('generate-stats'),
					startRead = document.getElementById('start-read');
					
			var statsDiv = document.getElementById('stats');
			var coverImage = document.getElementById('cover-image');
			//wpifw.smoothScroll( statsDiv );	
					
				genStats.addEventListener('click', function( e ) {
					e.preventDefault();
					//coverImage.style.display = 'none';
					wpifw.scrollTo( playerStatHeading );
					generateStats();
				});
				
				startRead.addEventListener('click', function( e ) {
					e.preventDefault();
					if (wpifw.coverImage !== null )
					coverImage.style.display = 'none';
					//var message = 'character generated';
					characterForm.style.display = 'none';
					newPlayerForm.style.display = 'none';
					wpifw.getScene( wpifw.openingScene );
				});

				function generateStats() {
					
					if (wpifw.classless === false ) {
						var skillRoll = wpifw.pcDefaults[wpifw.local.selectedSpecies].skill,
							staminaRoll = wpifw.pcDefaults[wpifw.local.selectedSpecies].stamina,
							luckRoll = wpifw.pcDefaults[wpifw.local.selectedSpecies].luck,
							goldRoll = wpifw.pcDefaults[wpifw.local.selectedSpecies].gold;
						
					} else {
						var skillRoll, staminaRoll, luckRoll, goldRoll;
					}
						
					if ( typeof skillRoll != 'object') skillRoll = ['2d6']; 
					if ( typeof staminaRoll != 'object' ) staminaRoll = ['2d6']; 
					if ( typeof luckRoll != 'object') luckRoll = ['2d6']; 
					if ( typeof goldRoll != 'object') goldRoll = ['2d6']; 
					
					var skill = wpifw.Dice.roll(skillRoll[0]),
						stamina = wpifw.Dice.roll(staminaRoll[0]),
						luck = wpifw.Dice.roll(luckRoll[0]),
						gold = wpifw.Dice.roll(goldRoll[0]);
					
					
					var nameEl = document.getElementById("Name");
					
					species = spSelect.options[spSelect.selectedIndex].value;
					
					/* key 
					------------------------------------------- */
					//n = name, sp = species, a = alignment, g = gender, b = behaviour, sk = skill, st = stamina, l = luck, gd = gold;
					
					var genders = document.getElementsByName('gender'),
						gender_value;
					for(var i = 0; i < genders.length; i++){
    					if(genders[i].checked){
        					gender_value = genders[i].value;
    					}
					}
					
					wpifw.local.player = new wpifw.Pc('You', species, 'Friend', gender_value, 'Attacker', skill, stamina, luck, gold);
					
					wpifw.local.player.givenName = nameEl.value;
					
					//check for profanity
					wpifw.profanityFilter = new wpifw.HttpRequest();
					wpifw.profanityFilter.get( 'swearWords.json', function( answer ) {
						
						wpifw.profanityCheck = JSON.parse( answer );
						
						for (var i in wpifw.profanityCheck ) {
							if ( wpifw.local.player.givenName.match( wpifw.profanityCheck[i] ) ) {
								wpifw.local.player.givenName = '******';		
							}
						}
						wpifw.profanityCheck = [];
					});
					
					skillValue.innerHTML = skill;
					staminaValue.innerHTML = stamina;
					luckValue.innerHTML = luck;
					goldValue.innerHTML = gold;
					
					startRead.style.display = 'inline-block';
		
					if ( typeof( Storage ) !== "undefined" ) {
						localStorage.setItem('wpifw_Player', JSON.stringify(wpifw.local.player));
					}

				}				
			}
		});
	}
	
}

wpifw.resetScroll = function() {
	document.body.scrollTop = document.documentElement.scrollTop = 0;
}

wpifw.getPlayer = function( callback ) {
	
	wpifw.playerSceneNumber =  wpifw.playerSceneNumber + 1;
	 
	var scene = document.createElement( 'div' );
	scene.className = 'scene';
	article.appendChild( scene );
	
	if ( wpifw.playerSceneNumber <= 0 ) {
		chapter = '';
	} else {
		chapter = wpifw.playerSceneNumber;
	}
				
	scene.innerHTML += '<div id="sceneNumberDiv"><p id="sceneNumberEl">' + chapter + "</p></div><h2 style='font-size:55px'>Welcome back!</h2><p style='text-align:center;margin-bottom:2em'>We've found some details from your last visit; would you like to continue reading or start again from the beginning?</p><h4 style='margin-bottom:1em'>You MUST now choose...</h4>";
	
	scene.innerHTML += '<div id="continue-restart"><button class="buttons-2" id="continue">Continue reading</button><button class="buttons-2" id="restart">Start again</button></div>';
	
	if ( typeof( Storage ) !== "undefined" ) {
		var pObj = JSON.parse(localStorage.getItem('wpifw_Player'));
		wpifw.local.player = new wpifw.Pc( pObj.name, pObj.species, pObj.alignment, pObj.gender, pObj.behaviour, pObj.skill, pObj.stamina, pObj.luck, pObj.gold );
		wpifw.local.player.givenName = pObj.givenName;
		wpifw.sceneObject = JSON.parse(localStorage.getItem('wpifw_Scene'));
	} else {
		wpifw.createPlayer();
	}
	
	//var restartDiv = document.getElementById('continue-restart');
	//var coverImage = document.getElementById('cover-image');
	
	
		
	var continueButton = document.getElementById('continue');
	continueButton.addEventListener('click', function( e ) {
			e.preventDefault();
			article.innerHTML = '';
			wpifw.resetScroll();
			wpifw.addLoader( article );
			if ( wpifw.sceneObject !== null ) {
				wpifw.processScene( wpifw.sceneObject );
			} else {
				wpifw.getScene( wpifw.openingScene );	
			}
	});
	var restartButton = document.getElementById('restart');
	restartButton.addEventListener('click', function( e ) {
		e.preventDefault();
		article.innerHTML = '';
		wpifw.resetScroll();
		localStorage.removeItem('wpifw_Player');
		localStorage.removeItem('wpifw_Scene');
								
		wpifw.generatePlayer( function ( message ) { 
					
			wpifw.getScene( wpifw.openingScene );					
		});
	});
	
	var scroller = document.getElementById('scrollsvg');
	
	if ( scroller )
	scroller.addEventListener( 'click', wpifw.coverScroll );
	

}

wpifw.updatePlayer = function() {
	
	localStorage.setItem('wpifw_Player', JSON.stringify(wpifw.local.player));
	localStorage.setItem('wpifw_Scene', JSON.stringify(wpifw.sceneObject));
}