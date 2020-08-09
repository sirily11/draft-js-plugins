/* eslint-disable react/no-children-prop */
import React, { Component } from "react";
import clsx from "clsx";
import { ButtonProps } from "./createInlineStyleButton";

export default ({ alignment, children }: { alignment: any; children: any[] }) =>
  class BlockAlignmentButton extends Component<ButtonProps> {
    activate = (event: React.MouseEvent) => {
      event.preventDefault();
      //@ts-ignore
      this.props.setAlignment({ alignment });
    };

    preventBubblingUp = (event: { preventDefault: () => void }) => {
      event.preventDefault();
    };

    //@ts-ignore
    isActive = () => this.props.alignment === alignment;

    render() {
      const { theme } = this.props;
      const className = this.isActive()
        ? clsx(theme.button, theme.active)
        : theme.button;
      return (
        <div
          className={theme.buttonWrapper}
          onMouseDown={this.preventBubblingUp}
        >
          <button
            className={className}
            onClick={this.activate}
            type="button"
            children={children}
          />
        </div>
      );
    }
  };
