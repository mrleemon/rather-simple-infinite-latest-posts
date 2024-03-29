(function () {

	var button = document.querySelector('.wp-block-occ-rather-simple-infinite-latest-posts .load-more');
	var offset = sessionStorage.getItem('posts-offset');
	var total = sessionStorage.getItem('posts-total');
	if (offset !== null) {
		button.dataset.offset = offset;
	}
	if (total !== null) {
		button.dataset.total = total;
	}
	var div = document.querySelector('.wp-block-occ-rather-simple-infinite-latest-posts .infinite-posts');
	window.addEventListener('beforeunload', () => {
		// Store posts offset in sessionStorage when changing pages.
		sessionStorage.setItem('posts-offset', button.dataset.offset);
		// Store posts total in sessionStorage when changing pages.
		sessionStorage.setItem('posts-total', button.dataset.total);
		// Store posts markup in sessionStorage when changing pages.
		sessionStorage.setItem('posts-html', div.innerHTML);
	});

	document.addEventListener('DOMContentLoaded', function () {

		var elLoadMore = document.querySelector('.wp-block-occ-rather-simple-infinite-latest-posts .load-more');
		if (elLoadMore) {
			var req = new XMLHttpRequest();
			req.addEventListener('load', function () {
				var html = '';
				var result = JSON.parse(this.response);
				var posts = result.posts;
				var numposts = result.numposts;
				for (var i = 0; i < posts.length; i++) {
					var post = posts[i];
					html += '<article id="post-' + post.ID + '" class="wp-block-occ-rather-simple-infinite-latest-posts__post">';
					html += '<h2 class="wp-block-occ-rather-simple-infinite-latest-posts__post-title">' + post.post_title + '</h2>';
					html += '<div class="wp-block-occ-rather-simple-infinite-latest-posts__post-content">' + post.post_content + '</div>';
					if ( post.post_edit_link ) {
						html += '<div class="wp-block-occ-rather-simple-infinite-latest-posts__post-meta"><span class="edit-link">' + post.post_edit_link + '</span></div>';
					}
					html += '</article>';
				}
				document.querySelector('.wp-block-occ-rather-simple-infinite-latest-posts .infinite-posts').insertAdjacentHTML('beforeend', html);
				
				// Dispatch custom event after inserting new posts
				// for external scripts to hook into.
				var event = new Event('rsilp:insertposts');
    			document.dispatchEvent(event);

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

		elLoadMore = document.querySelector('.wp-block-occ-rather-simple-infinite-latest-posts .load-more');
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
						html += '<article id="post-' + post.ID + '" class="wp-block-occ-rather-simple-infinite-latest-posts__post">';
						html += '<h2 class="wp-block-occ-rather-simple-infinite-latest-posts__post-title">' + post.post_title + '</h2>';
						html += '<div class="wp-block-occ-rather-simple-infinite-latest-posts__post-content">' + post.post_content + '</div>';
						if ( post.post_edit_link ) {
							html += '<div class="wp-block-occ-rather-simple-infinite-latest-posts__post-meta"><span class="edit-link">' + post.post_edit_link + '</span></div>';
						}
						html += '</article>';
					}
					document.querySelector('.wp-block-occ-rather-simple-infinite-latest-posts .infinite-posts').insertAdjacentHTML('beforeend', html);
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
