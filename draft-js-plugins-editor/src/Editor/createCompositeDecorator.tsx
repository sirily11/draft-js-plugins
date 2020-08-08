/**
 * Creates a composite decorator based on the provided plugins
 */

import React from 'react';
import { List } from 'immutable';
import Draft, {CompositeDecorator, EditorState, DraftDecorator} from 'draft-js';

type GetEditorState = () => EditorState
type SetEditorState = (editorState: EditorState) => void

export default (decorators: DraftDecorator[], getEditorState: GetEditorState, setEditorState: SetEditorState) => {
  const convertedDecorators = List(decorators)
    .map(decorator => {
      //@ts-ignore
      const Component = decorator.component;

      const DecoratedComponent = (props: any) => (
        <Component
          {...props}
          getEditorState={getEditorState}
          setEditorState={setEditorState}
        />
      );
      return {
        ...decorator,
        component: DecoratedComponent,
      };
    })
    .toJS();

  return new CompositeDecorator(convertedDecorators);
};
