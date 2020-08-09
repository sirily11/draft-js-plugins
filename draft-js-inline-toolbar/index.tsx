import React from 'react';
import createStore from './utils/createStore';
import Toolbar from './components/Toolbar';
import Separator from './components/Separator';
import {defaultTheme} from './theme.js';
import {AdditionalProps, BasePlugin, NotImplemented} from "../base-plugin";
import {EditorState} from "draft-js";


export class InlineToolbarPlugin extends BasePlugin {

    theme: any;
    store = createStore({
        isVisible: false,
    });

    constructor({theme}: { theme?: any }) {
        super();
        this.theme = theme ?? defaultTheme;

    }


    InlineToolbar = (props: any) => {

        return (

            <Toolbar {...props} store={this.store} theme={this.theme}/>
        );
    };

    initialize = (additional?: AdditionalProps): void | undefined | NotImplemented => {
        console.log("init", additional)
        if (additional) {
            const {getEditorRef, getEditorState, setEditorState} = additional
            this.store.updateItem('getEditorState', getEditorState);
            this.store.updateItem('setEditorState', setEditorState);
            this.store.updateItem('getEditorRef', getEditorRef);
        }
    };

    onChange = (e?: EditorState, additional?: AdditionalProps): EditorState | NotImplemented | undefined => {
        if(e){
            this.store.updateItem('selection', e.getSelection());
            return e;
        }
    };

}

export {Separator};
