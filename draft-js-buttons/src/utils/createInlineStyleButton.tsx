/* eslint-disable react/no-children-prop */
import React, { Component } from "react";
import { RichUtils, EditorState } from "draft-js";
import {} from "../../../index";
import clsx from "clsx";

export interface ButtonProps {
  getEditorState(): EditorState;
  onOverrideContent(value: any): void;
  setEditorState(state: EditorState): void;
  theme: any;
}

export default ({ style, children }: { style: any; children: any[] }) =>
  class InlineStyleButton extends Component<ButtonProps> {
    toggleStyle = (event: React.MouseEvent) => {
      event.preventDefault();
      this.props.setEditorState(
        RichUtils.toggleInlineStyle(this.props.getEditorState(), style)
      );
    };

    preventBubblingUp = (event: React.MouseEvent) => {
      event.preventDefault();
    };

    // we check if this.props.getEditorstate is undefined first in case the button is rendered before the editor
    styleIsActive = () =>
      this.props.getEditorState &&
      this.props.getEditorState().getCurrentInlineStyle().has(style);

    render() {
      const { theme } = this.props;
      const className = this.styleIsActive()
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
