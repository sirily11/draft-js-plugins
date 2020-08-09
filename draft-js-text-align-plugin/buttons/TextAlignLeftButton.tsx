import {createBlockStyleButton} from 'draft-js-buttons'
import FormatAlignLeftIcon from '@material-ui/icons/FormatAlignLeft';
import React from "react";

//@ts-ignore
export default createBlockStyleButton({
    blockType: 'text-left',
    children: (
        <FormatAlignLeftIcon/>
    ),
});