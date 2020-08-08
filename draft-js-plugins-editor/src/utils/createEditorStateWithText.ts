/**
 * Create an editor state with some text in it already
 */

import { ContentState, EditorState } from 'draft-js';

export default (text: string) =>
  EditorState.createWithContent(ContentState.createFromText(text));
