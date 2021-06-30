<?php
/*
Plugin Name: Rather Simple Infinite Latest Posts
Plugin URI:
Update URI: false
Version: 1.0
Requires at least: 5.0
Requires PHP: 7.0
Author: Oscar Ciutat
Author URI: http://oscarciutat.com/code/
Text Domain: rather-simple-infinite-latest-posts
Description: A really simple infinite latest posts widget.
License: GPLv2 or later

  This program is free software; you can redistribute it and/or modify
  it under the terms of the GNU General Public License, version 2, as 
  published by the Free Software Foundation.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program; if not, write to the Free Software
  Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
*/

class Rather_Simple_Infinite_Latest_Posts {

    /**
     * Plugin instance.
     *
     * @since 1.0
     *
     */
    protected static $instance = null;
    
    /**
     * Access this plugin’s working instance
     *
     * @since 1.0
     *
     */
    public static function get_instance() {
        
        if ( !self::$instance ) {
            self::$instance = new self;
        }

        return self::$instance;

    }
    
    /**
     * Used for regular plugin work.
     *
     * @since 1.0
     *
     */
    public function plugin_setup() {

        $this->includes();

        add_action( 'init', array( $this, 'load_language' ) );
        add_action( 'init', array( $this, 'register_block' ) );
        add_action( 'rest_api_init', array( $this, 'rest_api_init' ) );
        add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_scripts' ) );

    }
   
    /**
     * Constructor. Intentionally left empty and public.
     *
     * @since 1.0
     *
     */
    public function __construct() {}
    
    /**
     * Includes required core files used in admin and on the frontend.
     *
     * @since 1.0
     *
     */
    protected function includes() {
        require_once 'include/rather-simple-infinite-latest-posts-widget.php';
    }
    
    /**
     * Loads language
     *
     * @since 1.0
     *
     */
    public function load_language() {
        load_plugin_textdomain( 'rather-simple-infinite-latest-posts', '', dirname( plugin_basename( __FILE__ ) ) . '/languages/' );
    }

    /**
	 * Enqueue scripts and styles
	 *
	 */
    function enqueue_scripts() {
        // Load styles
        wp_enqueue_style( 'rsilp-style', plugins_url( 'style.css', __FILE__ ) );

        // Load scripts
        wp_enqueue_script( 'rsilp-script', plugins_url( '/assets/js/frontend.js', __FILE__ ), array( 'jquery' ), false, true );
        wp_localize_script( 'rsilp-script', 'rsilp_params_rest', array(
            'rest_url'   => rest_url(),
            'rest_nonce' => wp_create_nonce( 'wp_rest' )
        ) );
    }

    /**
	 * Register REST route
	 *
	 */
    function rest_api_init() {
        register_rest_route( 'rsilp/v1', '/posts', array(
            'methods'             => 'GET',
            'callback'            => array( $this, 'load_posts_rest' ),
            'permission_callback' => '__return_true',
            'args'                => array(
                'category' => array(
                    'validate_callback' => function( $param, $request, $key ) {
                        return is_numeric( $param );
                    }
                ),
                'number' => array(
                    'validate_callback' => function( $param, $request, $key ) {
                        return is_numeric( $param );
                    }
                ),
                'offset' => array(
                    'validate_callback' => function( $param, $request, $key ) {
                        return is_numeric( $param );
                    }
                ),
                'total' => array(
                    'validate_callback' => function( $param, $request, $key ) {
                        return is_numeric( $param );
                    }
                ),
            ),
        ) );
    }

