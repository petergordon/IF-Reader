
/* **********************************************
     Begin wpifw-combat.js
********************************************** */

/*
*  wpifw combat 
*
*  Create wpifw.combat namespace
*  
*
*  @type	function
*  @date	21/02/2015
*  @since	0.0.1
*
*  @param	
*  @return
*/

wpifw.combat = {
	
	combatRound : 0,
	victor : false,
	
	fight : function(c) {
		
		for ( var i in c ) { c[i].state = ''; };
		
		wpifw.combat.combatView.init();
		
		if ( wpifw.combat.victor == true ) {
			return;
		}
		
		wpifw.combat.combatRound++; 
	
		if (c.length > 1) {
			
			wpifw.combat.f = []; //Friendly combatant array
			wpifw.combat.e = []; //Enemy combatant array
			wpifw.combat.n = []; //Neutral combatant array
			
			if (c.length == 2) {
				if ( wpifw.combat.combatRound == 1 ) {
					c[0].alignment = "Friend";
					wpifw.combat.f.push(c[0]);
					c[1].alignment = "Foe";
					wpifw.combat.e.push(c[1]);
				} else {
					if ( c[0].alignment == "Friend" && c[1].alignment == "Foe" ) {
						wpifw.combat.f.push(c[0]);
						wpifw.combat.e.push(c[1]);						
						wpifw.combat.squareUp(wpifw.combat.f, wpifw.combat.e, c, 1, 1);
						return;
					} else if ( c[0].alignment == "Foe" && c[1].alignment == "Friend" ) {
						wpifw.combat.f.push(c[1]);
						wpifw.combat.e.push(c[0]);						
						wpifw.combat.squareUp(wpifw.combat.f, wpifw.combat.e, c, 1, 1);
						return;
					} else {
						if ( c[0].alignment == "Friend" ) {
							wpifw.combat.f.push(c[0]);
							wpifw.combat.f.push(c[1]);
							wpifw.combat.reSquareUp(wpifw.combat.f, wpifw.combat.e, c, 2, 0);
							return;
						} else {
							wpifw.combat.e.push(c[0]);
							wpifw.combat.e.push(c[1]);
							wpifw.combat.reSquareUp(wpifw.combat.f, wpifw.combat.e, c, 0, 2);
							return;
						}
					}
				}
				
			} else {
				
				for(var i in c) {
					if (c[i].alignment == "Friend")
						wpifw.combat.f.push(c[i]);
					if (c[i].alignment == "Foe")
						wpifw.combat.e.push(c[i]);
					if (c[i].alignment == "Neutral")
						wpifw.combat.n.push(c[i]);
				}
				
				var nCount = wpifw.combat.n.length;
				if (nCount !== 0)  {
					for (var i = 0; i < nCount; i++) {
						var reassign = wpifw.combat.n.pop();
						if (wpifw.combat.f.length > wpifw.combat.e.length) {
							reassign.alignment = "Foe";
							wpifw.combat.e.push(reassign);
						} else {
							reassign.alignment = "Friend";
							wpifw.combat.f.push(reassign);
						}
					}
				}
			}
			
			var numFriendlies = wpifw.combat.f.length,
				numFoes = wpifw.combat.e.length;
			
			if ( numFoes == 0 ) {
				if (numFriendlies !== 0)  {
					for (var i = 0; i < numFriendlies; i++) {
						var reassign = wpifw.combat.f.pop();
						if ( reassign.name !== 'You' ) {
							reassign.alignment = "Foe";
							wpifw.combat.e.push(reassign);
						} else {
							reassign.alignment = "Friend";
							wpifw.combat.f.push(reassign);
						}
					}
				}
			}
			
			numFriendlies = wpifw.combat.f.length,
			numFoes = wpifw.combat.e.length;
				
			if ( numFriendlies > 0 && numFoes > 0 && wpifw.combat.combatRound == 1 ) {
				wpifw.combat.squareUp(wpifw.combat.f, wpifw.combat.e, c, numFriendlies, numFoes);
			} else if ( numFriendlies >= 1 && numFoes >= 1 ) {
				wpifw.combat.squareUp(wpifw.combat.f, wpifw.combat.e, c, numFriendlies, numFoes);
			} else {
				wpifw.combat.reSquareUp(wpifw.combat.f, wpifw.combat.e, c, numFriendlies, numFoes);
			}
		} else {
			//console.log("There's no-one left to fight");
		}
	},
	
	shuffle : function (array) {
		
		var currentIndex = array.length, temporaryValue, randomIndex ;
		while (0 !== currentIndex) {
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}
		return array;
	},	
	
	squareUp : function(f, e, combatants, numFriendlies, numFoes) {
		
		//console.log('square up');
		
		this.shuffle(f);
		this.shuffle(e);
		
		if (numFriendlies > numFoes) {
			var majorityTeam = "friendlies",  oneOnOne = numFoes, combatantsRemaining = (numFriendlies - numFoes);
		} else if (numFoes > numFriendlies) {
			var majorityTeam = "foes",  oneOnOne = numFriendlies, combatantsRemaining = (numFoes - numFriendlies);
		} else {
			var majorityTeam = "none",  oneOnOne = numFriendlies, combatantsRemaining = 0;
		}
		
		for (var i = 0; i < oneOnOne; i ++) {
			if (typeof e[i].combatTarget !== "number") {
				e[i].combatTarget = f[i].Uid;
				f[i].combatTarget = e[i].Uid; 
			}
		}
		
		function getRandomTarget(team) {
				var randomTarget = Math.floor(Math.random() * (team - 0)) + 0;
				return randomTarget;
		}


		if (majorityTeam == "friendlies" && numFoes >= 1) {
			var i = 0;
			for (var r = 0;  r < combatantsRemaining; r++) {
				var randomFoe = getRandomTarget( numFoes );
				if (typeof f[i].combatTarget !== "number") {
					f[i].combatTarget = e[randomFoe].Uid;
				i++;
				}
			}
		} else if (majorityTeam == "foes" && numFriendlies >= 1) {
			var i = 0;
			for (var r = 0;  r < combatantsRemaining; r++) {
				var randomFriend = getRandomTarget( numFriendlies );
				if (typeof e[i].combatTarget !== "number") {
				var randomCombatTarget = f[randomFriend].Uid;
				e[i].combatTarget = randomCombatTarget;
				i++;
				}
			}
		}
		
		for (var i = 0; i < e.length; i++) {
			if (e[i].combatTarget == undefined) {
				var randomFriend = getRandomTarget( numFriendlies );
				e[i].combatTarget = f[randomFriend].Uid;
			}
		}
		for (var i = 0; i < f.length; i++) {
			if (f[i].combatTarget == undefined) {
				var randomFoe = getRandomTarget( numFoes );
				f[i].combatTarget = e[randomFoe].Uid;
			}
		}
		
		//console.log('combat round is ' + wpifw.combat.combatRound);
		if ( wpifw.combat.combatRound == 1 ) {
			wpifw.combat.combatView.updatePreRound();
		} else {
			wpifw.combat.doCombatRound(f, e, combatants, majorityTeam);
		}
	},

	doCombatRound : function(f, e, combatants, majorityTeam) {
		
		//console.log('do combat round');
		
		function getCombatTarget(a) {
			for (var i in combatants) {
				if (combatants[i].Uid == a) {
					return [i, combatants[i].name];
				}
			}
		}
	
		var numCombatants = combatants.length;
		
		for (var n = 0; n < numCombatants; n++ ) {
			combatants[n].attack();
		}
		
		wpifw.combat.combatView.renderStrikeView( function() {

			if (majorityTeam == "friendlies" || majorityTeam == "none") {
				
				var numFriendlies = f.length;
		
				for (var n = 0; n < numFriendlies; n++ ) {
					var uidOfCombatTarget = getCombatTarget(f[n].combatTarget);
					var	combatAttackScore = f[n].attackScore;
					var combatTargetAttackScore = combatants[uidOfCombatTarget[0]].attackScore;
					
					if ( combatAttackScore < combatTargetAttackScore) {
						if ( !combatants[uidOfCombatTarget[0]].struck ) {
							f[n].wound( function( state ) {
								if ( state == 'dead' ) {
									f[n].state = 'dead';
								} else if ( state == 'wound' ) {
									f[n].state = 'wound';
								}
							});
							combatants[uidOfCombatTarget[0]].struck = true;
						}
					} else if ( combatAttackScore > combatTargetAttackScore ) {
						if ( !f[n].struck ) {
							combatants[uidOfCombatTarget[0]].wound(  function( state ) {
								if ( state == 'dead' ) {
									combatants[uidOfCombatTarget[0]].state = 'dead';
								} else if ( state == 'wound' ) {
									combatants[uidOfCombatTarget[0]].state = 'wound';
								}
							});
							f[n].struck = true;
						}
					}
				}
			} else { 
			
				numFoes = e.length;
				
				for (var m = 0; m < numFoes; m++ ) {
					var uidOfCombatTarget = getCombatTarget(e[m].combatTarget);
					var	combatAttackScore = e[m].attackScore;
					var combatTargetAttackScore = combatants[uidOfCombatTarget[0]].attackScore;
					
					if ( combatAttackScore < combatTargetAttackScore) {
						if ( !combatants[uidOfCombatTarget[0]].struck ) {
							e[m].wound( function( state ) {
								if ( state == 'dead' ) {
									e[m].state = 'dead';
								} else if ( state == 'wound' ) {
									e[m].state = 'wound';
								}
							});
							combatants[uidOfCombatTarget[0]].struck = true;
						}
					} else if ( combatAttackScore > combatTargetAttackScore ) {
						if ( !e[m].struck ) {
							combatants[uidOfCombatTarget[0]].wound( function( state ) {
								if ( state == 'dead' ) {
									combatants[uidOfCombatTarget[0]].state = 'dead';
								} else if ( state == 'wound' ) {
									combatants[uidOfCombatTarget[0]].state = 'wound';
								}
							});
							e[m].struck = true;
						}
					}
				}
			}
		
			wpifw.combat.combatView.renderWoundView( function() {
					
				wpifw.combat.combatView.updatePreRound();
				wpifw.combat.reSquareUp(f, e, combatants);
			});
		});
	},

	reSquareUp : function(f, e, combatants) {
		
		//console.log('resquare');
		
		//console.dir(f);
		//console.dir(e);
		
		var fightScene = document.getElementsByClassName('scene');
		var currentFightScene = fightScene[ fightScene.length - 1 ];

		if (f.length <= 0 || wpifw.local.player.stamina <= 0 ) {
			//console.log('resquare if');
			wpifw.combat.endCombat();
			currentFightScene.innerHTML += wpifw.generateFightMessage( 'defeat' );
			setTimeout(function(){ wpifw.getScene('/wp-json/wp/v2/scene/' + wpifw.sceneObject.custom_meta.choice[2].defeat); }, 1500);
			return;
			
		} else if (e.length <= 0 && wpifw.local.player.stamina >= 1 ) {
			//console.log('resquare else if');
			wpifw.combat.endCombat();
			currentFightScene.innerHTML += wpifw.generateFightMessage( 'victory' );			
			setTimeout(function(){ wpifw.getScene('/wp-json/wp/v2/scene/' + wpifw.sceneObject.custom_meta.choice[2].victory); }, 1500);
			return;
			
		} else {
			
			for (i in combatants) {
				
				//console.log('for i in combatants');
				
				combatants[i].struck = false;
				
				if 	(combatants[i].stamina <= 0) {
					wpifw.combat.combatView.deathArray.push( combatants[i].name + " is dead" );
					
					//console.log('combatants[i].stamina <= 0');
					
					if ( combatants[i].alignment == 'Foe' ) {
						//console.log('combatants[i].alignment == Foe')
						
						if ( wpifw.combat.e.length == 1 ) {
							//console.log(' deleting our last foe');
							wpifw.combat.endCombat();
							currentFightScene.innerHTML += wpifw.generateFightMessage( 'victory' );							
							setTimeout(function(){ wpifw.getScene('/wp-json/wp/v2/scene/' + wpifw.sceneObject.custom_meta.choice[2].victory); }, 1500);
							return;
						}
					} else if ( combatants[i].alignment == 'Friend' ) {
						if ( wpifw.combat.f.length == 1 ) {
							//console.log(' deleting our last friend');
							wpifw.combat.endCombat();
							currentFightScene.innerHTML += wpifw.generateFightMessage( 'defeat' );
							setTimeout(function(){ wpifw.getScene('/wp-json/wp/v2/scene/' + wpifw.sceneObject.custom_meta.choice[2].defeat); }, 1500);
							return;
						}
					}
					
					for (e in combatants) {
						if (combatants[e].combatTarget == combatants[i].Uid) {
							delete combatants[e].combatTarget
						}
					}
					
					var index = combatants.indexOf(combatants[i]);
					
					if (index > -1) {
						combatants.splice(index, 1);
					}
					if (combatants.length <= 1) {
						
						wpifw.combat.endCombat();
						currentFightScene.innerHTML += wpifw.generateFightMessage( 'defeat' );						
						setTimeout(function(){ wpifw.getScene('/wp-json/wp/v2/scene/' + wpifw.sceneObject.custom_meta.choice[2].defeat); }, 1500);
					}
				}
			}
		}

		var numEnemiesAlive = 0;
		for ( var i in wpifw.combat.e ) {
			
			if ( wpifw.combat.e[i].stamina > 0 ) {
				var numEnemiesAlive = numEnemiesAlive + 1;
			}
		}
		if ( numEnemiesAlive > 0 ) {
		} else {
			wpifw.combat.endCombat();
			currentFightScene.innerHTML += wpifw.generateFightMessage( 'victory' );							
			setTimeout(function(){ wpifw.getScene('/wp-json/wp/v2/scene/' + wpifw.sceneObject.custom_meta.choice[2].victory); }, 1500);
		}
		
		wpifw.combat.combatView.updatePostRound();
	},
	
	endCombat : function() {
		
		wpifw.combatants = {};
		wpifw.combat.e = {};
		wpifw.combat.f = {};
		wpifw.combat.combatRound = 0;
		wpifw.combat.victor = false;
		wpifw.local.player.attackScore = 0;
		wpifw.local.player.combatTarget = null;
		var fightOpts = document.getElementsByClassName('fight-options');
		fightOpts[0].parentNode.removeChild(fightOpts[0]);
		var fightTable = document.getElementById('combatViewTable');
		fightTable.parentNode.removeChild(fightTable);
		wpifw.combat.combatView.active = false;

		
	}
}