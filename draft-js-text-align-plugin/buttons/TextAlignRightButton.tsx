import {createBlockStyleButton} from 'draft-js-buttons'
import FormatAlignRightIcon from '@material-ui/icons/FormatAlignRight';
import React from "react";

//@ts-ignore
export default createBlockStyleButton({
    blockType: 'text-right',
    children: (
        <FormatAlignRightIcon/>
    ),
});