import decorateComponentWithProps from "decorate-component-with-props";
import addAudio from "./modifiers/addAudio";
import AudioCompoment from "./audio";
import imageStyles from "./audioStyles.css";

const defaultTheme = {
  image: imageStyles.image,
};

export default (config = {}) => {
  const theme = config.theme ? config.theme : defaultTheme;
  let Audio = AudioCompoment;
  if (config.decorator) {
    Audio = config.decorator(Audio);
  }
  const ThemedImage = decorateComponentWithProps(Audio, { theme });
  return {
    blockRendererFn: (block, { getEditorState }) => {
      if (block.getType() === "atomic") {
        const contentState = getEditorState().getCurrentContent();
        const entity = block.getEntityAt(0);
        if (!entity) return null;
        const type = contentState.getEntity(entity).getType();
        if (type === "audio") {
          return {
            component: ThemedImage,
            editable: false,
          };
        }
        return null;
      }

      return null;
    },
    addAudio: addAudio,
  };
};

export const Audio = AudioCompoment;
