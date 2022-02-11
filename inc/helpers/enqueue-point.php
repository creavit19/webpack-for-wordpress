<?php

function helper_read_assets() {

	$assets_file = THEME_DIR .'/assets/dist/assets.json';
	
	if ( !file_exists( $assets_file ) ) wp_die( '<pre>Error: ' . $assets_file . ' file is absent.</pre>' );
	
	return json_decode( file_get_contents( $assets_file ), true );

}

function helper_enqueue_point( $json, $point, $deps = [ 'styles' => [], 'scripts' => [] ] ) {

	if ( empty($json[$point]) ) wp_die( '<pre>Error: asset point "' . $point . '" is not exist.</pre>' );		

	$order = [];

	foreach ( $json as $key => $data ) {

		$arr = explode("~", $key);

		if ( $key == $point || $key == 'vendors~' . $point || !in_array( $point, $arr ) || !in_array( 'vendors', $arr ) ) continue;

		$order[] = $key;
		
	}

	if ( !empty( $json['vendors~' . $point] ) ) {

		$order[] = 'vendors~' . $point;

	}

	foreach ( $json as $key => $data ) {

		$arr = explode("~", $key);

		if ( $key == $point || !in_array( $point, $arr ) || in_array( 'vendors', $arr ) ) continue;

		$order[] = $key;
		
	}

	$order[] = $point;

	foreach ($order as $dot) {

		if ( !empty($json[$dot]['css']) ) {

			$handle = $dot . '~css';

			if ( !wp_style_is( $handle, 'enqueued' ) ) {
				wp_enqueue_style( $handle, ASSETS_URI . $json[$dot]['css'], $deps['styles'], null );
			}

			$deps['styles'][] = $handle;

		}

		if ( !empty($json[$dot]['js']) ) {

			$handle = $dot . '~js';

			if ( !wp_script_is( $handle, 'enqueued' ) ) {
				wp_enqueue_script( $handle, ASSETS_URI . $json[$dot]['js'], $deps['scripts'], null, true);
			}

			$deps['scripts'][] = $handle;

		}

	}

}
