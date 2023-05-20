<?php
/**
 * Rather_Simple_Infinite_Latest_Posts_Widget class
 *
 * @package rather_simple_infinite_latest_posts
 */

/**
 * Core class used to implement the widget.
 *
 * @see WP_Widget
 */
class Rather_Simple_Infinite_Latest_Posts_Widget extends WP_Widget {

	/**
	 * Sets up a new Infinite Latest Posts widget instance.
	 */
	public function __construct() {
		$widget_ops = array(
			'classname'                   => 'widget_infinite_latest_posts',
			'description'                 => __( 'Your site&#8217;s most recent Posts.' ),
			'customize_selective_refresh' => true,
			'show_instance_in_rest'       => true,
		);
		parent::__construct( 'infinite-latest-posts', __( 'Infinite Latest Posts', 'rather-simple-infinite-latest-posts' ), $widget_ops );
	}

	/**
	 * Outputs the content for the current Recent Posts widget instance.
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

		<input type="button" class="load-more wp-element-button" value="<?php esc_attr_e( 'Load More', 'rather-simple-infinite-latest-posts' ); ?>" data-category="<?php echo esc_attr( $category ); ?>" data-number="<?php echo esc_attr( $number ); ?>" data-offset="<?php echo esc_attr( $number ); ?>" data-total="<?php echo esc_attr( $number ); ?>" />

		<?php
		echo $args['after_widget'];
	}

	/**
	 * Handles updating the settings for the current Recent Posts widget instance.
	 *
	 * @param array $new_instance New settings for this instance as input by the user via
	 *                            WP_Widget::form().
	 * @param array $old_instance Old settings for this instance.
	 * @return array Updated settings to save.
	 */
	public function update( $new_instance, $old_instance ) {
		$instance             = $old_instance;
		$instance['title']    = sanitize_text_field( $new_instance['title'] );
		$instance['number']   = (int) $new_instance['number'];
		$instance['category'] = (int) $new_instance['category'];
		return $instance;
	}

	/**
	 * Outputs the settings form for the Recent Posts widget.
	 *
	 * @param array $instance Current settings.
	 */
	public function form( $instance ) {
		$title    = isset( $instance['title'] ) ? esc_attr( $instance['title'] ) : '';
		$category = isset( $instance['category'] ) ? absint( $instance['category'] ) : 0;
		$number   = isset( $instance['number'] ) ? absint( $instance['number'] ) : 5;
		?>
		<p>
			<label for="<?php echo esc_attr( $this->get_field_id( 'title' ) ); ?>"><?php _e( 'Title:' ); ?></label>
			<input class="widefat" id="<?php echo esc_attr( $this->get_field_id( 'title' ) ); ?>" name="<?php echo esc_attr( $this->get_field_name( 'title' ) ); ?>" type="text" value="<?php echo esc_attr( $title ); ?>" />
		</p>

		<p>
			<label for="<?php echo esc_attr( $this->get_field_id( 'number' ) ); ?>"><?php _e( 'Number of posts to show:' ); ?></label>
			<input class="tiny-text" id="<?php echo esc_attr( $this->get_field_id( 'number' ) ); ?>" name="<?php echo esc_attr( $this->get_field_name( 'number' ) ); ?>" type="number" step="1" min="1" value="<?php echo esc_attr( $number ); ?>" size="3" />
		</p>

		<p>
			<label for="<?php echo esc_attr( $this->get_field_id( 'category' ) ); ?>"><?php _e( 'Category:', 'rather-simple-infinite-latest-posts' ); ?></label>
			<?php
				wp_dropdown_categories(
					array(
						'show_option_all' => __( 'All Categories', 'rather-simple-infinite-latest-posts' ),
						'name'            => $this->get_field_name( 'category' ),
						'selected'        => $category,
						'hide_empty'      => 0,
					)
				);
			?>
		</p>

		<?php
	}
}

add_action(
	'widgets_init',
	function() {
		return register_widget( 'Rather_Simple_Infinite_Latest_Posts_Widget' );
	}
);
