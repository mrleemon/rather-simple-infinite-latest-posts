( function( $ ) {

	$( function() {
		
        $( '.widget_infinite_latest_posts .load-more' ).on( 'click',  function( e ) {
            e.preventDefault();
            $this = $( this );
            $.ajax( rsilp_params.ajax_url,
                {
                    method: 'POST',
                    data: {
                        action: 'my_load_recent',
                        offset: $this.data( 'offset' )
                    },
                    success: function( result ) {
                        /* handling of the output returned by PHP function */
                        link = $( '.widget_infinite_latest_posts .infinite-posts' ).append( result );
                        $this.data( 'offset', $this.data( 'offset' ) + 5 );
                    },
                    error: function() {
                        /* what to do if there's a server error, like 404 */
                    }
                }
            );
        });

	});
	
} )( jQuery );