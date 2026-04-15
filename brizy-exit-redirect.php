<?php
/**
 * Plugin Name: Brizy Exit Redirect
 * Plugin URI: https://github.com/dustysmba/brizy-exit-redirect
 * Description: Redirects the Brizy editor "Go to Dashboard" button to the frontend permalink of the page being edited. Also hides the comments button from the admin bar.
 * Version: 1.0.1
 * Author: dustysmba
 * License: GPL-2.0-or-later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Requires at least: 5.0
 * Requires PHP: 7.2
 * GitHub Plugin URI: ordinary82/brizy-exit-redirect
 * Primary Branch: main
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action( 'wp_enqueue_scripts', 'brizy_exit_redirect_enqueue', 9999 );

add_action( 'admin_bar_menu', 'brizy_exit_redirect_hide_comments', 99999 );

add_action( 'wp_head', 'brizy_exit_redirect_hide_admin_bar_items_css' );
add_action( 'admin_head', 'brizy_exit_redirect_hide_admin_bar_items_css' );

function brizy_exit_redirect_hide_admin_bar_items_css() {
	echo '<style>#wp-admin-bar-brizy-membership-admin-bar-menu,.js-types-in-toolbar{display:none!important}</style>';
}

function brizy_exit_redirect_hide_comments( $wp_admin_bar ) {
	$wp_admin_bar->remove_node( 'comments' );
	$wp_admin_bar->remove_node( 'new-content' );
}

function brizy_exit_redirect_enqueue() {
	if ( ! isset( $_GET['brizy-edit'] ) && ! isset( $_GET['is-editor-iframe'] ) ) {
		return;
	}

	$post_id = get_the_ID();
	if ( ! $post_id ) {
		$post_id = url_to_postid( home_url( $_SERVER['REQUEST_URI'] ) );
	}
	if ( ! $post_id ) {
		return;
	}

	// Brizy templates (CPT: editor-template) have no meaningful frontend
	// permalink — leave the Dashboard link alone.
	if ( get_post_type( $post_id ) === 'editor-template' ) {
		return;
	}

	$permalink = get_permalink( $post_id );
	if ( ! $permalink ) {
		return;
	}

	wp_enqueue_script(
		'brizy-exit-redirect',
		plugin_dir_url( __FILE__ ) . 'assets/js/redirect.js',
		array(),
		'1.0.1',
		true
	);

	wp_localize_script( 'brizy-exit-redirect', 'brizyExitRedirect', array(
		'permalink' => esc_url( $permalink ),
	) );
}
