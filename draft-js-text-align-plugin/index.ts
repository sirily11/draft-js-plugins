import {TextAlignLeftButton, TextAlignCenterButton, TextAlignRightButton} from "./buttons";
import {ContentBlock, DraftBlockRenderMap} from "draft-js";
import {
    AdditionalProps,
    BasePlugin,
    DraftBlockProps,
    DraftBlockRenderComponent,
    NotImplemented
} from "../draft-js-base-plugin/lib/src";
import TextAlignComponent from "./components/TextAlignComponent";

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
            let text = block.getText()
            if (block.getType() === "text-left") {
                return {
                    component: TextAlignComponent,
                    editable: true,
                    props: {
                        text: text,
                        alignment: "left"
                    }
                }

            } else if (block.getType() === "text-center") {
                return {
                    component: TextAlignComponent,
                    editable: true,
                    props: {
                        text: text,
                        alignment: "center"
                    }
                }

            } else if (block.getType() === 'text-right') {

                return {
                    component: TextAlignComponent,
                    editable: true,
                    props: {
                        text: text,
                        alignment: "right"
                    }
                }

            }
        }

        return undefined;
    }
}