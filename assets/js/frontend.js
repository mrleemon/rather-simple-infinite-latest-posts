( function( $ ) {

    // Remember offset when changing pages
    let button = document.querySelector( '.widget_infinite_latest_posts .load-more' );
    let offset = sessionStorage.getItem( 'posts-offset' );
    if ( offset !== null ) {
        button.dataset.offset = offset;
    }
    let div = document.querySelector( '.widget_infinite_latest_posts .infinite-posts' );
    /*
    let html = sessionStorage.getItem( 'posts-html' );
    if ( html !== null ) {
        div.insertAdjacentHTML( 'afterend', html );
    }
    */
    window.addEventListener( 'beforeunload', () => {
        sessionStorage.setItem( 'posts-offset', button.dataset.offset );
        sessionStorage.setItem( 'posts-html', div.innerHTML );
    });
    
	$( function() {
		
        let sidebar = document.querySelector( '.sidebar' );

        let html = sessionStorage.getItem( 'posts-html' );
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
            let top = sessionStorage.getItem( 'sidebar-scroll' );
            console.log('scroll-afterload:'+top);
            if ( top !== null ) {
                sidebar.scrollTop = parseInt( top, 10 );
            }
        }

        window.addEventListener( 'beforeunload', () => {
            console.log('scroll-beforeunload:'+sidebar.scrollTop);
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