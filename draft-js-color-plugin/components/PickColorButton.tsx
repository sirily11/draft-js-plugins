import React from "react";
import PaletteIcon from '@material-ui/icons/Palette';
import ColorPicker from "./ColorPicker";
import {ContentBlock} from "draft-js";
import {styleMap} from "../src/styleMap";
import {ExternalProps} from "../../draft-js-base-plugin/src/interfaces";



export function PickColorButton(props: ExternalProps) {
    const {theme, onOverrideContent} = props;
    return (
        <div className={theme.buttonWrapper} onMouseDown={(e) => {
            e.preventDefault()
        }}>
            <button className={theme.button} onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const content = (props: ExternalProps) =>
                    <ColorPicker {...props}/>
                onOverrideContent(content)
            }}>
                <PaletteIcon/>
            </button>
        </div>

    );
}