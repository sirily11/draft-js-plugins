import React from "react";
import {CirclePicker} from 'react-color';
import DoneIcon from '@material-ui/icons/Done';
import ClearIcon from '@material-ui/icons/Clear';
import {EditorState, Modifier, RichUtils} from 'draft-js';
import {Grid, ClickAwayListener} from "@material-ui/core";
import {styleMap} from "../styleMap";
import {ExternalProps} from "../../base-plugin/interfaces";


const colors = ["#f44336", "#e91e63", "#9c27b0",
    "#673ab7", "#3f51b5", "#2196f3", "#03a9f4",
    "#00bcd4", "#009688", "#4caf50", "#8bc34a",
    "#cddc39", "#ffeb3b", "#ffc107", "#ff9800",
    "#ff5722", "#795548", "#607d8b", "#ededed"];

export default function ColorPicker(props: ExternalProps) {
    const {onOverrideContent, theme} = props;
    const [color, setColor] = React.useState<string>()

    React.useEffect(() => {
        const editorState = props.getEditorState()
        const currentStyle = editorState.getCurrentInlineStyle();
        currentStyle.forEach((k) => {
            if (k && colors.includes(k)) {
                setColor(k)
            }
        })
    }, [])

    return (
        <ClickAwayListener onClickAway={()=>{props.onOverrideContent(undefined)}}>
            <div>
                <Grid container>
                    <div style={{marginLeft: "auto", marginRight: "auto"}}>
                        <CirclePicker width={"200px"} colors={colors} color={color} onChangeComplete={(color) => {
                            setColor(color.hex)
                        }}/>
                    </div>
                </Grid>
                <Grid container>
                    <button className={theme.button} onClick={() => onOverrideContent(undefined)}><ClearIcon/></button>
                    <button className={theme.button} onClick={() => {
                        if (color) {
                            const editorState = props.getEditorState()
                            const selection = editorState.getSelection();
                            const nextContentState = Object.keys(styleMap)
                                .reduce((contentState, color) => {
                                    return Modifier.removeInlineStyle(contentState, selection, color)
                                }, editorState.getCurrentContent());
                            let nextEditorState = EditorState.push(
                                editorState,
                                nextContentState,
                                'change-inline-style'
                            );
                            const currentStyle = editorState.getCurrentInlineStyle();
                            if (selection.isCollapsed()) {
                                nextEditorState = currentStyle.reduce((state, color) => {
                                    //@ts-ignore
                                    return RichUtils.toggleInlineStyle(state, color);
                                }, nextEditorState);
                            }
                            if (color !== "#ededed") {
                                // set colorl
                                if (!currentStyle.has(color)) {
                                    nextEditorState = RichUtils.toggleInlineStyle(
                                        nextEditorState,
                                        color
                                    );
                                }
                            }
                            props.setEditorState(nextEditorState)
                        }
                        onOverrideContent(undefined)
                    }}><DoneIcon/>
                    </button>
                </Grid>
            </div>
        </ClickAwayListener>
    );
}
