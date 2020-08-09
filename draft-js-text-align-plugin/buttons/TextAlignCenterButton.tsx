import {createBlockStyleButton} from 'draft-js-buttons'
import FormatAlignCenterIcon from '@material-ui/icons/FormatAlignCenter';
import React from "react";

//@ts-ignore
export default createBlockStyleButton({
    blockType: "text-center",
    children: (
        <FormatAlignCenterIcon/>
    ),
});