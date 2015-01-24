<?php

/**
 * Proper way to enqueue scripts and styles
 */
function kodipress_styles() {
	wp_enqueue_style( 'kodipress-boostrap', '//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.2/css/bootstrap.min.css' );
	wp_enqueue_style( 'kodipress-styles', get_stylesheet_directory_uri() . '/kodipress.css' );

	/**
	 * Load jQuery in footer from Google CDN
	 */
	if( !is_admin() ){
		wp_deregister_script( 'jquery' );
		wp_register_script( 'jquery', ( '//ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js' ), false, '2.1.3', true );
		wp_enqueue_script( 'jquery' );
	}
	
	/**
	 * Load all vendor scripts / plugins
	 */
	wp_enqueue_script( 'kodipress-boostrap', '//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.2/js/bootstrap.min.js', array( 'jquery' ), '3.3.2', true );
	wp_enqueue_script( 'kodipress-handlebars', '//cdnjs.cloudflare.com/ajax/libs/handlebars.js/2.0.0/handlebars.min.js', array( 'jquery' ), '2.0.0', true );
	wp_enqueue_script( 'kodipress-lazyload', '//cdnjs.cloudflare.com/ajax/libs/jquery.lazyload/1.9.1/jquery.lazyload.min.js', array( 'jquery' ), '1.9.1', true );
	wp_enqueue_script( 'kodipress-mixitup', '//cdn.jsdelivr.net/jquery.mixitup/latest/jquery.mixitup.min.js', array( 'jquery' ), '2.1.6', true );

	/**
	 * Main script with useful variables
	 * http://code.tutsplus.com/tutorials/how-to-pass-php-data-and-strings-to-javascript-in-wordpress--wp-34699
	 */
	wp_enqueue_script( 'kodipress-scripts', get_template_directory_uri() . '/js/kodipress.js', array( 'jquery' ), '1.0.0', true );
	$passed_data = array(
		'ajaxurl'         => admin_url( 'admin-ajax.php' ),
		'ip_address' => get_option('kp_ip_address'),
		'searching_movies' => __( 'Searching movies...', 'kodipress' )
		);
	wp_localize_script( 'kodipress-scripts', 'kodipress', $passed_data );
}

add_action( 'wp_enqueue_scripts', 'kodipress_styles' );


/**
 * Add Additional Classes to Body
 */
add_filter('body_class', 'multisite_body_classes');

function multisite_body_classes($classes) {
	if ( is_front_page() ) {
		$classes[] = 'loading';
		return $classes;
	} else {
		return $classes;
	}
}


/**
 * Register Custom Navigation Walker
 */
require_once('wp_bootstrap_navwalker.php');


/**
 * AJAX JSON RPC Api
 */
function wp_kodi() {
	global $wpdb; // this is how you get access to the database

	$data = $_POST['endpoint'];
	$ip_address = get_option('kp_ip_address');
	$url = 'http://' . $ip_address . '/jsonrpc?request=' . $data;
	$args = array(
		'headers' => array(
			'Authorization' => 'Basic ' . base64_encode( julien . ':' . pepito )
			)
		);
	$response = wp_remote_get( $url, $args );
	$the_body = wp_remote_retrieve_body( wp_remote_get( $url, $args ) );

	print_r($the_body);

	die(); // this is required to terminate immediately and return a proper response
}

add_action( 'wp_ajax_kodi', 'wp_kodi' );


/**
 * Register and define the settings
 */
$kp_general_setting = new kp_general_setting();

class kp_general_setting {
	function kp_general_setting( ) {
		add_filter( 'admin_init' , array( &$this , 'register_fields' ) );
	}
	function register_fields() {
		register_setting( 'general', 'kp_ip_address', 'esc_attr' );
		add_settings_field('kp_ip_address', '<label for="kp_ip_address">'.__('Raspberry Pi URL' , 'kp_ip_address' ).'</label>' , array(&$this, 'fields_html') , 'general' );
	}
	function fields_html() {
		$value = get_option( 'kp_ip_address', '' );
		echo '<input type="text" id="kp_ip_address" name="kp_ip_address" value="' . $value . '" class="regular-text ltr"><p class="description">This is the IP address of your Raspberry Pi and the port you\'re using. Usually something like <code>192.168.X.XX:8080</code>.</p>';
	}
}