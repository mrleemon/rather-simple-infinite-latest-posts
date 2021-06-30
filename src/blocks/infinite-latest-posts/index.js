/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { InspectorControls } from '@wordpress/block-editor';
import { G, Path, SVG, PanelBody, Placeholder, SelectControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import ServerSideRender from '@wordpress/server-side-render';

/**
 * Internal dependencies
 */

const blockAttributes = {
    id: {
        type: 'integer',
        default: 0,
    },
};

export const name = 'occ/rather-simple-infinite-latest-posts';

export const settings = {
    title: __( 'Rather Simple Infinite Latest Posts', 'rather-simple-infinite-latest-posts' ),
    description: __( 'Display latest posts.', 'rather-simple-infinite-latest-posts' ),
    icon: <SVG viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><Path fill="none" d="M0 0h24v24H0V0z" /><G><Path d="M20 4v12H8V4h12m0-2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 9.67l1.69 2.26 2.48-3.1L19 15H9zM2 6v14c0 1.1.9 2 2 2h14v-2H4V6H2z" /></G></SVG>,
    category: 'common',
    keywords: [ __( 'posts', 'rather-simple-infinite-latest-posts' ) ],
    attributes: blockAttributes,

    edit: ( props => {
        const { attributes, className } = props;

        const categories = useSelect(
            ( select ) => select( 'core' ).getEntityRecords( 'taxonomy', 'category', { per_page: -1 } ),
            []
        );

        const setID = value => {
            props.setAttributes( { id: Number( value ) } );
        };

        if ( ! categories ) {
            return __( 'Loading...', 'rather-simple-infinite-latest-posts' );
        }

        if ( categories.length === 0 ) {
            return __( 'No categories found', 'rather-simple-infinite-latest-posts' );
        }

        var options = [];
        options.push( {
            label: __( 'Select a category...', 'rather-simple-infinite-latest-posts' ),
            value: ''
        } );

        for ( var i = 0; i < categories.length; i++ ) {
            options.push( {
                label: categories[i].name,
                value: categories[i].id
            } );
        }

        return (
            <Fragment>
                <InspectorControls>
                    <PanelBody title={ __( 'Settings', 'rather-simple-infinite-latest-posts' ) } initialOpen={ false }>
                        <SelectControl
                            label={ __( 'Select a category:', 'rather-simple-infinite-latest-posts' ) }
                            value={ attributes.id }
                            options={ options }
                            onChange={ setID }
                        />
                    </PanelBody>    
                </InspectorControls>
                <ServerSideRender
                    block={ name }
                    attributes={ attributes }
                />
            </Fragment>
        );

    } ),

    save: () => {
		return null;
	},

};

registerBlockType( name, settings );
