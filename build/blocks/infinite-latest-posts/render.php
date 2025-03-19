<?php
/**
 * All of the parameters passed to the function where this file is being required are accessible in this scope:
 *
 * @param array    $attributes     The array of attributes for this block.
 * @param string   $content        Rendered block output. ie. <InnerBlocks.Content />.
 * @param WP_Block $block          The instance of the WP_Block class that represents the block being rendered.
 *
 * @package rather_simple_infinite_latest_posts
 */

?>
<div
	<?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>
	<?php
	echo wp_interactivity_data_wp_context(
		array(
			'posts'    => null,
			'number'   => $attributes['number'],
			'offset'   => 0,
			'category' => $attributes['category'],
		)
	);
	?>
	data-wp-interactive="rsilp-store"
	data-wp-init="actions.getFirstPosts"
	data-wp-on-window--beforeunload="callbacks.saveState"
>
	<div data-wp-watch="callbacks.renderPosts"></div>
	<button data-wp-style--display="context.display" data-wp-on--click="actions.getPosts"><?php _e( 'Load More', 'rather-simple-infinite-latest-posts' ); ?></button>
</div>