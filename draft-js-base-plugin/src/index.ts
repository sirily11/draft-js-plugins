import {
    DraftEditorProps,
    EditorCommand, SyntheticEvent,
    SyntheticKeyboardEvent
} from "./interfaces";
import {
    ContentBlock,
    DraftBlockRenderMap, DraftDragType,
    DraftHandleValue,
    DraftInlineStyle,
    EditorState, SelectionState,
    DraftDecorator, ContentState,
} from "draft-js";
import React, {CSSProperties} from "react";

export type NotImplemented = "Not Implemented"

export const NotImplementedFunction: NotImplemented = "Not Implemented";


export interface AdditionalProps {
    getPlugins(): any[], // a function returning a list of all the plugins
    getProps(): DraftEditorProps[], // a function returning a list of all the props pass into the Editor
    setEditorState(editorState: EditorState): void, // a function to update the EditorState
    getEditorState(): EditorState, // a function to get the current EditorState
    getReadOnly(): boolean, // a function returning of the Editor is set to readOnly
    setReadOnly(v: boolean): void, // a function which allows to set the Editor to readOnly
    getEditorRef(): any // a function to get the editor reference
}

export interface DraftBlockProps<T> {
    block: ContentBlock;
    contentState: ContentState
    blockProps: T
}

export interface DraftBlockRenderComponent {
    component: any,
    editable: boolean,
    props: any
}

export abstract class BasePlugin {
    ariaActiveDescendantID?: string;
    ariaAutoComplete?: string;
    ariaControls?: string;
    ariaDescribedBy?: string;
    ariaExpanded?: boolean;
    ariaLabel?: string;
    ariaLabelledBy?: string;
    ariaMultiline?: boolean;
    ariaOwneeID?: string;
    autoCapitalize?: string;
    autoComplete?: string;
    autoCorrect?: string;
    /**
     * Provide a map of block rendering configurations.
     * Each block type maps to element tag and an optional react element wrapper.
     * This configuration is used for both rendering and paste processing.
     */
    blockRenderMap?: DraftBlockRenderMap;
    // editorKey?: string;
    // editorState?: EditorState;
    // placeholder?: string;
    // readOnly?: boolean;
    // role?: string;
    // spellCheck?: boolean;
    // stripPastedStyles?: boolean;
    // tabIndex?: number;
    // textAlignment?: DraftTextAlignment;
    // textDirectionality?: DraftTextDirectionality;
    // webDriverTestID?: string;

    decorators?: DraftDecorator[];

    /**
     * Optionally define a map of inline styles to apply to spans of text with the specified style.
     * ```javascript
     * 'STRIKETHROUGH': {
        textDecoration: 'line-through',
     },
     *
     * ```
     */
    customStyleMap?: { [name: string]: CSSProperties };

    /**
     * Optionally define a function to transform inline styles to CSS objects that are applied to spans of text.
     * @param style
     * @param block
     * @param additional
     */
    customStyleFn = (style: DraftInlineStyle, block: ContentBlock, additional: AdditionalProps): React.CSSProperties | NotImplemented | undefined => {
        return;
    };

    /**
     * Optionally set a function to define custom block rendering.
     * @param block Content block
     * @param additional
     */
    blockRendererFn = (block?: ContentBlock, additional?: AdditionalProps): DraftBlockRenderComponent | NotImplemented | undefined => {
        return NotImplementedFunction
    };

    /**
     * Optionally set a function to define class names to apply to the given block
     * when it is rendered.
     * @param block
     * @param additional
     */
    blockStyleFn = (block?: ContentBlock, additional?: AdditionalProps): string | NotImplemented | undefined => {
        return NotImplementedFunction;
    };

    /**
     * Handle the characters to be inserted from a beforeInput event.
     * Returning 'handled' causes the default behavior of the beforeInput event to be prevented (i.e. it is the same as calling the preventDefault method on the event).
     * Example usage: After a user has typed - at the start of a new block, you might convert that ContentBlock into an unordered-list-item.
     * At Facebook, we also use this to convert typed ASCII quotes into "smart" quotes, and to convert typed emoticons into images.
     * @param chars
     * @param editorState
     * @param eventTimeStamp
     * @param additional
     */
    handleBeforeInput = (chars?: string, editorState?: EditorState, eventTimeStamp?: number, additional?: AdditionalProps): DraftHandleValue | NotImplemented | undefined => NotImplementedFunction;

    handleDrop = (selection?: SelectionState, dataTransfer?: Object, isInternal?: DraftDragType, additional?: AdditionalProps): DraftHandleValue | NotImplemented | undefined => NotImplementedFunction;

    handleDroppedFiles = (selection?: SelectionState, files?: Array<Blob>, additional?: AdditionalProps): DraftHandleValue | NotImplemented | undefined => NotImplementedFunction;

    handleKeyCommand = (command?: EditorCommand, editorState?: EditorState, eventTimeStamp?: number, additional?: AdditionalProps): DraftHandleValue | NotImplemented | undefined => NotImplementedFunction;

    handlePastedFiles = (files?: Array<Blob>, additional?: AdditionalProps): DraftHandleValue | NotImplemented | undefined => NotImplementedFunction;

    handlePastedText = (text?: string, html?: string | undefined, editorState?: EditorState, additional?: AdditionalProps): NotImplemented | undefined => NotImplementedFunction;

    handleReturn = (e?: SyntheticKeyboardEvent, editorState?: EditorState, additional?: AdditionalProps): DraftHandleValue | NotImplemented | undefined => NotImplementedFunction;

