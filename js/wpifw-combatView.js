
/* **********************************************
     Begin wpifw-combatView.js
********************************************** */

/*
*  wpifw.combat.combatView
*
*  Create Combat View
*  
*
*  @type	function
*  @date	21/02/2015
*  @since	0.0.1
*
*  @param	
*  @return
*/

wpifw.combat.combatView = {
	
	active : false,
	
	init : function() {
		
		//console.log('combatView init');
		
		if (!this.active) {
			
			this.combatantStats = [];
			this.strikeArray = [];
			this.strikeScoreArray = [];
			this.woundArray = [];
			this.deathArray = [];
			
			var combatantTable = document.createElement('table');
			var combatantTableBody = document.createElement( 'tbody' );
			combatantTable.id = 'combatViewTable';
			combatantTable.appendChild( combatantTableBody );
			
			article.appendChild( combatantTable );
		
			this.active = true;
		} 
	},
	
	renderStrikeView : function( callback ) {
		
		var startCombat = document.getElementById("startCombat");
		startCombat.setAttribute( 'disabled', true );
		
		if ( wpifw.combat.mercyOption ) {
			var mercyButton = document.getElementById("mercy");
			mercyButton.setAttribute( 'disabled', true );
		}
		
		if ( wpifw.combat.fleeOption ) {
			var fleeButton = document.getElementById("flee");
			fleeButton.setAttribute( 'disabled', true );
		}
		
		var skirmishMessages = document.getElementsByClassName('skirmishMessages');
		
		var combatViewTable = document.getElementById('combatViewTable');
		skirmishMessages[0].style.height = combatViewTable.offsetHeight + 'px';
		skirmishMessages[0].style.width = combatViewTable.offsetWidth + 'px';
		
		var numMessages = wpifw.combat.combatView.strikeArray.length;
		wpifw.combat.combatView.strikeArray.reverse();
		wpifw.combat.combatView.strikeScoreArray.reverse();
		
		var callbackTimeout = (numMessages * 1000) + 2500;
		
		if ( document.getElementById('luckMessageTable') ) {
			var luckTable = document.getElementById('luckMessageTable');
			luckTable.parentNode.removeChild( luckTable );
		}
		
		var strikeMessageTable = document.createElement('table');
		var strikeMessageTableBody = document.createElement('tbody');
		var strikeMessageTableHead = document.createElement('thead');
		strikeMessageTable.id = 'strikeMessageTable';
		strikeMessageTable.appendChild(strikeMessageTableHead);
		var strikeMessageTableHeadRow = strikeMessageTableHead.insertRow();
		var headCell = strikeMessageTableHeadRow.insertCell(0);
		headCell.colSpan = '2';
		headCell.innerHTML = 'Attack Scores';
		
		strikeMessageTable.appendChild(strikeMessageTableBody);
		skirmishMessages[0].appendChild(strikeMessageTable);
				
		var i = 0;
		wpifw.combat.combatView.strikeCount = 0;
		var refreshIntervalId  = setInterval( function() {
			
			var row = strikeMessageTableBody.insertRow(i);
			var cell1 = row.insertCell(0);
			var cell2 = row.insertCell(1);
			cell2.className = 'attackScoreCell';
			
			cell1.innerHTML = wpifw.combat.combatView.strikeArray[i];
			cell2.innerHTML = '0';
			
			var f = 0,
				strikeFlick = setInterval( function() {

				f++;
					if ( f == 0 ) {}
					else if ( f > 0 && f <= 20 ) { cell2.innerHTML = wpifw.Dice.roll(2, 6); }
					else if (f > 20 ) {				
						clearInterval( strikeFlick );
						updateScore();
					}
				}, 50 );
				
			function updateScore() {
				
				cell2.innerHTML = wpifw.combat.combatView.strikeScoreArray[wpifw.combat.combatView.strikeCount];
				wpifw.combat.combatView.strikeCount++
			}
				
			i++
			if ( i == numMessages ) {
				clearInterval(refreshIntervalId);	
			}
			
		}, 1000);
				
		setTimeout( function() {
			callback();
		}, callbackTimeout);
	},
	
	renderWoundView : function( callback ) {
		
		var skirmishMessages = document.getElementsByClassName('skirmishMessages');
		var numMessages = wpifw.combat.combatView.woundArray.length;
		
		if ( numMessages == 0 ) {
			var drawText = 'This round is a draw.';
			wpifw.combat.combatView.woundArray.push( drawText );
			numMessages = 1;
		}
		
		var callbackTimeout = (numMessages * 1000) + 1000;
		
		strikeMessageTable = document.getElementById('strikeMessageTable');
		numRows = strikeMessageTable.rows.length;
		for ( var i = 0; i < numRows; i++ ) {
			strikeMessageTable.deleteRow(0);
		}
		var woundRow = strikeMessageTable.insertRow();
		var woundCell = woundRow.insertCell(0);
		woundCell.id = 'woundMessage';
				
		for ( var i = 0; i < numMessages; i++ ) {
			woundCell.innerHTML += wpifw.combat.combatView.woundArray[i];
		}	
				
		setTimeout( function() {
			callback();
		}, callbackTimeout);
	},
	
	renderFleeView : function( chance, luckRoll, result, callback ) {
		
		var startCombat = document.getElementById("startCombat");
		startCombat.setAttribute( 'disabled', true );
		
		if ( wpifw.combat.mercyOption ) {
			var mercyButton = document.getElementById("mercy");
			mercyButton.setAttribute( 'disabled', true );
		}
		
		if ( wpifw.combat.fleeOption ) {
			var fleeButton = document.getElementById("flee");
			fleeButton.setAttribute( 'disabled', true );
		}
		
		var skirmishMessages = document.getElementsByClassName('skirmishMessages');
		
		var combatViewTable = document.getElementById('combatViewTable');
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
		headCell.innerHTML = 'Attempt to Flee';
		
		luckMessageTable.appendChild(luckMessageTableBody);
		skirmishMessages[0].appendChild(luckMessageTable);

		var row = luckMessageTableBody.insertRow();
		var cell1 = row.insertCell(0);
		
		cell1.innerHTML = 'Chance of success: ' + chance + '%<br />Chances remaining: ' + wpifw.local.player.luck;
		if ( wpifw.local.player.luck > 0 ) {
			cell1.innerHTML += '<br /><span class="testLuck" >Would you like to test your luck?</span>';
			cell1.innerHTML += '<button class="buttons-2" id="fleeYes">Yes</button><button class="buttons-2" id="fleeNo">No</button>';
		} else {
			cell1.innerHTML += '<br /><span class="testLuck" >You are out of luck.</span>';
			setTimeout( function() {
				callback( result );
				return;
			}, 2000);
		}
		
		if ( document.getElementById('fleeYes') ) {
			
			document.getElementById('fleeYes').onclick = function() {
				
				headCell.innerHTML = 'Test of luck';
				cell1.innerHTML = 'You must score ' + chance + ' or below.<br /><span class="testLuck">Generating random number.</span><br /><div id="randomLuck">00</div>';
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
							//console.log( result );
							if ( result == false ) {
								cell1.innerHTML = 'You are unsuccessful.';
								setTimeout( function() {
									cell1.innerHTML = 'You must fight on...';
									setTimeout( function() {
										callback( result );
									}, 2000);
								}, 1000);
							} else if ( result == true ) {
								cell1.innerHTML = 'You are successful.';
								setTimeout( function() {
									callback( result );
								}, 1000);
							}
	
						}, 1000);
					}
				}, 60);
			}
			
			document.getElementById('fleeNo').onclick = function() {
				//console.log('Flee No');
				callback( false );
			}
		}
	},

	updatePreRound : function() {
		
		//console.log('update pre round')
		
		var combatViewTable = document.getElementById( 'combatViewTable' );
		var numCombatTableRows = combatViewTable.rows.length;
		
		for ( var i = 0; i < numCombatTableRows; i++ ) {
			
			combatViewTable.deleteRow(0);
		}
				
		var skirmishTable = document.createElement('table');
		skirmishTable.className = 'skirmishTable';
		var friendRow = document.createElement('div');
		friendRow.className = 'friends';
		var friendText = document.createElement('div');
		friendText.className = 'friendText';
		
		var skirmishMessages = document.createElement('div');
		skirmishMessages.className = 'skirmishMessages';
		skirmishTable.appendChild( skirmishMessages );
		
		skirmishTable.appendChild( friendRow ); 
		var foeRow = document.createElement('div');
		var foeText = document.createElement('div');
		enemyText = document.createTextNode('Enemies');
		foeText.className = 'enemyText';
		foeText.appendChild(enemyText);
		foeRow.className = 'enemies';
		foeRow.appendChild( foeText );
		skirmishTable.appendChild( foeRow ); 
		
		for ( var i = 0; i < wpifw.combatants.length; i++ ) {
			
			wpifw.combatants[i].getCombatStats( function( combatStats ) {

				wpifw.combat.combatView[ 'combatant' + i ] = wpifw.combat.combatView.generateStatView( combatStats );
				
				if ( combatStats.alignment == 'Friend' ) { 	
					
					friendRow.appendChild( wpifw.combat.combatView[ 'combatant' + i ] );
				} 
			});
		}
		
		frText = document.createTextNode('Friends');
		friendText.appendChild(frText);
		friendRow.appendChild(friendText);

						
		var combatViewRow = combatViewTable.insertRow();
		var combatViewCell = combatViewRow.insertCell(0);
		
		combatViewCell.appendChild( skirmishTable );		
		
		for ( var i = 0; i < wpifw.combat.e.length; i++ ) {
			
			function compare( a, b ) {
				
				if ( a.Uid < b.Uid )
					return -1;
					
				if ( a.Uid > b.Uid )
					return 1;
					
				return 0;
			}
			wpifw.combat.e.sort(compare);
						
			wpifw.combat.e[i].getCombatStats( function( combatStats ) {
			
				wpifw.combat.combatView[ 'combatant' + i ] = wpifw.combat.combatView.generateStatView( combatStats );
				
				if ( combatStats.alignment == 'Foe' ) { 
				
					foeRow.appendChild( wpifw.combat.combatView[ 'combatant' + i ] );
				}
			});
		}
	},
		
	generateStatView :  function( combatStats ) {
			
		//	Create Table and TableBody
		var combatantStatTable = document.createElement('table');
		combatantStatTable.id = 'Uid-' + combatStats.Uid;
		combatantStatTable.className = 'combatantStats';
		if ( combatStats.state == 'dead' )
			combatantStatTable.className = 'combatantStats dead';
			
		if ( combatStats.state == 'wound' )
			combatantStatTable.className = 'combatantStats wound';	
		
		var combatantStatTableBody = document.createElement( 'tbody' );
		
		//	Create Row 1
		var combatantStatTableRow = document.createElement( 'tr' );
		var combatantStatTableCell = document.createElement( 'td' );
		combatantStatTableCell.colSpan = '2';
		combatantStatTableCell.className = 'statNameCell';
		if ( combatStats.stamina <= 0 )
			combatantStatTableCell.className = 'statNameCell strikethrough';		

		if ( combatStats.randomCharacter == true && combatStats.gender !== 'It' ) {
			var nameText = combatStats.gender + " " + combatStats.name;
		} else {
			var nameText = combatStats.name;
		}
		
		var combatantStatTableCellText = document.createTextNode( nameText );
		combatantStatTableCell.appendChild( combatantStatTableCellText );
		
		combatantStatTableRow.appendChild( combatantStatTableCell );
		combatantStatTableBody.appendChild( combatantStatTableRow );

		//	Create Row 2
		//	Cell 1
		combatantStatTableRow = document.createElement( 'tr' );
		combatantStatTableCell = document.createElement( 'td' );
		combatantStatTableCell.className = 'statLabel';
		combatantStatTableCellText = document.createTextNode('Stamina');
		combatantStatTableCell.appendChild( combatantStatTableCellText );
		combatantStatTableRow.appendChild( combatantStatTableCell );
		//	Cell 2
		combatantStatTableCell = document.createElement( 'td' );
		combatantStatTableCell.className = 'statLabel';		
		combatantStatTableCellText = document.createTextNode('Skill');
		combatantStatTableCell.appendChild( combatantStatTableCellText );
		combatantStatTableRow.appendChild( combatantStatTableCell );
		//	Append row
		combatantStatTableBody.appendChild( combatantStatTableRow );			
		
		//	Create Row 3
		//	Cell 1
		combatantStatTableRow = document.createElement( 'tr' );
		combatantStatTableCell = document.createElement( 'td' );
		combatantStatTableCell.style.width = '50%';
		combatantStatTableCellText = document.createTextNode( combatStats.stamina );
		combatantStatTableCell.className = 'statNumber';
		if ( combatStats.stamina <= 4 )
			combatantStatTableCell.className = 'statNumber negative';
		combatantStatTableCell.appendChild( combatantStatTableCellText );
		combatantStatTableRow.appendChild( combatantStatTableCell );
		//	Cell 2
		combatantStatTableCell = document.createElement( 'td' );
		combatantStatTableCell.className = 'statNumber';
		combatantStatTableCellText = document.createTextNode( combatStats.skill );
		combatantStatTableCell.appendChild( combatantStatTableCellText );
		combatantStatTableRow.appendChild( combatantStatTableCell );			
		//	Append row
		combatantStatTableBody.appendChild( combatantStatTableRow );
		
		//	Create Row 4
		combatantStatTableRow = document.createElement( 'tr' );
		combatantStatTableCell = document.createElement( 'td' );
		combatantStatTableCell.className = 'statLabel';
		combatantStatTableCell.colSpan = '2';
		
		combatantStatTableCellText = document.createTextNode('Attack Score');
		combatantStatTableCell.appendChild( combatantStatTableCellText );
		combatantStatTableRow.appendChild( combatantStatTableCell );
		//	Append row
		combatantStatTableBody.appendChild( combatantStatTableRow );
		
		//	Create Row 5
		combatantStatTableRow = document.createElement( 'tr' );
		combatantStatTableCell = document.createElement( 'td' );
		combatantStatTableCell.colSpan = '2';
		combatantStatTableCell.className = 'attackScore';
		combatantStatTableCellText = document.createTextNode( combatStats.attackScore );
		combatantStatTableCell.appendChild( combatantStatTableCellText );
		combatantStatTableRow.appendChild( combatantStatTableCell );
		//	Append row
		combatantStatTableBody.appendChild( combatantStatTableRow );

		//	Append the <tbody> inside the <table>
		combatantStatTable.appendChild( combatantStatTableBody );

		return combatantStatTable;
	},
	
	updatePostRound : function() {

		wpifw.combat.combatView.combatantStats = [];
		wpifw.combat.combatView.strikeArray = [];
		wpifw.combat.combatView.strikeScoreArray = [];
		wpifw.combat.combatView.woundArray = [];
		wpifw.combat.combatView.deathArray = [];
	
		var startCombat = document.getElementById("startCombat");
		if ( startCombat ) 
		startCombat.removeAttribute( 'disabled' );
		
		if ( wpifw.combat.fleeOption ) {
			var fleeButton = document.getElementById("flee");
			if ( fleeButton ) 
			fleeButton.removeAttribute( 'disabled' );
		}
		
		if ( wpifw.combat.mercyOption ) {
			var mercyButton = document.getElementById("mercy");
			if ( mercyButton )
			mercyButton.removeAttribute( 'disabled' );
		}
	}
}