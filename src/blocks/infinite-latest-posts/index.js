/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import { registerBlockType } from '@wordpress/blocks';
import { InspectorControls } from '@wordpress/block-editor';
import { G, Path, SVG, PanelBody, SelectControl, RangeControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import ServerSideRender from '@wordpress/server-side-render';
import metadata from "./block.json";

import './editor.scss';
import './style.scss';

const { name } = metadata;

/**
 * Internal dependencies
 */

const blockAttributes = {
    category: {
        type: 'integer',
        default: 0,
    },
    number: {
        type: 'integer',
        default: 5,
    },
};

export const settings = {

    edit: ( props => {
        const { attributes, className } = props;

        const categories = useSelect(
            ( select ) => select( 'core' ).getEntityRecords( 'taxonomy', 'category', { per_page: -1 } ),
            []
        );

        const setCategory = value => {
            props.setAttributes( { category: Number( value ) } );
        };

        const setNumber = value => {
            props.setAttributes( { number: Number( value ) } );
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
                            value={ attributes.category }
                            options={ options }
                            onChange={ setCategory }
                        />
                        <RangeControl
                            label={ __( 'Number of posts to show:', 'rather-simple-infinite-latest-posts' ) }
                            value={ attributes.number }
                            onChange={ setNumber }
                            min={ 1 }
                            max={ 50 }
                        />
                    </PanelBody>    
                </InspectorControls>
                <ServerSideRender
                    block="occ/rather-simple-infinite-latest-posts"
                    attributes={ attributes }
                    className={ className }
                />
            </Fragment>
        );

    } ),

    save: () => {
		return null;
	},

};

registerBlockType( name, settings );
