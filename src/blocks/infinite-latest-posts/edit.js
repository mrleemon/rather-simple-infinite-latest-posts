/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	PanelBody,
	Spinner,
	SelectControl,
	RangeControl
} from '@wordpress/components';
import {
	InspectorControls,
	useBlockProps
} from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { decodeEntities } from '@wordpress/html-entities';

const Edit = (props) => {

	const blockProps = useBlockProps();
	const {
		attributes: { category, number },
		setAttributes,
	} = props;

	const { categories, hasCategoriesResolved } = useSelect(select => {
		const query = {
			per_page: -1
		};
		return {
			categories: select('core').getEntityRecords('taxonomy', 'category', query),
			hasCategoriesResolved: select('core').hasFinishedResolution('getEntityRecords', ['taxonomy', 'category', query]),
		}
	}, []);

	const { posts, hasPostsResolved } = useSelect(select => {
		const query = {
			order: 'desc',
			orderby: 'date',
			status: 'publish',
			categories: category ? category : [],
			per_page: number
		};
		return {
			posts: select('core').getEntityRecords('postType', 'post', query),
			hasPostsResolved: select('core').hasFinishedResolution('getEntityRecords', ['postType', 'post', query]),
		}
	}, [category, number]);

	const setCategory = value => {
		setAttributes({ category: parseInt(value) });
	};

	const setNumber = value => {
		setAttributes({ number: parseInt(value) });
	};

	if (!hasCategoriesResolved) {
		return <Spinner />;
	}

	if (categories?.length === 0) {
		return __('No categories found', 'rather-simple-infinite-latest-posts');
	}

	var options = [];
	options.push({
		label: __('Select a category...', 'rather-simple-infinite-latest-posts'),
		value: ''
	});

	for (var i = 0; i < categories.length; i++) {
		options.push({
			label: categories[i].name,
			value: categories[i].id
		});
	}

	const displayPosts = (posts) => {
		return (
			posts.map((post, index) => {
				return (
					<article id={`post-${post.id}`} className="wp-block-occ-rather-simple-infinite-latest-posts__post" key={index}>
						<h2 className="wp-block-occ-rather-simple-infinite-latest-posts__post-title">
							{
								post.title.rendered ?
									decodeEntities(post.title.rendered) :
									__('(no title)', 'rather-simple-infinite-latest-posts')
							}
						</h2>
						<div className="wp-block-occ-rather-simple-infinite-latest-posts__post-content" dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
					</article>
				)
			})
		)
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Settings', 'rather-simple-infinite-latest-posts')}>
					<SelectControl
						label={__('Select a category:', 'rather-simple-infinite-latest-posts')}
						value={category}
						options={options}
						onChange={setCategory}
					/>
					<RangeControl
						label={__('Number of posts to show:', 'rather-simple-infinite-latest-posts')}
						value={number}
						onChange={setNumber}
						min={1}
						max={20}
					/>
				</PanelBody>
			</InspectorControls>
			<div {...blockProps}>
				{!hasPostsResolved &&
					<Spinner />
				}
				{hasPostsResolved && posts?.length === 0 &&
					<p>
						{__('No posts found', 'rather-simple-infinite-latest-posts')}
					</p>
				}
				{hasPostsResolved && posts?.length > 0 &&
					<>
						{displayPosts(posts)}
						<input type="button" className="wp-element-button" value={__('Load More', 'rather-simple-infinite-latest-posts')} disabled />
					</>
				}
			</div>
		</>
	);

}

export default Edit;
