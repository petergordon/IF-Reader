
/* **********************************************
     Begin wpifw-Luck.js
********************************************** */

/*
*  wpifw luck 
*
*  
*
*  @type	function
*  @date	18/03/2015
*  @since	0.0.1
*
*  @param	
*  @return boolean
*/



wpifw.luck = {
	
	testLuck : function( chance, callback ) {

		var luckRoll = wpifw.Dice.roll(1, 100);
		var chance = chance;
		
		if ( chance == null ) 
			chance = 50;
		
		if ( luckRoll <= chance && wpifw.local.player.luck > 0 ) {
			callback( chance, luckRoll, true );
		} else {
			callback( chance, luckRoll, false );
		}
		if ( wpifw.allowFight === 'on' ) {
			wpifw.local.player.luck = wpifw.local.player.luck - 1;
			if ( wpifw.local.player.luck < 0 )
				wpifw.local.player.luck = 0;
		}
	},
	
	chanceButtonClicked : function() {
		
		var combatantTable = document.createElement('table');
		var combatantTableBody = document.createElement( 'tbody' );
		combatantTable.id = 'combatViewTable';
		combatantTable.appendChild( combatantTableBody );
		
		article.appendChild( combatantTable );
		
		var luck_options = document.getElementsByClassName('luck-options'),
			num_luck_options = luck_options.length -1;
			
		wpifw.scrollTo( luck_options[num_luck_options] );	
		
		var chance = document.getElementById("chance");
		chance.setAttribute( 'disabled', true );
		chance.classList.add('chosen');
		
		var nochance = document.getElementById("no-chance");
		nochance.setAttribute( 'disabled', true );
		nochance.classList.add('ignored');
		
		var skirmishTable = document.createElement('table');
		skirmishTable.className = 'skirmishTable';
		
		var skirmishMessages = document.createElement('div');
		skirmishMessages.className = 'skirmishMessages';
		skirmishTable.appendChild( skirmishMessages );
		
		var combatViewRow = combatantTable.insertRow();
		var combatViewCell = combatViewRow.insertCell(0);
		
		combatViewCell.appendChild( skirmishTable );	
			
		var skirmishMessages = document.getElementsByClassName('skirmishMessages');
		
		skirmishMessages[0].style.height = combatViewTable.offsetHeight + 'px';
		skirmishMessages[0].style.width = combatViewTable.offsetWidth + 'px';
		
		var luckMessageTable = document.createElement('table');
		var luckMessageTableBody = document.createElement('tbody');
		var luckMessageTableHead = document.createElement('thead');
		luckMessageTable.id = 'luckMessageTable';
		luckMessageTable.appendChild(luckMessageTableHead);
		var luckMessageTableHeadRow = luckMessageTableHead.insertRow();
		var headCell = luckMessageTableHeadRow.insertCell(0);
		headCell.colSpan = '2';
		headCell.innerHTML = 'Risking it...';
		
		luckMessageTable.appendChild(luckMessageTableBody);
		skirmishMessages[0].appendChild(luckMessageTable);

		var row = luckMessageTableBody.insertRow();
		var cell1 = row.insertCell(0);
		
			if ( wpifw.allowFight === 'on' ) {
				cell1.innerHTML = 'Chance of success: ' + wpifw.sceneObject.custom_meta.choice[1].successChance + '%<br />Chances remaining: ' + wpifw.local.player.luck;
			} else {
				cell1.innerHTML = 'Chance of success: ' + wpifw.sceneObject.custom_meta.choice[1].successChance + '%';	
			}
			if ( wpifw.local.player.luck > 0 ) {
				
			wpifw.luck.testLuck( wpifw.sceneObject.custom_meta.choice[1].successChance, function( chance, luckRoll, result ) {

				cell1.innerHTML += '<br /><span class="testLuck" >Generating random number</span><br /><div id="randomLuck">00</div>';
				var luckDiv = document.getElementById('randomLuck');
				
				var i = 0,
				luckFlick = setInterval( function() {
					i++
					if ( i == 10 ) {
					} else if ( i > 10 && i <= 50 ) {
						luckDiv.innerHTML = wpifw.Dice.roll(1, 100);
					} else if (i > 50 ) {				
						clearInterval( luckFlick );
						luckDiv.innerHTML = luckRoll;
			
						setTimeout( function() {
							combatantTable.parentNode.removeChild(combatantTable);
							
							luck_options[num_luck_options].innerHTML = "<h4 style='margin-bottom:1em'>You MUST now choose...</h4><button class='buttons-2 chosen'>Take the chance</button><button class='buttons-2 ignored' style='margin-right: 0px;'>Don't risk it</button>";
							
							if ( result == false ) {
								
								luck_options[num_luck_options].innerHTML += '<p style="text-align:center; margin: 1em 0">You are unsuccessful.</p>';
								setTimeout( function() {
									luck_options[num_luck_options].innerHTML += '<h4>Your RISK did not pay off...</h4>';
									setTimeout( function() {
										wpifw.getScene('/wp-json/wp/v2/scene/' + wpifw.sceneObject.custom_meta.choice[1].fail);
									}, 1500);
								}, 1000);
							} else if ( result == true ) {
								luck_options[num_luck_options].innerHTML += '<p style="text-align:center; margin: 1em 0">You are successful.</p>';
								setTimeout( function() {
									luck_options[num_luck_options].innerHTML += '<h4>Your RISK paid off...</h4>';
									setTimeout( function() {
										wpifw.getScene('/wp-json/wp/v2/scene/' + wpifw.sceneObject.custom_meta.choice[1].success);
									}, 1500);
								}, 1000);
							}
	
						}, 2000);
					}
				}, 60);
				
			});
				
	
			} else {
				cell1.innerHTML += '<br /><span class="testLuck" >You are out of luck.</span>';
				setTimeout( function() {
					wpifw.getScene('/wp-json/wp/v2/scene/' + wpifw.sceneObject.custom_meta.choice[1].fail);
					return;
				}, 2000);
			}
		
	},
	
	noChanceButtonClicked : function() {
		
		var luck_options = document.getElementsByClassName('luck-options'),
			num_luck_options = luck_options.length -1;
			
		luck_options[num_luck_options].innerHTML = "<h4 style='margin-bottom:1em'>You MUST now choose...</h4><button class='buttons-2 ignored'>Take the chance</button><button class='buttons-2 chosen' style='margin-right: 0px;'>Don't risk it</button>";

		wpifw.getScene('/wp-json/wp/v2/scene/' + wpifw.sceneObject.custom_meta.choice[1].decline);

		
	}
	
	
}
