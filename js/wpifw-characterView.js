
/* **********************************************
     Begin wpifw-characterView.js
********************************************** */

/*
*  wpifw.characterView
*
*  Create Character View
*  
*
*  @type	function
*  @date	07/08/2015
*  @since	0.0.1
*
*  @param	
*  @return	characterView
*/

wpifw.characterView = {

	active : false,
	
	init : function() {
		
		var characterDiv = document.createElement('div');
		var characterTable = document.createElement('table');
		var characterTableBody = document.createElement( 'tbody' );
		var characterTableRow = document.createElement( 'tr' );
		characterTableRow.id = 'characterTableRow';
		
		characterTableRow.innerHTML = '<td id="character-close" colspan="2"><svg version="1.1" id="character-close-icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="44px" height="44px" viewBox="0 0 44 44" enable-background="new 0 0 44 44" xml:space="preserve"><rect id="close-icon-element" x="10.8" y="19.5" transform="matrix(0.7071 -0.7071 0.7071 0.7071 -8.7591 21.8536)" fill="#010102" width="22.4" height="4"/><rect id="close-icon-element-2" x="10.8" y="19.5" transform="matrix(0.7071 0.7071 -0.7071 0.7071 21.6464 -9.2591)" fill="#010102" width="22.4" height="4"/></svg></td>';

		
		characterTableBody.id = 'characterTableBody';
		characterDiv.id = 'characterView';
		characterTable.id = 'characterViewTable';
		characterTableBody.appendChild( characterTableRow );
		characterTable.appendChild( characterTableBody );
		characterDiv.appendChild( characterTable );
		article.appendChild( characterDiv );
		
		var characterTableRow2 = document.createElement( 'tr' );
		
		
		characterTableRow2.id = 'characterTableRow2';
		
		characterTableRow2.innerHTML += "<p style='color:#fff;font-size:14px' id='characterViewSpacer'>Hello babies. Welcome to Earth. It's hot in the summer and cold in the winter. It's round and wet and crowded. On the outside, babies, you've got a hundred years here. There's only one rule that I know of, babies-'God damn it, you've got to be kind.</p>";

		characterTableBody.appendChild( characterTableRow2 );
		
		wpifw.addLoader( characterTableRow2 );
		
		var top = window.pageYOffset + 60;
		characterTable.style.top = top + 'px';
		
		var offsetHeight = document.body.offsetHeight;
		characterDiv.style.height = offsetHeight + 'px';
		
		characterDiv.addEventListener('click', this.characterClose.bind( this ) );
		
		this.active = true;

	},
	
	characterClose : function( e ) {
		
		e.preventDefault();
		if ( e.target.id == 'characterView' || e.target.id == 'character-close-icon' || e.target.id == 'close-icon-element-2' || e.target.id == 'close-icon-element' ) {
			characterView.parentNode.removeChild(characterView);
		}
		this.active = false;
	},
	
	renderCharacterView : function() {
		
		characterTableRow = document.getElementById('characterTableRow');
		characterTableRow2 = document.getElementById('characterTableRow2');
		characterDiv = document.getElementById('characterView');
		characterTableBody = document.getElementById('characterTableBody');
		
		if ( wpifw.characterRequestObject.featured_image ) {
			characterTableRow2.innerHTML = '<td id="character-stats" style="padding-right:0" ></td><td id="character-image" ></td>';
			characterImage = document.getElementById('character-image');
			wpifw.addLoader( characterImage );
			
			wpifw.getFeaturedImage( wpifw.characterRequestObject.featured_image, function() {
				wpifw.removeLoader();
				
				var characterFeaturedImage = document.createElement('img');
				characterFeaturedImage.src = wpifw.featuredImageObject.source_url;
				
				characterImage.appendChild( characterFeaturedImage );

			});
			
		} else {
			characterTableRow2.innerHTML = '<td id="character-stats" ></td>';
		}
		
		var characterStats = document.getElementById('character-stats');
		
		var title = wpifw.characterRequestObject.title.rendered;
		var type = wpifw.characterRequestObject.type;
		
		characterStats.innerHTML = '<h4>' + wpifw.characterRequestObject.title.rendered + '</h4>';
		
//		if ( type == 'characters' ) {
//
//			characterStats.innerHTML += wpifw.characterRequestObject.custom_meta.character_profile[title].alignment;
//			characterStats.innerHTML += wpifw.characterRequestObject.custom_meta.character_profile[title].gender;
//			characterStats.innerHTML += wpifw.characterRequestObject.custom_meta.character_profile[title].skill;
//			characterStats.innerHTML += wpifw.characterRequestObject.custom_meta.character_profile[title].stamina;
//			characterStats.innerHTML += wpifw.characterRequestObject.custom_meta.character_profile[title].luck;
//			characterStats.innerHTML += wpifw.characterRequestObject.custom_meta.character_profile[title].gold;
//		
//		} else {
//			
//			characterStats.innerHTML += wpifw.characterRequestObject.custom_meta.character_defaults[title].alignment;
//			characterStats.innerHTML += wpifw.characterRequestObject.custom_meta.character_defaults[title].gender;
//			characterStats.innerHTML += wpifw.characterRequestObject.custom_meta.character_defaults[title].skill;
//			characterStats.innerHTML += wpifw.characterRequestObject.custom_meta.character_defaults[title].stamina;
//			characterStats.innerHTML += wpifw.characterRequestObject.custom_meta.character_defaults[title].luck;
//			characterStats.innerHTML += wpifw.characterRequestObject.custom_meta.character_defaults[title].gold;
//			
//		}
		characterStats.innerHTML += wpifw.characterRequestObject.content.rendered;
		

		
		
		this.activateShortcodes( characterStats );
		
		//wpifw.removeLoader();
	},	
		
	activateShortcodes : function( target ) {
		
		var characterViews = target.getElementsByClassName('character-shortcode');

		if ( characterViews.length > 0 ) {
			for ( var i = 0; i < characterViews.length; i++ ) {
				characterViews[i].addEventListener( 'click', function( e ) {
					
					e.preventDefault();
					
					characterDiv = document.getElementById('characterView');
					if ( characterDiv )
						characterView.parentNode.removeChild(characterView);

					wpifw.characterView.init();
					
					var characterId = e.target.getAttribute("data-character");
					
					if ( characterId !== null ) {
						charUrl =  '/wp-json/wp/v2/characters/' + characterId;
					} else {
						var classId = e.target.getAttribute("data-class");
						charUrl =  '/wp-json/wp/v2/character_defaults/' + classId;
					}
					
					wpifw.characterRequest = new wpifw.HttpRequest();
					wpifw.characterRequest.get(charUrl, function(answer) {
						wpifw.characterRequestObject = JSON.parse(answer);
						wpifw.characterView.renderCharacterView();							
					});
					
				}); 
			}
		}
		
	},



	
}
