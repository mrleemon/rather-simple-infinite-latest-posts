( function( $ ) {

    var button = document.querySelector( '.widget_infinite_latest_posts .load-more' );
    var offset = sessionStorage.getItem( 'posts-offset' );
    var total = sessionStorage.getItem( 'posts-total' );
    if ( offset !== null ) {
        button.dataset.offset = offset;
    }
    if ( total !== null ) {
        button.dataset.total = total;
    }
    var div = document.querySelector( '.widget_infinite_latest_posts .infinite-posts' );
    window.addEventListener( 'beforeunload', () => {
        // Store posts offset in sessionStorage when changing pages
        sessionStorage.setItem( 'posts-offset', button.dataset.offset );
        // Store posts total in sessionStorage when changing pages
        sessionStorage.setItem( 'posts-total', button.dataset.total );
        // Store posts markup in sessionStorage when changing pages
        sessionStorage.setItem( 'posts-html', div.innerHTML );
    });
    
	$( function() {
		
        var sidebar = document.querySelector( '.sidebar' );

        //var html = sessionStorage.getItem( 'posts-html' );
        //if ( html == null ) {
            // Get posts from the database if sessionStorage is empty
            $this = $( '.widget_infinite_latest_posts .load-more' );
            $.ajax( rsilp_params.ajax_url,
                {
                    method: 'GET',
                    cache: true,
                    data: {
                        action: 'load_posts',
                        number: $this.attr( 'data-number' ),
                        offset: 0,
                        total: $this.attr( 'data-total' ),
                    },
                    success: function( result ) {
                        $( '.widget_infinite_latest_posts .infinite-posts' ).html( result );
                        //$this.attr( 'data-offset', parseInt( $this.attr( 'data-offset' ) ) );
                        // Get stored sidebar scroll position and move to it
                        var top = sessionStorage.getItem( 'sidebar-scroll' );
                        if ( top !== null ) {
                            sidebar.scrollTop = parseInt( top, 10 );
                        }
                        $this.show();
                    },
                    error: function() {
                        /* what to do if there's a server error, like 404 */
                    }
                }
            );
        /*} else {
            // Get posts from sessionStorage on subsequent loads
            $( '.widget_infinite_latest_posts .infinite-posts' ).html( html );
            // Get stored sidebar scroll position and move to it
            var top = sessionStorage.getItem( 'sidebar-scroll' );
            if ( top !== null ) {
                sidebar.scrollTop = parseInt( top, 10 );
            }
        }*/

        window.addEventListener( 'beforeunload', () => {
            // Store sidebar scroll position in sessionStorage when changing pages
            sessionStorage.setItem( 'sidebar-scroll', sidebar.scrollTop );
        });

        $( '.widget_infinite_latest_posts .load-more' ).on( 'click',  function( e ) {
            e.preventDefault();
            $this = $( this );
            $.ajax( rsilp_params.ajax_url,
                {
                    method: 'GET',
                    cache: true,
                    data: {
                        action: 'load_posts',
                        number: $this.attr( 'data-number' ),
                        offset: $this.attr( 'data-offset' ),
                        total: $this.attr( 'data-number' ),
                    },
                    success: function( result ) {
                        $( '.widget_infinite_latest_posts .infinite-posts' ).append( result );
                        $this.attr( 'data-offset', parseInt( $this.attr( 'data-offset' ) ) + parseInt( $this.attr( 'data-number' ) ) );
                        $this.attr( 'data-total', parseInt( $this.attr( 'data-total' ) ) + parseInt( $this.attr( 'data-number' ) ) );
                    },
                    error: function() {
                        /* what to do if there's a server error, like 404 */
                    }
                }
            );
        });

	});
	
} )( jQuery );