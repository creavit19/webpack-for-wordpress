<?php

define( 'THEME_DIR', get_stylesheet_directory() );
define( 'THEME_URI', get_stylesheet_directory_uri() );
define( 'ASSETS_URI', THEME_URI . '/assets/dist/' );

require_once THEME_DIR .'/inc/helpers/enqueue-point.php';
require_once THEME_DIR .'/inc/wp/enqueue-scripts.php';

