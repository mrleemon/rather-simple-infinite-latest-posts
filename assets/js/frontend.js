(function () {

	var button = document.querySelector('.widget_infinite_latest_posts .load-more');
	var offset = sessionStorage.getItem('posts-offset');
	var total = sessionStorage.getItem('posts-total');
	if (offset !== null) {
		button.dataset.offset = offset;
	}
	if (total !== null) {
		button.dataset.total = total;
	}
	var div = document.querySelector('.widget_infinite_latest_posts .infinite-posts');
	window.addEventListener('beforeunload', () => {
		// Store posts offset in sessionStorage when changing pages.
		sessionStorage.setItem('posts-offset', button.dataset.offset);
		// Store posts total in sessionStorage when changing pages.
		sessionStorage.setItem('posts-total', button.dataset.total);
		// Store posts markup in sessionStorage when changing pages.
		sessionStorage.setItem('posts-html', div.innerHTML);
	});

	document.addEventListener('DOMContentLoaded', function () {

		var sidebar = document.querySelector('.sidebar');

		var elLoadMore = document.querySelector('.widget_infinite_latest_posts .load-more');
		if (elLoadMore) {
			var req = new XMLHttpRequest();
			req.addEventListener('load', function () {
				var html = '';
				var result = JSON.parse(this.response);
				var posts = result.posts;
				var numposts = result.numposts;
				for (var i = 0; i < posts.length; i++) {
					var post = posts[i];
					html += '<article id="post-' + post.ID + '" class="' + post.post_class.join(' ') + '">';
					html += '<header class="entry-header">';
					html += '<h2 class="entry-title">' + post.post_title + '</h2>';
					html += '</header>';
					html += '<div class="entry-content">' + post.post_content + '</div>';
					if ( post.post_edit_link ) {
						html += '<div class="entry-footer"><span class="edit-link">' + post.post_edit_link + '</span></div>';
					}
					html += '</article>';
				}
				document.querySelector('.widget_infinite_latest_posts .infinite-posts').insertAdjacentHTML('beforeend', html);
				// Get stored sidebar scroll position and move to it.
				var top = sessionStorage.getItem('sidebar-scroll');
				if (top !== null) {
					sidebar.scrollTop = parseInt(top, 10);
				}
				var total = parseInt(elLoadMore.getAttribute('data-total'));
				if (total <= numposts) {
					// Show button if there are more posts to load.
					elLoadMore.style.display = 'block';
				}
			});
			req.addEventListener('error', function () {
				// What to do if there's a server error, like 404.
			});

			var params = '?category=' + encodeURIComponent(elLoadMore.getAttribute('data-category')) + '&number=' + encodeURIComponent(elLoadMore.getAttribute('data-number')) + '&offset=0&total=' + encodeURIComponent(elLoadMore.getAttribute('data-total'));
			req.open('GET', rsilp_params_rest.rest_url + 'rsilp/v1/posts/' + params);
			req.setRequestHeader('X-WP-Nonce', rsilp_params_rest.rest_nonce)
			req.send();
		}

		window.addEventListener('beforeunload', () => {
			// Store sidebar scroll position in sessionStorage when changing pages.
			sessionStorage.setItem('sidebar-scroll', sidebar.scrollTop);
		});

		elLoadMore = document.querySelector('.widget_infinite_latest_posts .load-more');
		if (elLoadMore) {
			elLoadMore.addEventListener('click', function (e) {
				e.preventDefault();
				var req = new XMLHttpRequest();
				req.addEventListener('load', function () {
					var html = '';
					var result = JSON.parse(this.response);
					var posts = result.posts;
					var numposts = result.numposts;
					for (var i = 0; i < posts.length; i++) {
						var post = posts[i];
						html += '<article id="post-' + post.ID + '" class="' + post.post_class.join(' ') + '">';
						html += '<header class="entry-header">';
						html += '<h2 class="entry-title">' + post.post_title + '</h2>';
						html += '</header>';
						html += '<div class="entry-content">' + post.post_content + '</div>';
						if ( post.post_edit_link ) {
							html += '<div class="entry-footer"><span class="edit-link">' + post.post_edit_link + '</span></div>';
						}
						html += '</article>';
					}
					document.querySelector('.widget_infinite_latest_posts .infinite-posts').insertAdjacentHTML('beforeend', html);
					elLoadMore.setAttribute('data-offset', parseInt(elLoadMore.getAttribute('data-offset')) + parseInt(elLoadMore.getAttribute('data-number')));
					var total = parseInt(elLoadMore.getAttribute('data-total')) + parseInt(elLoadMore.getAttribute('data-number'));
					elLoadMore.setAttribute('data-total', total);
					if (total >= numposts) {
						// Hide button if there are no more posts to load.
						elLoadMore.style.display = 'none';
					}
				});
				req.addEventListener('error', function () {
					// What to do if there's a server error, like 404.
				});

				var params = '?category=' + encodeURIComponent(elLoadMore.getAttribute('data-category')) + '&number=' + encodeURIComponent(elLoadMore.getAttribute('data-number')) + '&offset=' + encodeURIComponent(elLoadMore.getAttribute('data-offset')) + '&total=' + encodeURIComponent(elLoadMore.getAttribute('data-number'));
				req.open('GET', rsilp_params_rest.rest_url + 'rsilp/v1/posts/' + params);
				req.setRequestHeader('X-WP-Nonce', rsilp_params_rest.rest_nonce)
				req.send();
			});
		}

	});

})();