    /**
	 * Load posts via REST
	 *
	 */
    function load_posts_rest( WP_REST_Request $request ) {
        $category = $request['category'];
        $number = $request['number'];
        $offset = $request['offset'];
        $total = $request['total'];

        $data = array();

        $args = array(
            'post_type'              => 'post',
            'posts_per_page'         => $total,
            'no_found_rows'          => true,
            'post_status'            => 'publish',
            'offset'                 => $offset,
            'order'                  => 'DESC',
            'orderby'                => 'date',
            'update_post_term_cache' => false,
            'update_post_meta_cache' => false,
        );

        if ( $category != 0 ) {
            $args['tax_query'] = array(
                array(
                    'taxonomy' => 'category',
                    'field'    => 'id',
                    'terms'    => $category,
                ),
            );
        }

        // Get all posts matching the $request parameters
        $query = new WP_Query( $args );
        if ( $query->have_posts() ) :
            while ( $query->have_posts() ) :
                $query->the_post();
                $content = apply_filters( 'the_content', get_the_content() );
                $content = str_replace( ']]>', ']]&gt;', $content );
                $post_edit_link = get_edit_post_link() ? '<span class="edit-link"><a class="post-edit-link" href="' . esc_url( get_edit_post_link() ) . '">' . __( 'Edit', 'rather-simple-infinite-latest-posts' ) . '</a></span>' : '';
                $data[] = array(
                    'ID'             => get_the_ID(),
                    'post_title'     => get_the_title(),
                    'post_content'   => $content,
                    'post_class'     => get_post_class(),
                    'post_edit_link' => $post_edit_link
                );
            endwhile;
        endif;

        $args = array(
            'post_type'              => 'post',
            'posts_per_page'         => -1,
            'post_status'            => 'publish',
            'update_post_term_cache' => false,
            'update_post_meta_cache' => false,
        );

        if ( $category != 0 ) {
            $args['tax_query'] = array(
                array(
                    'taxonomy' => 'category',
                    'field'    => 'id',
                    'terms'    => $category,
                ),
            );
        }

        // Get total number of posts
        $query = new WP_Query( $args );
        $numposts = $query->found_posts;

        $result = array();
        $result['posts'] = $data;
        $result['numposts'] = $numposts;

        $response = new WP_REST_Response( $result, 200 );
        $response->set_headers( array( 'Cache-Control' => 'max-age=60' ) );
        return $response;
    }

    /**
     * Registers block
     *
     * @since 1.0
     *
     */
    public function register_block() {

        if ( ! function_exists( 'register_block_type' ) ) {
            // The block editor is not active.
            return;
        }

        $dir = dirname( __FILE__ );
        $script_asset_path = "$dir/build/index.asset.php";
        if ( ! file_exists( $script_asset_path ) ) {
            throw new Error(
                'You need to run `npm start` or `npm run build` for the block first.'
            );
        }
        $script_asset = require( $script_asset_path );
        
        wp_register_style(
            'rather-simple-infinite-latest-posts-frontend',
            plugins_url( 'build/style-index.css', __FILE__ ),
            array(),
            filemtime( plugin_dir_path( __FILE__ ) . 'build/style-index.css' )
        );
        wp_register_script(
            'rather-simple-infinite-latest-posts-block',
            plugins_url( 'build/index.js', __FILE__ ),
            $script_asset['dependencies'],
            filemtime( plugin_dir_path( __FILE__ ) . 'build/index.js' )
        );

        register_block_type( 'occ/rather-simple-infinite-latest-posts', array(
            'style'           => 'rather-simple-infinite-latest-posts-frontend',
            'editor_script'   => 'rather-simple-infinite-latest-posts-block',
            'render_callback' => array( $this, 'render_block' ),
            'attributes' => array(
                'category' => array(
                    'type'    => 'integer',
                    'default' => 0,
                ),
                'number' => array(
                    'type'    => 'integer',
                    'default' => 5,
                ),
            ),
        ) );

        wp_set_script_translations( 'rather-simple-infinite-latest-posts-block', 'rather-simple-infinite-latest-posts', plugin_dir_path( __FILE__ ) . 'languages' );

    }

    /**
     * render_block
     */
    public function render_block( $attr, $content ) {
        $html = '';

        $category = $attr['category'];
		$number = $attr['number'];

        $html = '<div class="widget widget_infinite_latest_posts"><div class="infinite-posts"></div>
        <input type="button" class="load-more" value="' . __( 'Load More', 'rather-simple-infinite-latest-posts' ) . '" data-category="' . esc_attr( $category ) . '" data-number="' . esc_attr( $number ) . '" data-offset="' . esc_attr( $number ) . '" data-total="' . esc_attr( $number ) . '" /></div>';

        return $html;
    }

}

add_action( 'plugins_loaded', array( Rather_Simple_Infinite_Latest_Posts::get_instance(), 'plugin_setup' ) );