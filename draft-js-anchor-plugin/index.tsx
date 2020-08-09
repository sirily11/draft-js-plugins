import React from 'react';
// @ts-ignore
import EditorUtils from 'draft-js-plugins-utils';
import DefaultLink from './components/Link';
import LinkButton from './components/LinkButton';
import linkStrategy, {matchesEntityType} from './linkStrategy';
import {defaultTheme} from "./theme";
import {AnchorPluginConfig} from "./utils/interfaces";


export default (config: AnchorPluginConfig = {}) => {
    const {theme = defaultTheme, placeholder, Link, linkTarget} = config;

    const store = {
        getEditorState: undefined,
        setEditorState: undefined,
    };

    const DecoratedDefaultLink = (props: any) => (
        <DefaultLink {...props} style={theme} target={linkTarget}/>
    );


    const DecoratedLinkButton = (props: any) => (
        <LinkButton
            {...props}
            ownTheme={theme}
            store={store}
            placeholder={placeholder}
            onRemoveLinkAtSelection={() => {
                // @ts-ignore
                return store.setEditorState(
                    // @ts-ignore
                    EditorUtils.removeLinkAtSelection(store.getEditorState())
                );
            }
            }
        />
    );


    return {
        // @ts-ignore
        initialize: ({getEditorState, setEditorState}) => {
            store.getEditorState = getEditorState;
            store.setEditorState = setEditorState;
        },

        decorators: [
            {
                strategy: linkStrategy,
                matchesEntityType,
                component: Link || DecoratedDefaultLink,
            },
        ],

        LinkButton: DecoratedLinkButton,
    };
};