/*
(function ($) {

	var button = document.querySelector('.widget_infinite_latest_posts .load-more');
	var offset = sessionStorage.getItem('posts-offset');
	var total = sessionStorage.getItem('posts-total');
	if (offset !== null) {
		button.dataset.offset = offset;
	}
	if (total !== null) {
		button.dataset.total = total;
	}
	var div = document.querySelector('.widget_infinite_latest_posts .infinite-posts');
	window.addEventListener('beforeunload', () => {
		// Store posts offset in sessionStorage when changing pages.
		sessionStorage.setItem('posts-offset', button.dataset.offset);
		// Store posts total in sessionStorage when changing pages.
		sessionStorage.setItem('posts-total', button.dataset.total);
		// Store posts markup in sessionStorage when changing pages.
		sessionStorage.setItem('posts-html', div.innerHTML);
	});

	$(function () {

		var sidebar = document.querySelector('.sidebar');

		$this = $('.widget_infinite_latest_posts .load-more');
		$.ajax(rsilp_params_rest.rest_url + 'rsilp/v1/posts/', {
			method: 'GET',
			cache: true,
			beforeSend: function (xhr) {
				xhr.setRequestHeader('X-WP-Nonce', rsilp_params_rest.rest_nonce)
			},
			data: {
				category: $this.attr('data-category'),
				number: $this.attr('data-number'),
				offset: 0,
				total: $this.attr('data-total'),
			}
		}).done(function (result) {
			var html = '';
			var posts = result.posts;
			var numposts = result.numposts;
			for (var i = 0; i < posts.length; i++) {
				var post = posts[i];
				html += '<article id="post-' + post.ID + '" class="' + post.post_class.join(' ') + '">';
				html += '<header class="entry-header">';
				html += '<h2 class="entry-title">' + post.post_title + '</h2>';
				html += '</header>';
				html += '<div class="entry-content">' + post.post_content + '</div>';
				html += '<div class="entry-footer">' + post.post_edit_link + '</div>';
				html += '</article>';
			}
			$('.widget_infinite_latest_posts .infinite-posts').html(html);
			// Get stored sidebar scroll position and move to it
			var top = sessionStorage.getItem('sidebar-scroll');
			if (top !== null) {
				sidebar.scrollTop = parseInt(top, 10);
			}
			var total = parseInt($this.attr('data-total'));
			if (total <= numposts) {
				// Show button if there are more posts to load
				$this.show();
			}
		}).fail(function () {
			// What to do if there's a server error, like 404.
		});

		window.addEventListener('beforeunload', () => {
			// Store sidebar scroll position in sessionStorage when changing pages.
			sessionStorage.setItem('sidebar-scroll', sidebar.scrollTop);
		});

		$( '.widget_infinite_latest_posts .load-more' ).on( 'click',  function( e ) {
			e.preventDefault();
			$this = $( this );
			$.ajax( rsilp_params_rest.rest_url + 'rsilp/v1/posts/', {
				method: 'GET',
				cache: true,
				beforeSend: function ( xhr ) {
					xhr.setRequestHeader( 'X-WP-Nonce', rsilp_params_rest.rest_nonce )
				},
				data: {
					category: $this.attr( 'data-category' ),
					number: $this.attr( 'data-number' ),
					offset: $this.attr( 'data-offset' ),
					total: $this.attr( 'data-number' ),
				}
			}).done( function( result ) {                   
				var html = '';
				var posts = result.posts;
				var numposts = result.numposts;
				for ( var i = 0; i < posts.length; i++ ) {
					var post = posts[i];
					html += '<article id="post-' + post.ID + '" class="' + post.post_class.join(' ') + '">';
					html += '<header class="entry-header">';
					html += '<h2 class="entry-title">' + post.post_title + '</h2>';
					html += '</header>';
					html += '<div class="entry-content">' + post.post_content + '</div>';
					html += '<div class="entry-footer">' + post.post_edit_link + '</div>';
					html += '</article>';
				}
				$( '.widget_infinite_latest_posts .infinite-posts' ).append( html );
				$this.attr( 'data-offset', parseInt( $this.attr( 'data-offset' ) ) + parseInt( $this.attr( 'data-number' ) ) );
				var total = parseInt( $this.attr( 'data-total' ) ) + parseInt( $this.attr( 'data-number' ) );
				$this.attr( 'data-total', total );
				if ( total >= numposts ) {
					// Hide button if there are no more posts to load
					$this.hide();
				}
			}).fail( function() {
				// What to do if there's a server error, like 404
			});
		});

	});

})(jQuery);
*/
