import { store, getContext, getElement } from '@wordpress/interactivity';

store('rsilp-store', {
	callbacks: {
		renderPosts: function () {
			const context = getContext();
			const element = getElement();

			if (context?.posts) {
				// Create fragment.
				const fragment = document.createDocumentFragment();

				context.posts.forEach(post => {
					const article = document.createElement('article');
					article.id = `post-${post.id}`;
					article.className = 'wp-block-occ-rather-simple-infinite-latest-posts__post';

					const title = document.createElement('h2');
					title.className = 'wp-block-occ-rather-simple-infinite-latest-posts__post-title';
					title.innerHTML = post.title.rendered;

					const content = document.createElement('div');
					content.className = 'wp-block-occ-rather-simple-infinite-latest-posts__post-content';
					content.innerHTML = post.content.rendered;

					article.appendChild(title);
					article.appendChild(content);

					// Add article to the fragment.
					fragment.appendChild(article);
				});

				// Add fragment to the DOM.
				element.ref.appendChild(fragment);

				// Dispatch custom event after inserting new posts
				// for external scripts to hook into.
				var event = new Event('rsilp:insertposts');
				document.dispatchEvent(event);
			}
		},
		saveState: function () {
			const context = getContext();
			// Store posts offset in sessionStorage when changing pages.
			sessionStorage.setItem('posts-offset', context.offset);
		}
	},
	actions: {
		getFirstPosts: function* () {
			const context = getContext()
			const number = sessionStorage.getItem('posts-offset') || context.number;
			const posts = yield fetch(
				'https://' + window.location.hostname + '/wp-json/wp/v2/posts?per_page=' + encodeURIComponent(number) + '&offset=0&categories=' + encodeURIComponent(context.category) + '&_fields=id,title,content',
				{
					cache: 'force-cache',
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
		getPosts: function* () {
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
