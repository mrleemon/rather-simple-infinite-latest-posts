( function( $ ) {

    var offset = sessionStorage.getItem( 'posts-offset' );
    var button = document.querySelector( '.widget_infinite_latest_posts .load-more' );
    if ( offset !== null ) {
        button.dataset.offset = offset;
    }
    var div = document.querySelector( '.widget_infinite_latest_posts .infinite-posts' );
    window.addEventListener( 'beforeunload', () => {
        // Store posts offset in sessionStorage when changing pages
        sessionStorage.setItem( 'posts-offset', button.dataset.offset );
        // Store posts markup in sessionStorage when changing pages
        sessionStorage.setItem( 'posts-html', div.innerHTML );
    });
    
	$( function() {
		
        var sidebar = document.querySelector( '.sidebar' );

        var html = sessionStorage.getItem( 'posts-html' );
        if ( html == null ) {
            // Get posts from the database if sessionStorage is empty
            $this = $( '.widget_infinite_latest_posts .load-more' );
            $.ajax( rsilp_params.ajax_url,
                {
                    method: 'POST',
                    data: {
                        action: 'my_load_recent',
                        offset: 0
                    },
                    success: function( result ) {
                        /* handling of the output returned by PHP function */
                        $( '.widget_infinite_latest_posts .infinite-posts' ).html( result );
                        //$( '.widget_infinite_latest_posts .infinite-posts' ).append( '<b>test</b>' );
                        $this.attr( 'data-offset', parseInt( $this.attr( 'data-offset' ) ) + 2 );
                        /* $this.data( 'offset', $this.data( 'offset' ) + 5 ); */
                    },
                    error: function() {
                        /* what to do if there's a server error, like 404 */
                    }
                }
            );
        } else {
            // Get posts from sessionStorage on subsequent loads
            $( '.widget_infinite_latest_posts .infinite-posts' ).html( html );
            // Get stored sidebar scroll position and move to it
            var top = sessionStorage.getItem( 'sidebar-scroll' );
            if ( top !== null ) {
                sidebar.scrollTop = parseInt( top, 10 );
            }
        }

        window.addEventListener( 'beforeunload', () => {
            // Store sidebar scroll position in sessionStorage when changing pages
            sessionStorage.setItem( 'sidebar-scroll', sidebar.scrollTop );
        });

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
                        $( '.widget_infinite_latest_posts .infinite-posts' ).append( result );
                        $this.attr( 'data-offset', parseInt( $this.attr( 'data-offset' ) ) + 2 );
                    },
                    error: function() {
                        /* what to do if there's a server error, like 404 */
                    }
                }
            );
        });

	});
	
} )( jQuery );