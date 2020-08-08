import createEditorStateWithTextFn from './utils/createEditorStateWithText';
import composeDecoratorsFn from './utils/composeDecorators';

// eslint-disable-next-line import/no-named-as-default
export { PluginEditor as Editor } from './Editor';
export const createEditorStateWithText = createEditorStateWithTextFn;
export const composeDecorators = composeDecoratorsFn;
