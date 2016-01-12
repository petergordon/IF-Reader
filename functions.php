<?php
/**
 * WP IF Reader
 * functions and definitions
 *
 * @package wp-if-reader 
 * version 0.1
 *
 */
 

/**
 * Remove unnecessary header info
 * 
 */ 

remove_action( 'wp_head', 'feed_links_extra', 3 ); // Display the links to the extra feeds such as category feeds
remove_action( 'wp_head', 'feed_links', 2 ); // Display the links to the general feeds: Post and Comment Feed
remove_action( 'wp_head', 'rsd_link' ); // Display the link to the Really Simple Discovery service endpoint, EditURI link
remove_action( 'wp_head', 'wlwmanifest_link' ); // Display the link to the Windows Live Writer manifest file.
remove_action( 'wp_head', 'index_rel_link' ); // index link
remove_action( 'wp_head', 'parent_post_rel_link', 10, 0 ); // prev link
remove_action( 'wp_head', 'start_post_rel_link', 10, 0 ); // start link
remove_action( 'wp_head', 'adjacent_posts_rel_link', 10, 0 ); // Display relational links for the posts adjacent to the current post.
remove_action( 'wp_head', 'wp_generator' ); // Display the XHTML generator that is generated on the wp_head hook, WP version
remove_action( 'wp_head', 'json_output_link_wp_head' ); // WP JSON API header link
remove_action( 'wp_head', 'rel_canonical'); // Remove canonical link  
remove_action( 'wp_head', 'wp_shortlink_wp_head' ); // Remove shortlink  

remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
remove_action( 'wp_print_styles', 'print_emoji_styles' );


add_filter( 'index_rel_link', 'head_remove' );
add_filter( 'parent_post_rel_link', 'head_remove' );
add_filter( 'start_post_rel_link', 'head_remove' );
add_filter( 'previous_post_rel_link', 'head_remove' );
add_filter( 'next_post_rel_link', 'head_remove' );
add_filter( 'wp_shortlink_wp_head', 'head_remove' );


function head_remove( $data ) {
	return false;
}


/**
 * Enqueue scripts and styles
 *
 */
 
function wpifw_reader_scripts() {
	
	global $pagenow;
	
	//echo ( $pagenow );
	
	if ( $pagenow == 'wp-activate.php' ) {
		
		wp_enqueue_style( 'activate', get_stylesheet_directory_uri() . '/css/wpifw-activate.css' );	
				
	} else {
		
		wp_enqueue_script( 'core', get_template_directory_uri() . '/js/wpifw-core.js', array(), '', true  );
		wp_enqueue_script( 'defaults', get_template_directory_uri() . '/js/wpifw-PcDefaults.js', array(), '', true  );
		wp_enqueue_script( 'combat', get_template_directory_uri() . '/js/wpifw-Combat.js', array(), '', true  );
		wp_enqueue_script( 'combatView', get_template_directory_uri() . '/js/wpifw-combatView.js', array(), '', true  );
		wp_enqueue_script( 'characterView', get_template_directory_uri() . '/js/wpifw-characterView.js', array(), '', true  );
		wp_enqueue_script( 'player', get_template_directory_uri() . '/js/wpifw-Player.js', array(), '', true  );
		wp_enqueue_script( 'luck', get_template_directory_uri() . '/js/wpifw-Luck.js', array(), '', true  );
		wp_enqueue_script( 'passphrase', get_template_directory_uri() . '/js/wpifw-Passphrase.js', array(), '', true  );	
	
		wp_enqueue_style( 'core', get_stylesheet_directory_uri() . '/css/wpifw-core.css' );
		wp_enqueue_style( 'fonts', get_stylesheet_directory_uri() . '/fonts/stylesheet.css' );
	}
	

}
add_action( 'wp_enqueue_scripts', 'wpifw_reader_scripts' ); 


function wpifw_custom_login() {
	
		wp_enqueue_style( 'core-css', get_stylesheet_directory_uri() . '/css/wpifw-login.css' );	
}
add_action( 'login_enqueue_scripts', 'wpifw_custom_login', 10 );


/**
 * Add theme support for post tumbnails 
 * http://codex.wordpress.org/Post_Thumbnails
 *
 */ 

add_theme_support( 'post-thumbnails', array( 'characters', 'scene', 'character_defaults' ) ); 


/**
 * Remove admin bar when viewing front-end
 * http://codex.wordpress.org/Post_Thumbnails
 *
 */ 
show_admin_bar( false );


