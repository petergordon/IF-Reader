<!doctype html>
<html>
    <head>
        <meta charset="utf-8">
        <title><?php echo get_bloginfo('name'); ?></title>
		<script src="//use.typekit.net/bhy0jdn.js"></script>
        <script>try{Typekit.load();}catch(e){}</script>
		<?php wp_head(); ?>
    </head>
    <body><a id="currentScene"></a>
    	<article id="article">
		
		<?php
				$allow_fight = get_option( 'allow_fight' );
				$allow_classes = get_option( 'allow_classes' );
				$opening_scene_id = get_option( 'opening_scene' );
				$cover_image_id = get_option( 'cover_image_id' );
				$cover_image_overlay_id = get_option( 'cover_image_overlay_id' );
				$allow_preface = get_option( 'allow_preface' );
				$wpifw_preface_raw = get_option( 'wpifw_preface' );
				
				$icon_color = get_option( 'icon_color' );
				
				$wpifw_preface = stripslashes( wpautop( $wpifw_preface_raw, $br ) );
				$wpifw_preface = str_replace('<p>&nbsp;</p>', '<div>&nbsp;</div>', $wpifw_preface );
							
				$opening_scene = "http://" . $_SERVER['HTTP_HOST'] . "/wp-json/wp/v2/scene/" . $opening_scene_id;	
				if ( $cover_image_id != '' ) {
					$cover_image = "http://" . $_SERVER['HTTP_HOST'] . "/wp-json/wp/v2/media/" . $cover_image_id;	
				}
				if ( $cover_image_overlay_id != '' ) {
					$cover_image_overlay = "http://" . $_SERVER['HTTP_HOST'] . "/wp-json/wp/v2/media/" . $cover_image_overlay_id;	
				}
		?>
        
        </article>
        <footer></footer>
		<?php wp_footer(); ?>
		<script type="text/javascript">
		
				wpifw.allowFight = <?php echo json_encode( $allow_fight, JSON_FORCE_OBJECT ) ?>;
				wpifw.openingScene = <?php echo json_encode( $opening_scene, JSON_FORCE_OBJECT ) ?>;
				wpifw.coverImage = <?php echo json_encode( $cover_image, JSON_FORCE_OBJECT ) ?>;
				wpifw.coverImageOverlay = <?php echo json_encode( $cover_image_overlay, JSON_FORCE_OBJECT ) ?>;
				
				wpifw.iconColor = <?php echo json_encode( $icon_color, JSON_FORCE_OBJECT ) ?>;
				
				wpifw.allowPreface = <?php echo json_encode( $allow_preface, JSON_FORCE_OBJECT ) ?>;
				wpifw.preface = <?php echo json_encode( $wpifw_preface, JSON_FORCE_OBJECT ) ?>;	
			
				wpifw.init( function( message ) { 
					
					if ( !wpifw.local )
						wpifw.generatePlayer( function ( message ) { 
	
							wpifw.sceneUrl = <?php echo json_encode( $dataUrl, JSON_FORCE_OBJECT ) ?>;
							
							if ( wpifw.sceneUrl == null ) {
								wpifw.sceneUrl = <?php echo json_encode( $opening_scene, JSON_FORCE_OBJECT ) ?>; 
							}
							wpifw.getScene( wpifw.sceneUrl );					
					});
				});
			
		</script>        
    </body>
</html>