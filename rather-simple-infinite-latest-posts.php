<?php
/*
Plugin Name: Rather Simple Infinite Latest Posts
Plugin URI:
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
        add_action( 'wp_ajax_my_load_recent', array( $this, 'my_load_recent_posts' ) );
        add_action( 'wp_ajax_nopriv_my_load_recent', array( $this, 'my_load_recent_posts' ) );
    
	}

    /**
	 * Enqueue scripts and styles
	 *
	 */
    function enqueue_scripts() {
        // Load scripts
        //wp_enqueue_script( 'infinite-scroll', plugins_url( '/assets/js/infinite-scroll.pkgd.min.js', __FILE__ ), array( 'jquery' ), false, true );
        wp_enqueue_script( 'rsilp-script', plugins_url( '/assets/js/frontend.js', __FILE__ ), array( 'jquery' /*, 'infinite-scroll'*/ ), false, true );
        wp_localize_script( 'rsilp-script', 'rsilp_params', array( 'ajax_url' => admin_url( 'admin-ajax.php' ) ) );
    }


    function my_load_recent_posts() {
        $offset = $_POST['offset'];
        $args = array(
            'posts_per_page'      => 5,
            'no_found_rows'       => true,
            'post_status'         => 'publish',
            'ignore_sticky_posts' => true,
            'offset'              => $offset,
        );
        query_posts( $args ); /* [1] */

        /* Header wrap output */
        if ( have_posts() ) :
            while ( have_posts() ) :
                the_post();
            ?>
                <article id="post-<?php the_ID(); ?>" <?php post_class( '', get_the_ID() ); ?>>
                <header class="entry-header">
                    <h2><?php the_title(); ?></h2>
                </header>
                <div class="entry-content">
                    <?php the_content(); ?>
                </div>
                </article>
            <?php
            endwhile;
        else :
            /* Output for if there are no posts to get */
        endif;
        /* Footer wrap output */

        wp_reset_query();

	    wp_die();
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

		$number = ( ! empty( $instance['number'] ) ) ? absint( $instance['number'] ) : 5;
		if ( ! $number ) {
			$number = 5;
		}
		$show_date = isset( $instance['show_date'] ) ? $instance['show_date'] : false;

		$r = new WP_Query(
            array(
                'posts_per_page'      => $number,
                'no_found_rows'       => true,
                'post_status'         => 'publish',
                'ignore_sticky_posts' => true
            )
		);

		if ( ! $r->have_posts() ) {
			return;
		}
		?>

		<?php echo $args['before_widget']; ?>

		<?php
		if ( $title ) {
			echo $args['before_title'] . $title . $args['after_title'];
		}
		?>

        <div class="infinite-posts">

        <?php foreach ( $r->posts as $recent_post ) : ?>
            <?php
            $post_title   = get_the_title( $recent_post->ID );
            $title        = ( ! empty( $post_title ) ) ? $post_title : __( '(no title)' );
            $aria_current = '';

            if ( get_queried_object_id() === $recent_post->ID ) {
                $aria_current = ' aria-current="page"';
            }
            ?>
            <article id="post-<?php echo $recent_post->ID; ?>" <?php post_class( '', $recent_post->ID ); ?>>
                <header class="entry-header">
                    <h2><?php echo $title; ?></h2>
                    <?php if ( $show_date ) : ?>
                    <span class="post-date"><?php echo get_the_date( '', $recent_post->ID ); ?></span>
                <?php endif; ?>
                </header>
                <div class="entry-content">
                    <?php echo $recent_post->post_content; ?>
                </div>
            </article>
        <?php endforeach; ?>

        </div>

        <input type="button" class="load-more" value="<?php _e( 'Load More', 'rather-simple-infinite-latest-posts' ); ?>" data-offset="5" />

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
		$instance['show_date'] = isset( $new_instance['show_date'] ) ? (bool) $new_instance['show_date'] : false;
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
		$number    = isset( $instance['number'] ) ? absint( $instance['number'] ) : 5;
		$show_date = isset( $instance['show_date'] ) ? (bool) $instance['show_date'] : false;
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
			<input class="checkbox" type="checkbox"<?php checked( $show_date ); ?> id="<?php echo $this->get_field_id( 'show_date' ); ?>" name="<?php echo $this->get_field_name( 'show_date' ); ?>" />
			<label for="<?php echo $this->get_field_id( 'show_date' ); ?>"><?php _e( 'Display post date?' ); ?></label>
		</p>
		<?php
	}
}

add_action( 'widgets_init', function() { return register_widget( 'Rather_Simple_Infinite_Latest_Posts' ); } );