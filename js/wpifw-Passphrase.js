
/* **********************************************
     Begin wpifw-Passphrase.js
********************************************** */

/*
*  wpifw passphrase 
*
*  
*
*  @type	function
*  @date	14/09/2015
*  @since	0.0.1
*
*  @param	
*  @return boolean
*/

wpifw.passphrase = {
	
	submitButtonClicked : function() {
		
		"use strict";
		
		var passphrase_input = document.getElementById('passphrase-input'),
			passphrase_options = document.getElementsByClassName('passphrase-options'),
			num_passphrase_options = passphrase_options.length -1;	
			
		if ( passphrase_input.value === '' ) {
			passphrase_input.style.display = 'block';  
			passphrase_input.focus();
			wpifw.scrollTo( passphrase_options[num_passphrase_options] )
			
		} else { 
		
			var str = passphrase_input.value,
				str1 = str.toLowerCase().replace(/ /g,''),
				str2 = wpifw.sceneObject.custom_meta.choice[1].passphrase.toLowerCase().replace(/ /g,''),
				dest;

			
			passphrase_options[num_passphrase_options].innerHTML = '<h4 style="margin-bottom:1em">You MUST now respond...</h4><button class="buttons-2 chosen">Answer</button><button class="buttons-2 ignored" style="margin-right: 0px;">Decline</button><div id="response-text"><p style="text-align:center;padding: 1em 0;">You respond...</p><h4>"' + str + '"</h4></div>';

			if(str1.indexOf(str2) >= 0) {
				dest = wpifw.sceneObject.custom_meta.choice[1].correctDestination;
			} else {
				dest = wpifw.sceneObject.custom_meta.choice[1].incorrectDestination;
			}
			
			setTimeout(function(){ wpifw.getScene('/wp-json/wp/v2/scene/' + dest); }, 2250);
			
		}
	},
	
	declineButtonClicked : function() {
		
		"use strict";
		
		var passphrase_options = document.getElementsByClassName('passphrase-options'),
			num_passphrase_options = passphrase_options.length -1;
		
		passphrase_options[num_passphrase_options].innerHTML = '<h4 style="margin-bottom:1em">You MUST now respond...</h4><button class="buttons-2 ignored">Answer</button><button class="buttons-2 chosen" style="margin-right: 0px;">Decline</button>';

		 wpifw.getScene('/wp-json/wp/v2/scene/' + wpifw.sceneObject.custom_meta.choice[1].declineDestination);
		
	}
	
};
