import {styleMap} from "./styleMap";
import {BasePlugin} from "../draft-js-base-plugin/lib/src";

export {PickColorButton} from "./components/PickColorButton"

export class ColorPickerPlugin extends BasePlugin{
    customStyleMap = styleMap;
}
