import {styleMap} from "./styleMap";
import {BasePlugin} from "../base-plugin";

export {PickColorButton} from "./components/PickColorButton"

export class ColorPickerPlugin extends BasePlugin{
    customStyleMap = styleMap;
}
