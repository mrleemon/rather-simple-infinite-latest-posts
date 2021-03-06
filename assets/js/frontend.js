( function( $ ) {

    // Remember offset when changing pages
    let button = document.querySelector( '.widget_infinite_latest_posts .load-more' );
    let offset = sessionStorage.getItem( 'posts-offset' );
    if ( offset !== null ) {
        button.dataset.offset = offset;
    }
    window.addEventListener( 'beforeunload', () => {
        sessionStorage.setItem( 'posts-offset', button.dataset.offset );
    });
    
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
                        $this.attr( 'data-offset', parseInt( $this.attr( 'data-offset' ) ) + 5 );
                        /* $this.data( 'offset', $this.data( 'offset' ) + 5 ); */
                    },
                    error: function() {
                        /* what to do if there's a server error, like 404 */
                    }
                }
            );
        });

	});
	
} )( jQuery );