/**
 * use WordPress REST API to get passed URL from  site
 * Example usage: <?php $json = wpifw_reader_get_json( 'http://~~~~/wp-json/wp/v2/scene/6' ); ?>
 *
 */ 

 	function wpifw_reader_get_json( $url ) {
		
		$response = wp_remote_get( $url, array (
			'method' => 'GET',
			)
		);
		if ( is_wp_error( $response ) ) {
			return sprintf( 'The URL %1s could not be retrieved.', $url );
		}
		$data = wp_remote_retrieve_body( $response );
		if ( ! is_wp_error( $data )  ) {
			return json_encode( $data, JSON_FORCE_OBJECT );
			return json_decode( $data );
		} else {
			return sprintf( 'The URL %1s could not be decoded.', $url );
		}
	}

function wpifw_the_content_filter($content) {
	
	$content = str_replace('<p>&nbsp;</p>', '<div>&nbsp;</div>', $content);
	return $content;
}

add_filter( 'the_content', 'wpifw_the_content_filter' );
	
	
	add_action( 'init', 'add_cpt_to_json_api', 30 );
	function add_cpt_to_json_api(){
	
		global $wp_post_types;
		$wp_post_types['scene']->show_in_rest = true;
		$wp_post_types['scene']->rest_base = 'scene';
		$wp_post_types['scene']->rest_controller_class = 'WP_REST_Posts_Controller';
		
		$wp_post_types['character_defaults']->show_in_rest = true;
		$wp_post_types['character_defaults']->rest_base = 'character_defaults';
		$wp_post_types['character_defaults']->rest_controller_class = 'WP_REST_Posts_Controller';
		
		$wp_post_types['characters']->show_in_rest = true;
		$wp_post_types['characters']->rest_base = 'characters';
		$wp_post_types['characters']->rest_controller_class = 'WP_REST_Posts_Controller';
		
		
	}
	
	add_filter( 'rest_prepare_scene', 'add_scene_meta_to_json', 10, 3 );
		
	function add_scene_meta_to_json($data, $post, $request){
		
		$response_data = $data->get_data();
		
		if ( $request['context'] !== 'view' || is_wp_error( $data ) ) {
			return $data;
		}
		
		$follow_on = get_post_meta( $post->ID, '_follow_on_options', true );
		if(empty($follow_on)){
			$follow_on = '';
		}
		
		if($post->post_type == 'scene'){
			$response_data['custom_meta'] = array(
				'choice' => $follow_on,
			);  
		}
		
		$data->set_data( $response_data );
		
		return $data;
	}
	
	add_filter( 'rest_prepare_character_defaults', 'add_character_defaults_meta_to_json', 10, 3 );
		
	function add_character_defaults_meta_to_json($data, $post, $request){
		
		$response_data = $data->get_data();
		
		if ( $request['context'] !== 'view' || is_wp_error( $data ) ) {
			return $data;
		}
		
		$character_defaults = get_post_meta( $post->ID, '_character_defaults', true );
		if(empty($character_defaults)){
			$character_defaults = '';
		}
		
		if($post->post_type == 'character_defaults'){
			$response_data['custom_meta'] = array(
				'character_defaults' => $character_defaults,
			);  
		}
		
		$data->set_data( $response_data );
		
		return $data;
	}
	
	add_filter( 'rest_prepare_characters', 'add_characters_meta_to_json', 10, 3 );
		
	function add_characters_meta_to_json($data, $post, $request){
		
		$response_data = $data->get_data();
		
		if ( $request['context'] !== 'view' || is_wp_error( $data ) ) {
			return $data;
		}
		
		$characters = get_post_meta( $post->ID, '_character_profile', true );
		if(empty($characters)){
			$characters = '';
		}
		
		if($post->post_type == 'characters'){
			$response_data['custom_meta'] = array(
				'character_profile' => $characters,
			);  
		}
		
		$data->set_data( $response_data );
		
		return $data;
	}
	
	/*
	*
	*	Shortcodes
	*
	*/
	
	function character_shortcode( $atts, $content ) {
		
		$page = get_page_by_title( $atts['title'], OBJECT, 'characters' );
		
		$out = '<a data-character="'.$page->ID.'" class="character-shortcode">'.$content .'</a>';
		return html_entity_decode($out);
	}
	
	add_shortcode( 'character', 'character_shortcode' );
	
	function class_shortcode( $atts, $content ) {
		
		$page = get_page_by_title( $atts['title'], OBJECT, 'character_defaults' );
		
		$out = '<a data-class="'.$page->ID.'" class="character-shortcode">'.$content .'</a>';
		return html_entity_decode($out);
	}
	
	add_shortcode( 'class', 'class_shortcode' );
	