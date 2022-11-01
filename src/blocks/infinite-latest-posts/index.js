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

export const settings = {

	icon: <SVG viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><Path fill="none" d="M0 0h24v24H0V0z" /><G><Path d="M20 4v12H8V4h12m0-2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 9.67l1.69 2.26 2.48-3.1L19 15H9zM2 6v14c0 1.1.9 2 2 2h14v-2H4V6H2z" /></G></SVG>,

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
