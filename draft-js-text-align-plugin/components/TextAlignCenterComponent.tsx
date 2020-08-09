import React from 'react';
import {TextAlignProps} from "../index";



function TextAlignComponent(props: TextAlignProps) {
    const { text, alignment }  = props.blockProps
    return (
        //@ts-ignore
        <div style={{textAlign: alignment}}>
            {text}
        </div>
    );
}

export default TextAlignComponent;