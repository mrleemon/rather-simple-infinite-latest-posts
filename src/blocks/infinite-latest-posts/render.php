<?php
	$block_attributes = get_block_wrapper_attributes()
?>
<div
	<?php echo wp_kses_data( $block_attributes ); ?>
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