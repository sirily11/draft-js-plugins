import * as React from "react";
import Draft, {
  ContentBlock,
  EditorState,
  DraftBlockRenderMap,
  DraftStyleMap,
  DraftInlineStyle,
  DraftEditorCommand, DraftHandleValue, SelectionState, DraftDragType
} from "draft-js";

export interface ExternalProps {
  getEditorState(): EditorState;
  onOverrideContent(value: any): void;
  setEditorState(state: EditorState): void;
  theme: any
}


export type SyntheticEvent = React.SyntheticEvent<{}>;

export type EditorCommand = DraftEditorCommand | string;

export type DraftTextAlignment = 'left' | 'center' | 'right';

export type DraftTextDirectionality = 'LTR' | 'RTL' | 'NEUTRAL';

export type SyntheticKeyboardEvent = React.KeyboardEvent<{}>;
export interface DraftEditorProps {
  editorState: EditorState;
  onChange(editorState: EditorState): void;

  placeholder?: string;

  /**
   * Specify whether text alignment should be forced in a direction
   * regardless of input characters.
   */
  textAlignment?: DraftTextAlignment;

  /**
   * Specify whether text directionality should be forced in a direction
   * regardless of input characters.
   */
  textDirectionality?: DraftTextDirectionality;

  /**
   * For a given `ContentBlock` object, return an object that specifies
   * a custom block component and/or props. If no object is returned,
   * the default `TextEditorBlock` is used.
   */
  blockRendererFn?(block: ContentBlock): any;

  /**
   * Provide a map of block rendering configurations. Each block type maps to
   * an element tag and an optional react element wrapper. This configuration
   * is used for both rendering and paste processing.
   */
  blockRenderMap?: DraftBlockRenderMap;

  /**
   * Function that allows to define class names to apply to the given block when it is rendered.
   */
  blockStyleFn?(block: ContentBlock): string;

  /**
   * Provide a map of inline style names corresponding to CSS style objects
   * that will be rendered for matching ranges.
   */
  customStyleMap?: DraftStyleMap;

  /**
   * Define a function to transform inline styles to CSS objects
   * that are applied to spans of text.
   */
  customStyleFn?: (style: DraftInlineStyle, block: ContentBlock) => React.CSSProperties;

  /**
   * A function that accepts a synthetic key event and returns
   * the matching DraftEditorCommand constant, or null if no command should
   * be invoked.
   */
  keyBindingFn?(e: SyntheticKeyboardEvent): EditorCommand | null;

  /**
   * Set whether the `DraftEditor` component should be editable. Useful for
   * temporarily disabling edit behavior or allowing `DraftEditor` rendering
   * to be used for consumption purposes.
   */
  readOnly?: boolean;

  /**
   * Note: spellcheck is always disabled for IE. If enabled in Safari, OSX
   * autocorrect is enabled as well.
   */
  spellCheck?: boolean;

  /**
   * Set whether to remove all style information from pasted content. If your
   * use case should not have any block or inline styles, it is recommended
   * that you set this to `true`.
   */
  stripPastedStyles?: boolean;

  tabIndex?: number;

  // exposed especially to help improve mobile web behaviors
  autoCapitalize?: string;
  autoComplete?: string;
  autoCorrect?: string;

  ariaActiveDescendantID?: string;
  ariaAutoComplete?: string;
  ariaControls?: string;
  ariaDescribedBy?: string;
  ariaExpanded?: boolean;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  ariaMultiline?: boolean;
  ariaOwneeID?: string;

  role?: string;

  webDriverTestID?: string;

  /**
   * If using server-side rendering, this prop is required to be set to
   * avoid client/server mismatches.
   */
  editorKey?: string;

  // Cancelable event handlers, handled from the top level down. A handler
  // that returns `handled` will be the last handler to execute for that event.

  /**
   * Useful for managing special behavior for pressing the `Return` key. E.g.
   * removing the style from an empty list item.
   */
  handleReturn?(e: SyntheticKeyboardEvent, editorState: EditorState): DraftHandleValue;

  /**
   * Map a key command string provided by your key binding function to a
   * specified behavior.
   */
  handleKeyCommand?(
    command: EditorCommand,
    editorState: EditorState,
    eventTimeStamp: number,
  ): DraftHandleValue;

  /**
   * Handle intended text insertion before the insertion occurs. This may be
   * useful in cases where the user has entered characters that you would like
   * to trigger some special behavior. E.g. immediately converting `:)` to an
   * emoji Unicode character, or replacing ASCII quote characters with smart
   * quotes.
   */
  handleBeforeInput?(chars: string, editorState: EditorState, eventTimeStamp: number): DraftHandleValue;

  handlePastedText?(text: string, html: string | undefined, editorState: EditorState): DraftHandleValue;

  handlePastedFiles?(files: Array<Blob>): DraftHandleValue;

  /** Handle dropped files */
  handleDroppedFiles?(selection: SelectionState, files: Array<Blob>): DraftHandleValue;

  /** Handle other drops to prevent default text movement/insertion behaviour */
  handleDrop?(
    selection: SelectionState,
    dataTransfer: Object,
    isInternal: DraftDragType,
  ): DraftHandleValue;

  // Non-cancelable event triggers.
  onEscape?(e: SyntheticKeyboardEvent): void;
  onTab?(e: SyntheticKeyboardEvent): void;
  onUpArrow?(e: SyntheticKeyboardEvent): void;
  onDownArrow?(e: SyntheticKeyboardEvent): void;
  onRightArrow?(e: SyntheticKeyboardEvent): void;
  onLeftArrow?(e: SyntheticKeyboardEvent): void;

  onBlur?(e: SyntheticEvent): void;
  onFocus?(e: SyntheticEvent): void;
}
