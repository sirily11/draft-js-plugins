import {TextAlignLeftButton, TextAlignCenterButton, TextAlignRightButton} from "./buttons";
import {ContentBlock, DraftBlockRenderMap} from "draft-js";
import {AdditionalProps, BasePlugin, DraftBlockProps, DraftBlockRenderComponent, NotImplemented} from "../base-plugin";
import TextAlignCenterComponent from "./components/TextAlignCenterComponent";

export {
    TextAlignLeftButton,
    TextAlignRightButton,
    TextAlignCenterButton,
}

interface Data {
    text: string;
    alignment: string;
}

export interface TextAlignProps extends DraftBlockProps<Data> {

}


export class TextAlignPlugin extends BasePlugin {


    blockRendererFn = <TextAlignProps>(block?: ContentBlock, additional?: AdditionalProps): DraftBlockRenderComponent | NotImplemented | undefined => {
        if (block && additional) {
            if(block.getType() === "text-left"){

            } else if(block.getType() === "text-center"){

            } else if(block.getType() === 'text-right'){

            }
        }

        return undefined;
    }
}