import {DraftHandleValue, EditorState, RichUtils} from 'draft-js';
import {EditorCommand} from "../interfaces";


export default {
  // handle delete commands
  handleKeyCommand: (
    command: EditorCommand,
    editorState: EditorState,
    eventTimeStamp: number,
    {
      // @ts-ignore
      setEditorState
    }
  ) => {
    let newState;
    switch (command) {
      case 'backspace':
      case 'backspace-word':
      case 'backspace-to-start-of-line':
        newState = RichUtils.onBackspace(editorState);
        break;
      case 'delete':
      case 'delete-word':
      case 'delete-to-end-of-block':
        newState = RichUtils.onDelete(editorState);
        break;
      default:
        return 'not-handled';
    }

    if (newState != null) {
      setEditorState(newState);
      return 'handled';
    }

    return 'not-handled';
  },
};
