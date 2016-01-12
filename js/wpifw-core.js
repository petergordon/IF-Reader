
/* **********************************************
     Begin wpifw-core.js
********************************************** */

/*
*  wpifw core
*
*  Create namespace.
*  
*
*  @type	function
*  @date	21/02/2015
*  @since	0.0.1
*
*  @param	
*  @return	getScene
*/

var wpifw = (function() {
	
	/*
	*	startsWith & endsWith
	*
	*/	
 	if ( typeof String.prototype.startsWith != 'function' ) {

		String.prototype.startsWith = function ( str ) {
			return this.indexOf( str ) == 0;
		};
	}
	
	 if ( typeof String.prototype.endsWith != 'function' ) {

		String.prototype.endsWith = function ( str ) {
			return this.indexOf( str, this.length - str.length ) !== -1;
		};
	}
	
	/*
	*	HttpClient
	*
	*/
	function init( callback ) {
		
		wpifw.getPcDefaults( callback );
	}

	function HttpRequest() {};
	HttpRequest.prototype.get = function ( url, callback ) {
		
		var xhr = new XMLHttpRequest();
		
		xhr.onreadystatechange = function() { 
		
			if ( xhr.readyState == 4 && xhr.status == 200 ) {
				
				callback(xhr.responseText);
				
			} else if ( xhr.readyState == 4 && xhr.status == 404 ) {
				
				var notFound = JSON.stringify({ ID: 404 }); 
				callback( notFound );
			}
		};

		xhr.open( "GET", url, true );  
		xhr.send( null );
			
	}
	
	/*
	*	Get Scene
	*
	*/

	function getScene( sceneUrl ) {
		
		wpifw.combat.combatView.active = false;
		addLoader( article );
		
				
		if ( sceneUrl.endsWith("Select...") ) {
			
			wpifw.sceneObject = [];
			wpifw.sceneObject.id = 404;
			processScene( wpifw.sceneObject );
			
		} else {
		
			wpifw.sceneRequest = new HttpRequest();
			
			wpifw.sceneRequest.get( sceneUrl, function( answer ) {
				
				wpifw.sceneObject = JSON.parse( answer );
				processScene( wpifw.sceneObject );
			});
			
		}
	
	}
	
	/*
	*	Get featuredImage
	*
	*/

	function getFeaturedImage( featuredImageUrl, callback ) {
		
		var fImgUrl = '/wp-json/wp/v2/media/' + featuredImageUrl;
		
		wpifw.featuredImageRequest = new HttpRequest();
		
		wpifw.featuredImageRequest.get( fImgUrl, function( answer ) {
			
			wpifw.featuredImageObject = JSON.parse( answer );
			callback();
		});		
	
	}
	
	/*
	*	Get Cover Image
	*
	*/
	
	function getCoverImage( coverImageUrl ) {
		
		article.innerHTML += '';
		
		addLoader( article );
		
		if ( coverImageUrl == null) {

			if(!localStorage.wpifw_Player) {
				wpifw.createPlayer(  );
			} else if (!localStorage.wpifw_Scene){
				wpifw.createPlayer(  );
			} else {
				wpifw.getPlayer(  );
			}
			removeLoader();
			return
		}
		
				
		wpifw.coverImageRequest = new HttpRequest();
		
		wpifw.coverImageRequest.get( coverImageUrl, function( answer ) {
			
			wpifw.coverImageObject = JSON.parse( answer );
			
				removeLoader();
			
				var scrollIcon = document.createElement('div');
				if ( wpifw.iconColor ) {
					var icon_color = wpifw.iconColor;
				} else {
					var icon_color = '#ffffff';
				}
				scrollIcon.id = 'scroll-icon';
				scrollIcon.innerHTML = '<svg id="scrollsvg" version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="-280 414 50 56"><path fill="' + icon_color + '" stroke="none" d="M-230.6,444l-2.1-2l-22.3,22.3l-22.4-22.3l-2,2l24.4,24.4L-230.6,444 M-277.4,420l-2,2l24.4,24.3l24.4-24.3l-2.1-2	l-22.3,22.3L-277.4,420"/></svg>';
				article.appendChild( scrollIcon );	
				
				var coverImage = document.createElement( 'div' );
				coverImage.className = 'scene-image';
				coverImage.id = 'cover-image';
				coverImage.style.backgroundImage = "url('" + wpifw.coverImageObject.source_url + "')";
				article.appendChild( coverImage );
				
				if ( wpifw.coverImageOverlay != null ) {
					
				wpifw.coverImageOverlayRequest = new HttpRequest();
				wpifw.coverImageOverlayRequest.get( wpifw.coverImageOverlay, function( answer ) {
					
					wpifw.coverImageOverlayObject = JSON.parse( answer );
					wpifw.coverImageSVGOverlayRequest = new HttpRequest();
					
					function getFileExtension(fname) {
						var fileExtension = fname.substr((~-fname.lastIndexOf(".") >>> 0) + 2);
						return fileExtension;
					}
					
					var overlayFileExtension = getFileExtension( wpifw.coverImageOverlayObject.source_url );
					
					wpifw.coverImageSVGOverlayRequest.get( wpifw.coverImageOverlayObject.source_url, function( answer ) {
						
						if ( overlayFileExtension == 'svg') {

							var svgDiv = document.createElement('div');
							svgDiv.id = 'svgDiv';
							svgDiv.innerHTML = answer;	
							
							if (svgDiv.hasChildNodes()) {
								for (var i = 0; i < svgDiv.childNodes.length; i++ ) {
									if ( svgDiv.childNodes[i] instanceof SVGElement ) {
										coverImage.insertBefore(svgDiv, coverImage.childNodes[0]);	
									} else {
									}
								}
							} else {
								console.log( 'no childnodes' );
							}

						} else if ( overlayFileExtension == 'png' || overlayFileExtension == 'jpg' || overlayFileExtension == 'jpeg' || overlayFileExtension == 'gif' ){
							var overlayURL = wpifw.coverImageOverlayObject.source_url;
							var imgDiv = document.createElement('div');
							imgDiv.id = 'imgDiv';
							imgDiv.innerHTML = '<img src="' + overlayURL + '" />';
							coverImage.insertBefore(imgDiv, coverImage.childNodes[0]);
								
						} else if ( overlayFileExtension == 'mp4' ) {
							console.log( 'we have a movie' );
						}
						
						removeLoader();
					
						if(!localStorage.wpifw_Player) {
							wpifw.createPlayer(  );
						} else if (!localStorage.wpifw_Scene){
							wpifw.createPlayer(  );
						} else {
							wpifw.getPlayer(  );
						}
						
					});
				});
				
			} else {
				
				if(!localStorage.wpifw_Player) {
					wpifw.createPlayer(  );
				} else if (!localStorage.wpifw_Scene){
					wpifw.createPlayer(  );
				} else {
					wpifw.getPlayer(  );
				}
				removeLoader();
				return
			}
		});		
	
	}

	/*
	*	getCombatants
	*
	*	Long -----------------
	*	Description ----------
	*
	*	@type	function
	*	@date	21/02/2015
	*	@since	0.0.1
	*
	*	@param	
	*	@return	
	*/
	function getCombatants( combatantIdArray ) {
		
		addLoader( article );
		
		wpifw.combatantsObjectsArray = [];
		wpifw.combatantRequest = [];
		wpifw.numberOfCombatants = combatantIdArray.length;
		wpifw.combatantOutstanding = combatantIdArray.length;
		
		for ( var i = 0; i < wpifw.numberOfCombatants; i++ ) {
			
			if ( wpifw.pcDefaults[combatantIdArray[i]] ) {			
				var combatantUrl = "/wp-json/wp/v2/character_defaults/" + combatantIdArray[i];
			} else {
				var combatantUrl = "/wp-json/wp/v2/characters/" + combatantIdArray[i];
			}
			
			
			wpifw.combatant = new XMLHttpRequest();
			wpifw.combatantRequest.push(wpifw.combatant);
			
			wpifw.combatantRequest[i].onreadystatechange = function() { 
		
				if (this.readyState == 4 && this.status == 200) {
					wpifw.combatantOutstanding = wpifw.combatantOutstanding - 1;
					processCombatant(this.responseText);
				};
			}
			wpifw.combatantRequest[i].open( "GET", combatantUrl, true );  
			wpifw.combatantRequest[i].send( null );
		}
	}		
	
	/*
	*	processCombatants
	*
	*/
	
	function processCombatant( combatantObject ) {
		
		var combatant = JSON.parse( combatantObject );
		wpifw.combatantsObjectsArray.push( combatant );
		
		if ( wpifw.combatantOutstanding == 0 ) {
		
			generateCombatants( wpifw.combatantsObjectsArray );
		}
	}

	/*
	*	generateCombatants
	*
	*/
	
	function generateCombatants( combatantsObjectsArray ) {
		
		removeLoader();
		
		var combatants = [],
			numberInArray = combatantsObjectsArray.length;
			
		combatants.push( wpifw.local.player );
		
		for ( var i = 0; i < numberInArray; i++ ) {
			
			if ( combatantsObjectsArray[i].type == 'characters' ) {
				
				var title = combatantsObjectsArray[i]['title'].rendered, 
					name = combatantsObjectsArray[i]['custom_meta']['character_profile'][title].name,
					species = combatantsObjectsArray[i]['custom_meta']['character_profile'][title].species,
					alignment = combatantsObjectsArray[i]['custom_meta']['character_profile'][title].alignment,
					gender = combatantsObjectsArray[i]['custom_meta']['character_profile'][title].gender,
					behaviour = combatantsObjectsArray[i]['custom_meta']['character_profile'][title].behaviour,
					skill = combatantsObjectsArray[i]['custom_meta']['character_profile'][title].skill,
					stamina = combatantsObjectsArray[i]['custom_meta']['character_profile'][title].stamina,
					luck = combatantsObjectsArray[i]['custom_meta']['character_profile'][title].luck,
					gold = combatantsObjectsArray[i]['custom_meta']['character_profile'][title].gold,
					a = new wpifw.Pc( name, species, alignment, gender, behaviour, skill, stamina, luck, gold );
					
				combatants.push( a );
					
			} else if ( combatantsObjectsArray[i].type == 'character_defaults' ) {
				
				var title = combatantsObjectsArray[i].title.rendered,
					id = combatantsObjectsArray[i]['id'];
					
					var a = new wpifw.Pc( title, id );

				combatants.push( a );
			}
		}
		
		
		
		countDuplicates(combatants);
		
		function countDuplicates( c ) {
			
			wpifw.combat.count = [];
			var a = [], b = [], prev;
			
			function compare(a,b) {
			  if (a.name < b.name)
				return -1;
			  if (a.name > b.name)
				return 1;
			  return 0;
			}
			
			c.sort(compare);

			for ( var i = 0; i < c.length; i++ ) {
				if ( c[i].name !== prev ) {
					a.push(c[i].name);
					b.push(1);
				} else {
					b[b.length-1]++;
				}
				prev = c[i].name;
			}
		
//			console.dir( a );
//			console.dir( b );
//			console.dir( c );
			
			for ( var i = 0; i < b.length; i++ ) {
				
				if ( b[i] > 1 ) {
					wpifw.combat.count[a[i]] = 0;
					for ( var j = 0; j < c.length; j++ ) {
						if (c[j].name == a[i]) {
							wpifw.combat.count[a[i]]++;
							if ( wpifw.combat.count[a[i]] == 1 ) {
							} else {
								c[j].name += " " + wpifw.combat.count[a[i]];
							}
						}
					}
				}
			
			}
		wpifw.combatants = combatants;	
		}
		
		var fight_options = document.getElementsByClassName("fight-options");
		
		var fightScene = document.getElementsByClassName('scene');
		var currentFightScene = fightScene[ fightScene.length - 1 ];

		var numButtons = 1;
		
		if (wpifw.combat.fleeOption) 
			numButtons ++;
			
		if (wpifw.combat.mercyOption) 
			numButtons ++;	
		
		fight_options[0].innerHTML += '<button class="buttons-'+ numButtons +'" id="startCombat">Fight</button>';
		
		if ( wpifw.combat.fleeOption )
			fight_options[0].innerHTML += '<button class="buttons-'+ numButtons +'" id="flee" disabled >Flee</button>';

			
		if ( wpifw.combat.mercyOption )
			fight_options[0].innerHTML += '<button class="buttons-'+ numButtons +'" id="mercy" disabled >Mercy</button>';
			
		if (wpifw.combat.combatRound == 0 ) {
			wpifw.combat.fight(wpifw.combatants);
		}

		if ( wpifw.combat.fleeOption ) {
			document.getElementById("flee").onclick = function() { 
	
				wpifw.luck.testLuck( wpifw.sceneObject.custom_meta.choice[2].successChance, function( chance, luckRoll, result ) {
						
					wpifw.combat.combatView.renderFleeView( chance, luckRoll, result, function( result ) {
						
						if ( result == false ) {
							wpifw.combat.fight( wpifw.combatants );
						} else if ( result == true ) {
							wpifw.combat.endCombat();
							currentFightScene.innerHTML += wpifw.generateFightMessage( 'flee' );
							//setTimeout(function(){ wpifw.getScene('/wp-json/wp/v2/scene/' + wpifw.sceneObject.custom_meta.choice[2].fleeDestination); }, 1500);
						}
					});
				});
			};
		}
		if ( wpifw.combat.mercyOption ) {
			document.getElementById("mercy").onclick = function() { 
				
				wpifw.combat.endCombat();
				currentFightScene.innerHTML += wpifw.generateFightMessage( 'mercy' );				
				setTimeout(function(){ wpifw.getScene('/wp-json/wp/v2/scene/' + wpifw.sceneObject.custom_meta.choice[2].mercyDestination); }, 1500);
			};
		}
				
		document.getElementById("startCombat").onclick = function(){ 
			
			wpifw.scrollTo( fight_options[0] );	
			wpifw.combat.fight( wpifw.combatants );
			
		};
	}
	
	/*
	*	processAnswer
	*
	*	Long -----------------
	*	Description ----------
	*
	*	@type	function
	*	@date	21/02/2015
	*	@since	0.0.1
	*
	*	@param	
	*	@return	
	*/
	
	function processScene( sceneObject ) {

		wpifw.updatePlayer();
		
		var characterViews = document.getElementsByClassName( 'character-shortcode' );
		
		var numCharacterLinks = characterViews.length;
		for ( var i = 0; i < numCharacterLinks; i++ ) {
			characterViews[0].className = 'character-shortcode-disabled';
		}
		
		wpifw.adjustSceneAnchor();

		if ( sceneObject.id === 404 || sceneObject.id === undefined ) {
			var choice = 'no-options';
			wpifw.sceneObject.content = '<p style="text-align:center">Sorry, this scene is currently unavailable.</p>'
		} else {
			var choice = sceneObject.custom_meta.choice[0];
		}
		
		if ( sceneObject.featured_image ) {
			
			article.innerHTML += '<div class="scene-image"></div>'
			
			wpifw.getFeaturedImage( sceneObject.featured_image, function() {

				//removeLoader();				
				var featuredImages = document.getElementsByClassName("scene-image");
				var latestFeaturedImage = featuredImages[featuredImages.length - 1];
				var featuredImage = document.createElement('img');
				featuredImage.src = wpifw.featuredImageObject.source_url;
				
				latestFeaturedImage.appendChild( featuredImage );
				renderSceneContent();
			});
			
		} else {
			
			renderSceneContent();
			
		}
		
		function renderSceneContent() {
			
			var scene = document.createElement('div');
			var article = document.getElementById('article');
			scene.id = 'scene-' + wpifw.playerSceneNumber;
			scene.className = 'scene';
			
			article.appendChild( scene );
			
			if ( wpifw.playerSceneNumber == 0 ) {
				chapter = '';
			} else {
				chapter = wpifw.playerSceneNumber;
			}
		
			scene.innerHTML += '<div id="sceneNumberDiv"><p id="sceneNumberEl">' + chapter + '</p></div>';
			
			var sceneContent = document.createElement('div');
			sceneContent.className = 'scene-content';
			if (sceneObject.content.rendered) {
				
				var sceneContentText = sceneObject.content.rendered;
				checkForPlayerName( sceneContentText );
			} else {
				var sceneContentText = sceneObject.content;
				checkForPlayerName( sceneContentText );
			}
			
			
			function checkForPlayerName( sceneContentText ) {
				
				if (  typeof sceneContentText != 'object' ) {
				
					if ( sceneContentText.indexOf("[playername]") > -1 || sceneContentText.indexOf("[playerName]") > -1 ) {
						if ( wpifw.local.player.givenName == undefined ) {
							var playerName = 'unknown';
						} else {
							var playerName = "<span class='playerName'>" + wpifw.local.player.givenName + "</span>";
						}
						sceneContent.innerHTML += sceneContentText.replace("[playerName]", playerName).replace("[playername]", playerName);
						
					} else {
						sceneContent.innerHTML += sceneContentText;
					}
				
				}
			}
			
			
			
			scene.appendChild( sceneContent );
			

			if (choice == 'no-options') {
				
				scene.innerHTML += '<p id="the-end" style="text-align:center">The End.</p>'
				if ( sceneObject.custom_meta ) 
					scene.innerHTML += '<p id="the-footnote" style="text-align:center; text-indent:0">' + sceneObject.custom_meta.choice[1].ending + '</p>';
				scene.innerHTML += '<div style="text-align:center"><button style="margin:3em auto" class="buttons-2" id="end-restart">Restart</button></div>';
					
				var endRestartButton = document.getElementById('end-restart');
				endRestartButton.addEventListener('click', function( e ) {
			
					e.preventDefault();
					article.innerHTML = '<a id="currentScene"></a>';
					wpifw.resetScroll();
					localStorage.removeItem('wpifw_Player');
					localStorage.removeItem('wpifw_Scene');
											
					//console.log('generating player');
					wpifw.generatePlayer( function ( message ) { 
								
						wpifw.getScene( wpifw.openingScene );					
					});
				});
	
			
			} else if ( choice == 'choice-options' ) {
						
				var optionButtons = document.getElementsByTagName("button");
				for(var i=0;i<optionButtons.length;i++){
					optionButtons[i].classList.remove("button");
					if (!optionButtons[i].classList.contains("chosen"))
						optionButtons[i].classList.add("ignored");
				}
				
				if ( sceneObject.custom_meta.choice[1] == undefined ) {
					
					sceneObject.custom_meta.choice[1] = [];
					sceneObject.custom_meta.choice[1].choice = "No choices defined";
					sceneObject.custom_meta.choice[1].destination = "none";
					
				}
								
				numOptions = sceneObject.custom_meta.choice.length;
				numOptionsClass = 'buttons-' + (numOptions - 1);
				
				var choice_options = document.createElement('div');
				var choice_header = document.createElement('h4');
				choice_options.className = 'choice-options';
				
				if ( sceneObject.custom_meta.choice[1].destination !== "none" ) {
				
					for ( var i = 1; i < numOptions; i++ ) {
						choice_options.innerHTML += '<button class="button ' + numOptionsClass + '" data-follow-on="' + sceneObject.custom_meta.choice[i]["destination"] + '">' + sceneObject.custom_meta.choice[i]["choice"] + '</button>';
					}
					
				} else {
						choice_options.innerHTML += '<button class="button ' + numOptionsClass + ' chosen" >' + sceneObject.custom_meta.choice[1].choice + '</button>';
				}
					
				
				scene.appendChild(choice_header);
				scene.appendChild(choice_options);
				
				var classname = document.getElementsByClassName("button"),
					tallestButton = '70';
					
				if ( classname.length > 1 ) {
					var choiceText = document.createTextNode('You MUST now choose...');				
				
					for(var i=0;i<classname.length;i++){
					
						var style = window.getComputedStyle(classname[i]),
							elHeightValue = style.getPropertyValue('height');
							elHeight = parseInt(elHeightValue, 10);
						
						if ( elHeight > tallestButton ) {
							tallestButton = elHeight;
						}
						classname[i].addEventListener('click', buttonClicked, false);
					}
					
					for(var i=0;i<classname.length;i++){
						classname[i].style.minHeight = tallestButton + 'px';
					}
	
				
				} else {
					var choiceText = document.createTextNode('You MUST click to continue...');	
					classname[0].addEventListener('click', buttonClicked, false);
				}
				
				choice_header.appendChild(choiceText);
				
			} else if (choice == 'fight-options') {
				
				var optionButtons = document.getElementsByTagName("button");
				for(var i=0;i<optionButtons.length;i++){
					optionButtons[i].classList.remove("button");
					if (!optionButtons[i].classList.contains("chosen"))
						optionButtons[i].classList.add("ignored");
				}
				
				var combatantIdArray = [],
					numCombatants = sceneObject.custom_meta.choice[1]['combatants'].length,
					fleeOption = false,
					mercyOption = false;
				
				if ( sceneObject.custom_meta.choice[2]['flee'] )
					fleeOption = true;
				
				if ( sceneObject.custom_meta.choice[2]['mercy'] )
					mercyOption = true;	
					
				var fight_options = document.createElement('div');
					fight_options.className = 'fight-options';
					
				fight_options.innerHTML += '<h4>You MUST now fight...</h4>';	
				
				if ( numCombatants !== 0 ) {
				
					for ( var i = 0; i < numCombatants; i++ ) {
						
						var id = sceneObject.custom_meta.choice[1]['combatants'][i];
						
						if ( id.startsWith("random-") ) {
						
							var idArray = id.split("random-");
							id = idArray[1];
						}
						combatantIdArray.push( id );
					}
					
					wpifw.combat.fleeOption = fleeOption;
					wpifw.combat.mercyOption = mercyOption;
		
					scene.appendChild(fight_options);
					wpifw.getCombatants( combatantIdArray );
				
				} else {
					
					scene.appendChild(fight_options);
					fight_options.innerHTML += "<h6 style='text-align:center'>but there are no combatants</h4>";
					
				}
				
				
			} else if (choice == 'luck-options') {	
			
				var optionButtons = document.getElementsByTagName("button");
				for(var i=0;i<optionButtons.length;i++){
					optionButtons[i].classList.remove("button");
					if (!optionButtons[i].classList.contains("chosen"))
						optionButtons[i].classList.add("ignored");
				}
			
				var luck_options = document.createElement('div');
					luck_options.className = 'luck-options';
					luck_options.id = 'luck-table';
					
				luck_options.innerHTML += '<h4 style="margin-bottom:1em">You MUST now choose...</h4>';
				luck_options.innerHTML += '<button id="chance" class="buttons-2" >Take the chance</button>';
				luck_options.innerHTML += "<button id='no-chance' class='buttons-2' >Don't risk it</button>";
				
				scene.appendChild(luck_options);
				
				var chance = document.getElementById('chance');
				chance.addEventListener('click', wpifw.luck.chanceButtonClicked, false);
				var no_chance = document.getElementById('no-chance');
				no_chance.addEventListener('click', wpifw.luck.noChanceButtonClicked, false);

				
			} else if (choice == 'passphrase-options') {
				
				var optionButtons = document.getElementsByTagName("button");
				for(var i=0;i<optionButtons.length;i++){
					optionButtons[i].classList.remove("button");
					if (!optionButtons[i].classList.contains("chosen"))
						optionButtons[i].classList.add("ignored");
				}
				
				var passphrase_options = document.createElement('div');					
					passphrase_options.className = 'passphrase-options';
				
				passphrase_options.innerHTML += '<h4 style="margin-bottom:1em">You MUST now respond...</h4>';
				var passphrase_input = document.createElement('input');
				passphrase_input.id = 'passphrase-input';
				
				var submit_input = document.createElement('button'),
					decline_input = document.createElement('button'),
					answer_input = document.createElement('button'),
					response_text = document.createElement('div');
					response_text.id = 'response-text';
					
				submit_input.innerHTML = 'Submit';	
				submit_input.id = 'submit-passphrase';
				decline_input.innerHTML = 'Decline';
				decline_input.id = 'decline-passphrase';
				answer_input.innerHTML = 'Answer';
				answer_input.id = 'answer-passphrase';
					
				submit_input.className = answer_input.className = decline_input.className = 'buttons-2';
				submit_input.style.margin = '0 auto';
				
				passphrase_options.appendChild(answer_input);
				passphrase_options.appendChild(decline_input);
				decline_input.style.marginRight = '0';
				passphrase_options.appendChild(passphrase_input);
				passphrase_options.appendChild(submit_input);
				passphrase_input.style.display = 'none';
				submit_input.style.display = 'none';
				passphrase_options.appendChild(response_text);
				
				scene.appendChild(passphrase_options);
				//passphrase_input.focus();
				passphrase_input.addEventListener('keypress', function( event ) {
					submit_input.style.display = 'block';
					if (event.keyCode == 13) {
						wpifw.passphrase.submitButtonClicked();
					}
					
				});
				
				submit_input.addEventListener('click', wpifw.passphrase.submitButtonClicked, false);
				answer_input.addEventListener('click', wpifw.passphrase.submitButtonClicked, false);
				//var no_chance = document.getElementById('no-chance');
				decline_input.addEventListener('click', wpifw.passphrase.declineButtonClicked, false);
				
				

			
			}
			
			removeLoader();
			wpifw.scrollTo( currentScene );
			
			wpifw.characterView.activateShortcodes( document );
		}
	}
	
	/*
	*	buttonClicked
	*
	*	Long -----------------
	*	Description ----------
	*
	*	@type	function
	*	@date	23/02/2015
	*	@since	0.0.1
	*
	*	@param	
	*	@return	
	*/
	
	function buttonClicked() {
		
		if ( this.getAttribute("data-follow-on") ) {
			
			if ( this.getAttribute("data-follow-on") !== "Select..." ) {
		
				addLoader( article );
			
				var follow_on = this.getAttribute("data-follow-on");
				
				this.classList.add("chosen");
				this.classList.remove("button");		
				
				sceneUrl =  '/wp-json/wp/v2/scene/' + follow_on + '/';
		
				wpifw.sceneRequest = new HttpRequest();
					
				wpifw.sceneRequest.get(sceneUrl, function(answer) {
					wpifw.sceneObject = JSON.parse(answer);
					processScene( wpifw.sceneObject )
				});
			}
		
		}

	}
	
	function addLoader( target ) {
		
		var loading_options = document.createElement( 'div' ),
			loader = document.createElement( 'div' );
			
		loading_options.id = 'loader-options';
		loader.className = 'loader';
			
		loading_options.appendChild( loader );
		target.appendChild( loading_options );
		
	}
	
	function removeLoader() {
		
		loading = document.getElementById('loader-options');
		if ( loading )
		loading.parentNode.removeChild( loading );
	}
	
	function generateFightMessage( result ) {
		
		messageString = "<div class='fight-message'><h4>You MUST now fight...</h4>"
		
		if ( result == 'defeat' ) {
			fightResult = 'You are DEFEATED in combat!';
		} else if ( result == 'victory' ) {
			fightResult = 'You are VICTORIOUS in combat!';
		} else if ( result == 'flee' ) {
			fightResult = 'You manage to FLEE the fight!';
		} else if ( result == 'mercy' ) {
			fightResult = 'You show MERCY to your foe!';
		}
		
		if ( wpifw.combat.fleeOption && wpifw.combat.mercyOption ) {
			
			messageString += "<button class='buttons-3 "; 
			
			if ( result == 'defeat' || result == 'victory' ) { messageString += " chosen'"; 
			} else { messageString += "ignored'";
			} messageString += ">Fight</button><button class='buttons-3 ";
			
			if ( result == 'flee' ) { messageString += "chosen";
			} else { messageString += "ignored";
			} messageString += "'>Flee</button><button class='buttons-3 "
			
			if ( result == 'mercy') { messageString += " chosen";
			} else { messageString +=  " ignored";
			} messageString += "'>Mercy";
		
		} else if ( wpifw.combat.fleeOption ) {
			
			messageString += "<button class='buttons-2 "
			if ( result == 'defeat' || result == 'victory' ) { messageString += "chosen'"; 
			} else { messageString += "ignored'";
			} messageString += "'>Fight</button><button class='buttons-2 ";
			
			if ( result == 'flee' ) { messageString += "chosen";
			} else { messageString += "ignored";
			} messageString += "'>Flee";
			
		} else if (  wpifw.combat.mercyOption ) {
			
			messageString += "<button class='buttons-2 "
			if ( result == 'defeat' || result == 'victory' ) { messageString += "chosen'"; 
			} else { messageString += "ignored'";
			} messageString += "'>Fight</button><button class='buttons-2 ";
			
			if ( result == 'mercy' ) { messageString += "chosen";
			} else { messageString += "ignored";
			} messageString += "'>Mercy";
							
		} else {
			
			messageString += "<button class='buttons-1 chosen'>Fight</button>";
			
		}
		
		messageString += "</button><h6>" + fightResult + "</h6></div>";	
		
		return ( messageString );

	
	}
	
	/*
	*
	*	http://www.quirksmode.org/js/findpos.html
	*
	*/
	
	function findPos( obj ) {
		var curtop = 0;
		if (obj.offsetParent) {
			do {
				curtop += obj.offsetTop;
			} while (obj = obj.offsetParent);
		//curtop = curtop - 64;
		return [curtop];
		
		}
	}
	
	function currentYPosition() {
		// Firefox, Chrome, Opera, Safari
		if (self.pageYOffset) return self.pageYOffset;
		// Internet Explorer 6 - standards mode
		if (document.documentElement && document.documentElement.scrollTop)
			return document.documentElement.scrollTop;
		// Internet Explorer 6, 7 and 8
		if (document.body.scrollTop) return document.body.scrollTop;
		return 0;
	}

	/*
	*	smoothScroll
	*
	*   http://web.archive.org/web/20140213105950/
	*	http://itnewb.com/tutorial/Creating-the-Smooth-Scroll-Effect-with-JavaScript
	*
	*/
	function smoothScroll(eID) {
		
		var startY = currentYPosition(),
			stopY = findPos(eID),
			distance = stopY > startY ? stopY - startY : startY - stopY;
		
		if (distance < 100) {
			
			scrollTo(0, stopY); return;
		}
		
		var speed = Math.round(distance / 100);
		
		if (speed >= 20)
			speed = 20;
		
		var step = Math.round(distance / 100),
			leapY = stopY > startY ? startY + step : startY - step,
			timer = 0;
		
		if (stopY > startY) {
			for ( var i=startY; i<stopY; i+=step ) {
				
				setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
				leapY += step; if (leapY > stopY) leapY = stopY; timer++;
			} return;
		}
		
		for ( var i=startY; i>stopY; i-=step ) {
			
			setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
			leapY -= step; if (leapY < stopY) leapY = stopY; timer++;
		}
	}
	
	/*
	https://gist.github.com/james2doyle/5694700
	*/
	// easing functions http://goo.gl/5HLl8
	Math.easeInOutQuad = function (t, b, c, d) {
	  t /= d/2;
	  if (t < 1) {
		return c/2*t*t + b
	  }
	  t--;
	  return -c/2 * (t*(t-2) - 1) + b;
	};
	
	Math.easeInCubic = function(t, b, c, d) {
	  var tc = (t/=d)*t*t;
	  return b+c*(tc);
	};
	
	Math.inOutQuintic = function(t, b, c, d) {
	  var ts = (t/=d)*t,
	  tc = ts*t;
	  return b+c*(6*tc*ts + -15*ts*ts + 10*tc);
	};
	
	// requestAnimationFrame for Smart Animating http://goo.gl/sx5sts
	var requestAnimFrame = (function(){
	  return  window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function( callback ){ window.setTimeout(callback, 1000 / 60); };
	})();
	
	function scrollTo( to ) {
		
	//var callback = wpifw.scrollDone();
	var duration = 600;
		
	var bodyRect = document.body.getBoundingClientRect(),
	elemRect = to.getBoundingClientRect(),
	offset   = elemRect.top - bodyRect.top;
		
	  // because it's difficult to detect the scrolling element, just move them all
	  function move(amount) {
		document.documentElement.scrollTop = amount;
		document.body.parentNode.scrollTop = amount;
		document.body.scrollTop = amount;
	  }
	  function position() {
		return document.documentElement.scrollTop || document.body.parentNode.scrollTop || document.body.scrollTop;
	  }
	  var start = position(),
		change = offset - start,
		currentTime = 0,
		increment = 20;
	  duration = (typeof(duration) === 'undefined') ? 500 : duration;
	  var animateScroll = function() {
		// increment the time
		currentTime += increment;
		// find the value with the quadratic in-out easing function
		var val = Math.easeInOutQuad(currentTime, start, change, duration);
		// move the document.body
		move(val);
		// do the animation unless its over
		if (currentTime < duration) {
		  requestAnimFrame(animateScroll);
		} //else {
		  //if (callback && typeof(callback) === 'function') {
			// the animation is done so lets callback
			//callback();
		 // }
		//}
	  };
	  animateScroll();
	}
		
	function scrollDone() {
		console.log('scroll done');
	}

	return {
		init : init,
		getScene : getScene,
		getFeaturedImage : getFeaturedImage,
		getCoverImage : getCoverImage,
		getCombatants : getCombatants,
		processScene : processScene,
		addLoader : addLoader,
		generateFightMessage : generateFightMessage,
		removeLoader : removeLoader,
		smoothScroll : smoothScroll,
		scrollTo : scrollTo,
		scrollDone : scrollDone,
		HttpRequest : HttpRequest,
		//processCombatant : processCombatant,
	};

})();
