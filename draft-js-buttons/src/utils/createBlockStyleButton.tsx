/* eslint-disable react/no-children-prop */
import React, { Component } from "react";
import { RichUtils } from "draft-js";
import clsx from "clsx";
import { ButtonProps } from "./createInlineStyleButton";

export default ({ blockType, children }: { blockType: any; children: any[] }) =>
  class BlockStyleButton extends Component<ButtonProps> {
    toggleStyle = (event: React.MouseEvent) => {
      event.preventDefault();
      this.props.setEditorState(
        RichUtils.toggleBlockType(this.props.getEditorState(), blockType)
      );
    };

    preventBubblingUp = (event: React.MouseEvent) => {
      event.preventDefault();
    };

    blockTypeIsActive = () => {
      // if the button is rendered before the editor
      if (!this.props.getEditorState) {
        return false;
      }

      const editorState = this.props.getEditorState();
      const type = editorState
        .getCurrentContent()
        .getBlockForKey(editorState.getSelection().getStartKey())
        .getType();
      return type === blockType;
    };

    render() {
      const { theme } = this.props;
      const className = this.blockTypeIsActive()
        ? clsx(theme.button, theme.active)
        : theme.button;
      return (
        <div
          className={theme.buttonWrapper}
          onMouseDown={this.preventBubblingUp}
        >
          <button
            className={className}
            onClick={this.toggleStyle}
            type="button"
            children={children}
          />
        </div>
      );
    }
  };
