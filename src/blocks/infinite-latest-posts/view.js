import { store, getContext, getElement } from '@wordpress/interactivity';

store('rsilp-store', {
	callbacks: {
		renderPosts() {
			const context = getContext();
			const element = getElement();
			if (context.posts !== null) {
				var html = '';
				for (var i = 0; i < context.posts.length; i++) {
					var post = context.posts[i];
					html += '<article id="post-' + post.id + '" class="wp-block-occ-rather-simple-infinite-latest-posts__post">';
					html += '<h2 class="wp-block-occ-rather-simple-infinite-latest-posts__post-title">' + post.title.rendered + '</h2>';
					html += '<div class="wp-block-occ-rather-simple-infinite-latest-posts__post-content">' + post.content.rendered + '</div>';
					/*if ( post.post_edit_link ) {
						html += '<div class="wp-block-occ-rather-simple-infinite-latest-posts__post-meta"><span class="edit-link">' + post.post_edit_link + '</span></div>';
					}*/
					html += '</article>';
				}
				element.ref.innerHTML += html;

				// Dispatch custom event after inserting new posts
				// for external scripts to hook into.
				var event = new Event('rsilp:insertposts');
				document.dispatchEvent(event);
			}
		},
		saveState() {
			const context = getContext();
			// Store posts offset in sessionStorage when changing pages.
			sessionStorage.setItem('posts-offset', context.offset);
		}
	},
	actions: {
		*getFirstPosts() {
			const context = getContext()
			const number = sessionStorage.getItem('posts-offset') || context.number;
			const posts = yield fetch(
				'https://' + window.location.hostname + '/wp-json/wp/v2/posts?per_page=' + encodeURIComponent(number) + '&offset=0&categories=' + encodeURIComponent(context.category) + '&_fields=id,title,content',
				{
					method: 'GET',
					headers: {
						'Cache-Control': 'max-age=60, must-revalidate',
					},
				}
			).then(function (response) {
				// The X-WP-Total response header fields contains the total number of records in the collection.
				context.total = response.headers.get('X-WP-Total');
				return response.json();
			}).catch(function (error) {
				console.error(error);
			});
			context.posts = posts;
			context.offset = parseInt(number);
			context.display = (context.offset < context.total) ? 'block' : 'none';
		},
		*getPosts() {
			const context = getContext();
			const posts = yield fetch(
				'https://' + window.location.hostname + '/wp-json/wp/v2/posts?per_page=' + encodeURIComponent(context.number) + '&offset=' + encodeURIComponent(context.offset) + '&categories=' + encodeURIComponent(context.category) + '&_fields=id,title,content',
				{
					method: 'GET',
					headers: {
						'Cache-Control': 'max-age=60, must-revalidate',
					},
				}
			).then(function (response) {
				return response.json();
			}).catch(function (error) {
				console.error(error);
			});
			context.posts = posts;
			context.offset = parseInt(context.offset) + parseInt(context.number);
			context.display = (context.offset < context.total) ? 'block' : 'none';
		},
	}
});
