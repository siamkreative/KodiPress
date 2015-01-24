<?php

/**
 * Proper way to enqueue scripts and styles
 */
function kodipress_styles() {
	wp_enqueue_style( 'kodipress-boostrap', '//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.2/css/bootstrap.min.css' );
	wp_enqueue_style( 'kodipress-styles', get_stylesheet_directory_uri() . '/kodipress.css' );
	
	wp_enqueue_script( 'kodipress-boostrap', '//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.2/js/bootstrap.min.js', array( 'jquery' ), '3.3.2', true );
	wp_enqueue_script( 'kodipress-handlebars', '//cdnjs.cloudflare.com/ajax/libs/handlebars.js/2.0.0/handlebars.min.js', array( 'jquery' ), '2.0.0', true );
	wp_enqueue_script( 'kodipress-lazyload', '//cdnjs.cloudflare.com/ajax/libs/jquery.lazyload/1.9.1/jquery.lazyload.min.js', array( 'jquery' ), '1.9.1', true );
	wp_enqueue_script( 'kodipress-mixitup', '//cdn.jsdelivr.net/jquery.mixitup/latest/jquery.mixitup.min.js', array( 'jquery' ), '2.1.6', true );
	wp_enqueue_script( 'kodipress-moment', '//cdnjs.cloudflare.com/ajax/libs/moment.js/2.9.0/moment.min.js', array( 'jquery' ), '2.9.0', true );

	wp_enqueue_script( 'kodipress-scripts', get_template_directory_uri() . '/js/kodipress.js', array( 'jquery' ), '1.0.0', true );
}

add_action( 'wp_enqueue_scripts', 'kodipress_styles' );


/**
 * Add Additional Classes to Body
 */
add_filter('body_class', 'multisite_body_classes');

function multisite_body_classes($classes) {
	$classes[] = 'loading';
	return $classes;
}


/**
 * AJAX JSON RPC Api
 */
function wp_kodi() {
	global $wpdb; // this is how you get access to the database

	$data = $_POST['endpoint'];
	$url = 'http://192.168.1.102:8080/jsonrpc?request=' . $data;
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