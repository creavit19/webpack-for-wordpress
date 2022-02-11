<?php
/**
 * Theme CSS & JS
 */
function theme_scripts() {
	
	$json = helper_read_assets();

	$deps = [
		'styles' => ['storefront-style', 'storefront-woocommerce-style'],
		'scripts' => []
	];

	// Main Point
  helper_enqueue_point( $json, 'common', $deps );

	// Template Point
	$template = current(explode(".", get_page_template_slug()));
	if ( array_key_exists( $template, $json ) ) {
		helper_enqueue_point( $json, $template, $deps );
	}
	
  // Throw variables to front-end
	$theme_vars = [
		'home'   => get_home_url(),
		'ajaxurl' => admin_url('admin-ajax.php'),
		'is_auth' => is_user_logged_in(),
	];
	wp_localize_script('main-javascript', 'themeVars', $theme_vars);
}

add_action('wp_enqueue_scripts', 'theme_scripts');