    keyBindingFn = (e?: SyntheticKeyboardEvent, additional?: AdditionalProps): EditorCommand | null | NotImplemented | undefined => NotImplementedFunction;

    onBlur = (e?: SyntheticEvent, additional?: AdditionalProps): void | NotImplemented | undefined => NotImplementedFunction;

    onDownArrow = (e?: SyntheticKeyboardEvent, additional?: AdditionalProps): void | NotImplemented | undefined => NotImplementedFunction;

    onEscape = (e?: SyntheticKeyboardEvent, additional?: AdditionalProps): void | NotImplemented | undefined => NotImplementedFunction;

    onFocus = (e?: SyntheticEvent, additional?: AdditionalProps): void | NotImplemented | undefined => NotImplementedFunction;

    onLeftArrow = (e?: SyntheticKeyboardEvent, additional?: AdditionalProps): void | NotImplemented | undefined => NotImplementedFunction;

    onRightArrow = (e?: SyntheticKeyboardEvent, additional?: AdditionalProps): void | NotImplemented | undefined => NotImplementedFunction;

    onTab = (e?: SyntheticKeyboardEvent, additional?: AdditionalProps): void | NotImplemented | undefined => NotImplementedFunction;

    onUpArrow = (e?: SyntheticKeyboardEvent, additional?: AdditionalProps): void | NotImplemented | undefined => NotImplementedFunction;

    initialize = (additional?: AdditionalProps): void | NotImplemented | undefined => NotImplementedFunction;

    onChange = (e?: EditorState, additional?: AdditionalProps): EditorState | NotImplemented | undefined => NotImplementedFunction;

    willUnmount = (additional?: AdditionalProps): void | NotImplemented | undefined => NotImplementedFunction;

    getAccessibilityProps = (additional?: AdditionalProps): { ariaHasPopup: string, ariaExpanded: string } | NotImplemented | undefined => NotImplementedFunction;

    /**
     * Use Plugin
     */
    public createPlugin() {
        //@ts-ignore
        const functions: [{ name: string, func: any }] = [
            {
                name: "customStyleFn",
                func: this.customStyleFn,
            },

            {
                name: "blockRendererFn",
                func: this.blockRendererFn,
            },
            {
                name: "blockStyleFn",
                func: this.blockStyleFn,
            },
            {
                func: this.handleBeforeInput,
                name: "handleBeforeInput",
            },
            {
                func: this.handleDrop,
                name: "handleDrop"
            },
            {
                func: this.handleDroppedFiles,
                name: "handleDroppedFiles"
            },
            {
                func: this.handleKeyCommand,
                name: "handleKeyCommand",
            },
            {
                func: this.handlePastedFiles,
                name: "handlePastedFiles",
            },
            {
                func: this.handlePastedText,
                name: "handlePastedText",
            },
            {
                func: this.handleReturn,
                name: "handleReturn",
            },
            {
                func: this.keyBindingFn,
                name: "keyBindingFn"
            },
            {
                func: this.onBlur,
                name: "onBlur"
            }, {
                func: this.onDownArrow,
                name: "onDownArrow"
            }, {
                func: this.onEscape,
                name: "onEscape"
            }, {
                func: this.onFocus,
                name: "onFocus",
            }, {
                func: this.onLeftArrow,
                name: "onFocus",
            }, {
                func: this.onRightArrow,
                name: "onRightArrow",
            }, {
                func: this.onTab,
                name: "onTab"
            }, {
                func: this.onUpArrow,
                name: "onUpArrow"
            }, {
                func: this.initialize,
                name: "initialize",
            },
            {
                func: this.onChange,
                name: "onChange"
            },
            {
                func: this.willUnmount,
                name: "willUnmount",
            },
            {
                func: this.decorators,
                name: "decorators"
            }, {
                func: this.getAccessibilityProps,
                name: "getAccessibilityProps"
            }
        ]

        //@ts-ignore
        let properties: [{ name: string, value: any }] = [
            {
                name: "decorators",
                value: this.decorators,
            },
            {
                name: "customStyleMap",
                value: this.customStyleMap,
            }, {
                value: this.blockRenderMap,
                name: "blockRenderMap"
            }, {
                value: this.ariaActiveDescendantID,
                name: "ariaActiveDescendantID"
            }, {
                value: this.ariaAutoComplete,
                name: "ariaAutoComplete",
            }, {
                value: this.ariaControls,
                name: "ariaControls"
            }, {
                value: this.ariaDescribedBy,
                name: "ariaDescribedBy",
            }, {
                value: this.ariaExpanded,
                name: "ariaExpanded",
            }, {
                value: this.ariaLabel,
                name: "ariaLabel"
            }, {
                value: this.ariaLabelledBy,
                name: "ariaLabelledBy"
            }, {
                value: this.ariaMultiline,
                name: "ariaMultiline"
            }, {
                value: this.ariaOwneeID,
                name: "ariaOwneeID",
            }, {
                value: this.autoCapitalize,
                name: "autoCapitalize"
            }, {
                value: this.autoComplete,
                name: "autoComplete"
            }, {
                value: this.autoCorrect,
                name: "autoCorrect"
            }
        ]


        let pluginConfiguration: { [name: string]: any } = {}
        for (let f of functions) {
            const {name, func} = f
            if (func instanceof Function) {
                let result = func()
                if (result !== NotImplementedFunction) {
                    pluginConfiguration[name] = func
                }
            }

        }

        for (let p of properties) {
            const {name, value} = p
            if (value) {
                pluginConfiguration[name] = value
            }
        }

        return pluginConfiguration;
    }
}