<?php
/**
 * Plugin Name: Rather Simple Infinite Latest Posts
 * Plugin URI:
 * Update URI: false
 * Version: 1.0
 * Requires at least: 6.6
 * Requires PHP: 7.4
 * Author: Oscar Ciutat
 * Author URI: http://oscarciutat.com/code/
 * Text Domain: rather-simple-infinite-latest-posts
 * Description: A really simple infinite latest posts block.
 * License: GPLv2 or later
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License, version 2, as
 * published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
 *
 * @package rather_simple_infinite_latest_posts
 */

/**
 * Core class used to implement the plugin.
 */
class Rather_Simple_Infinite_Latest_Posts {

	/**
	 * Plugin instance.
	 *
	 * @var object $instance
	 */
	protected static $instance = null;

	/**
	 * Access this plugin’s working instance
	 */
	public static function get_instance() {

		if ( ! self::$instance ) {
			self::$instance = new self();
		}

		return self::$instance;
	}

	/**
	 * Used for regular plugin work.
	 */
	public function plugin_setup() {

		$this->includes();

		add_action( 'init', array( $this, 'load_language' ) );
		add_action( 'init', array( $this, 'register_block' ) );
		add_action( 'rest_api_init', array( $this, 'rest_api_init' ) );
		add_action( 'enqueue_block_assets', array( $this, 'enqueue_block_assets' ) );
	}

	/**
	 * Constructor. Intentionally left empty and public.
	 */
	public function __construct() {}

	/**
	 * Includes required core files used in admin and on the frontend.
	 */
	protected function includes() {}

	/**
	 * Loads language
	 */
	public function load_language() {
		load_plugin_textdomain( 'rather-simple-infinite-latest-posts', false, dirname( plugin_basename( __FILE__ ) ) . '/languages/' );
	}

	/**
	 * Enqueue block assets
	 */
	public function enqueue_block_assets() {
		$script_handle = generate_block_asset_handle( 'occ/rather-simple-infinite-latest-posts', 'viewScript' );
		wp_localize_script(
			$script_handle,
			'rsilp_params_rest',
			array(
				'rest_url'   => rest_url(),
				'rest_nonce' => wp_create_nonce( 'wp_rest' ),
			)
		);
	}

	/**
	 * Register REST route
	 */
	public function rest_api_init() {
		register_rest_route(
			'rsilp/v1',
			'/posts',
			array(
				'methods'             => 'GET',
				'callback'            => array( $this, 'load_posts_rest' ),
				'permission_callback' => '__return_true',
				'args'                => array(
					'category' => array(
						'validate_callback' => function ( $param ) {
							return is_numeric( $param );
						},
					),
					'number'   => array(
						'validate_callback' => function ( $param ) {
							return is_numeric( $param );
						},
					),
					'offset'   => array(
						'validate_callback' => function ( $param ) {
							return is_numeric( $param );
						},
					),
					'total'    => array(
						'validate_callback' => function ( $param ) {
							return is_numeric( $param );
						},
					),
				),
			)
		);
	}

	/**
	 * Load posts via REST
	 *
	 * @param WP_REST_Request $request The request being passed.
	 */
	public function load_posts_rest( WP_REST_Request $request ) {
		/*
		$nonce = $request->get_header( 'x_wp_nonce' );
		if ( !wp_verify_nonce( $nonce, 'wp_rest' ) ) {
			return null;
		}*/

		$category = $request['category'];
		$number   = $request['number'];
		$offset   = $request['offset'];
		$total    = $request['total'];

		// Get all posts matching the $request parameters.
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

		if ( ! empty( $category ) ) {
			$args['tax_query'] = array(
				array(
					'taxonomy' => 'category',
					'field'    => 'id',
					'terms'    => $category,
				),
			);
		}

		$query = new WP_Query( $args );
		if ( $query->have_posts() ) :
			while ( $query->have_posts() ) :
				$query->the_post();
				$content        = apply_filters( 'the_content', get_the_content() );
				$content        = str_replace( ']]>', ']]&gt;', $content );
				$post_edit_link = get_edit_post_link();
				if ( ! empty( $post_edit_link ) ) {
					$post_edit_link = '<a class="post-edit-link" href="' . esc_url( $post_edit_link ) . '">' . __( 'Edit', 'rather-simple-infinite-latest-posts' ) . '</a>';
					$post_edit_link = apply_filters( 'edit_post_link', $post_edit_link, get_the_ID(), __( 'Edit', 'rather-simple-infinite-latest-posts' ) );
				}
				$data[] = array(
					'ID'             => get_the_ID(),
					'post_title'     => get_the_title(),
					'post_content'   => $content,
					'post_class'     => get_post_class(),
					'post_edit_link' => $post_edit_link,
				);
			endwhile;
		endif;

		// Get total number of posts.
		$args = array(
			'post_type'              => 'post',
			'posts_per_page'         => -1,
			'post_status'            => 'publish',
			'update_post_term_cache' => false,
			'update_post_meta_cache' => false,
		);

		if ( ! empty( $category ) ) {
			$args['tax_query'] = array(
				array(
					'taxonomy' => 'category',
					'field'    => 'id',
					'terms'    => $category,
				),
			);
		}

		$query    = new WP_Query( $args );
		$numposts = $query->found_posts;

		$result             = array();
		$result['posts']    = $data;
		$result['numposts'] = $numposts;

		$response = new WP_REST_Response( $result, 200 );
		$response->set_headers( array( 'Cache-Control' => 'max-age=60' ) );
		return $response;
	}

	/**
	 * Registers block
	 */
	public function register_block() {
		if ( ! function_exists( 'register_block_type' ) ) {
			// The block editor is not active.
			return;
		}

		// Register the block by passing the location of block.json to register_block_type.
		register_block_type(
			__DIR__ . '/build/blocks/infinite-latest-posts',
			array(
				'render_callback' => array( $this, 'render_block' ),
			)
		);

		// Load translations.
		$script_handle = generate_block_asset_handle( 'occ/rather-simple-infinite-latest-posts', 'editorScript' );
		wp_set_script_translations( $script_handle, 'rather-simple-infinite-latest-posts', plugin_dir_path( __FILE__ ) . 'languages' );
	}

	/**
	 * Render block
	 *
	 * @param array $attr     The block attributes.
	 */
	public function render_block( $attr ) {
		$category = $attr['category'];
		$number   = $attr['number'];

		$html = '<div ' . wp_kses_data( get_block_wrapper_attributes() ) . '>
		<div class="infinite-posts"></div>
        <input type="button" class="load-more wp-element-button" value="' . __( 'Load More', 'rather-simple-infinite-latest-posts' ) . '" data-category="' . esc_attr( $category ) . '" data-number="' . esc_attr( $number ) . '" data-offset="' . esc_attr( $number ) . '" data-total="' . esc_attr( $number ) . '" />
		</div>';

		return $html;
	}
}

add_action( 'plugins_loaded', array( Rather_Simple_Infinite_Latest_Posts::get_instance(), 'plugin_setup' ) );
