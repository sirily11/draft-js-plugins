import {RichUtils, EditorState} from 'draft-js';
import Axios from "axios";
import {LinkProps} from "./interfaces";

export default {
    createLinkAtSelection(editorState: EditorState, url: LinkProps) {
        const contentState = editorState
            .getCurrentContent()
            .createEntity('LINK', 'MUTABLE', url);
        const entityKey = contentState.getLastCreatedEntityKey();
        const withLink = RichUtils.toggleLink(
            editorState,
            editorState.getSelection(),
            entityKey
        );
        return EditorState.forceSelection(withLink, editorState.getSelection());
    },

    removeLinkAtSelection(editorState: EditorState) {
        const selection = editorState.getSelection();
        return RichUtils.toggleLink(editorState, selection, null);
    },

    getCurrentEntityKey(editorState: EditorState) {
        const selection = editorState.getSelection();
        const anchorKey = selection.getAnchorKey();
        const contentState = editorState.getCurrentContent();
        const anchorBlock = contentState.getBlockForKey(anchorKey);
        // @ts-ignore
        const offset = selection.anchorOffset;
        // @ts-ignore
        const index = selection.isBackward ? offset - 1 : offset;
        return anchorBlock.getEntityAt(index);
    },

    getCurrentEntity(editorState: EditorState) {
        const contentState = editorState.getCurrentContent();
        const entityKey = this.getCurrentEntityKey(editorState);
        return entityKey ? contentState.getEntity(entityKey) : null;
    },

    hasEntity(editorState: EditorState, entityType: any) {
        const entity = this.getCurrentEntity(editorState);
        return entity && entity.getType() === entityType;
    },
};
