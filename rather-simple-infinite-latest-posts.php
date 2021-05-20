<?php
/*
Plugin Name: Rather Simple Infinite Latest Posts
Plugin URI:
Update URI: false
Description: A really simple infinite latest posts widget.
Version: 1.0
Author: Oscar Ciutat
Author URI: http://oscarciutat.com/code/
Text Domain: rather-simple-infinite-latest-posts
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

class Rather_Simple_Infinite_Latest_Posts extends WP_Widget {
    
	/**
	 * Sets up a new Infinite Latest Posts widget instance.
	 *
	 * @since 2.8.0
	 */
	public function __construct() {
        load_plugin_textdomain( 'rather-simple-infinite-latest-posts', '', dirname( plugin_basename( __FILE__ ) ) . '/languages/' );
		$widget_ops = array(
			'classname'                   => 'widget_infinite_latest_posts',
			'description'                 => __( 'Your site&#8217;s most recent Posts.' ),
			'customize_selective_refresh' => true,
		);
		parent::__construct( 'infinite-latest-posts', __( 'Infinite Latest Posts', 'rather-simple-infinite-latest-posts' ), $widget_ops );
		$this->alt_option_name = 'widget_infinite_latest_posts';
        
        add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_scripts' ) );
        add_action( 'rest_api_init', array( $this, 'rest_api_init' ) );
    
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
	 * Outputs the content for the current Recent Posts widget instance.
	 *
	 * @since 2.8.0
	 *
	 * @param array $args     Display arguments including 'before_title', 'after_title',
	 *                        'before_widget', and 'after_widget'.
	 * @param array $instance Settings for the current Recent Posts widget instance.
	 */
	public function widget( $args, $instance ) {
		if ( ! isset( $args['widget_id'] ) ) {
			$args['widget_id'] = $this->id;
		}

		$default_title = __( 'Infinite Latest Posts', 'rather-simple-infinite-latest-posts' );
		$title         = ( ! empty( $instance['title'] ) ) ? $instance['title'] : $default_title;

		/** This filter is documented in wp-includes/widgets/class-wp-widget-pages.php */
		$title = apply_filters( 'widget_title', $title, $instance, $this->id_base );

        $category = ( ! empty( $instance['category'] ) ) ? absint( $instance['category'] ) : 0;

		$number = ( ! empty( $instance['number'] ) ) ? absint( $instance['number'] ) : 5;
		if ( ! $number ) {
			$number = 5;
		}

		echo $args['before_widget']; ?>

		<?php
		if ( $title ) {
			echo $args['before_title'] . $title . $args['after_title'];
		}
		?>

        <div class="infinite-posts"></div>

        <input type="button" class="load-more" value="<?php _e( 'Load More', 'rather-simple-infinite-latest-posts' ); ?>" data-category="<?php echo esc_attr( $category ); ?>" data-number="<?php echo esc_attr( $number ); ?>" data-offset="<?php echo esc_attr( $number ); ?>" data-total="<?php echo esc_attr( $number ); ?>" />

        <?php
		echo $args['after_widget'];
	}

	/**
	 * Handles updating the settings for the current Recent Posts widget instance.
	 *
	 * @since 2.8.0
	 *
	 * @param array $new_instance New settings for this instance as input by the user via
	 *                            WP_Widget::form().
	 * @param array $old_instance Old settings for this instance.
	 * @return array Updated settings to save.
	 */
	public function update( $new_instance, $old_instance ) {
		$instance              = $old_instance;
		$instance['title']     = sanitize_text_field( $new_instance['title'] );
		$instance['number']    = (int) $new_instance['number'];
        $instance['category']  = (int) $new_instance['category'];
		return $instance;
	}

	/**
	 * Outputs the settings form for the Recent Posts widget.
	 *
	 * @since 2.8.0
	 *
	 * @param array $instance Current settings.
	 */
	public function form( $instance ) {
		$title     = isset( $instance['title'] ) ? esc_attr( $instance['title'] ) : '';
        $category  = isset( $instance['category'] ) ? absint( $instance['category'] ) : 0;
		$number    = isset( $instance['number'] ) ? absint( $instance['number'] ) : 5;
		?>
		<p>
			<label for="<?php echo $this->get_field_id( 'title' ); ?>"><?php _e( 'Title:' ); ?></label>
			<input class="widefat" id="<?php echo $this->get_field_id( 'title' ); ?>" name="<?php echo $this->get_field_name( 'title' ); ?>" type="text" value="<?php echo $title; ?>" />
		</p>

		<p>
			<label for="<?php echo $this->get_field_id( 'number' ); ?>"><?php _e( 'Number of posts to show:' ); ?></label>
			<input class="tiny-text" id="<?php echo $this->get_field_id( 'number' ); ?>" name="<?php echo $this->get_field_name( 'number' ); ?>" type="number" step="1" min="1" value="<?php echo $number; ?>" size="3" />
		</p>

        <p>
            <label for="<?php echo $this->get_field_id( 'category' ); ?>"><?php _e( 'Category:', 'rather-simple-infinite-latest-posts' ); ?></label>
            <?php wp_dropdown_categories( array( 'show_option_all' => __( 'All Categories', 'rather-simple-infinite-latest-posts' ), 'name' => $this->get_field_name( 'category' ), 'selected' => $category, 'hide_empty' => 0 ) ); ?>
        </p>

		<?php
	}
}

add_action( 'widgets_init', function() { return register_widget( 'Rather_Simple_Infinite_Latest_Posts' ); } );