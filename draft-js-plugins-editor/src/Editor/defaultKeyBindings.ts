import {getDefaultKeyBinding} from 'draft-js';
import React from "react";
import {SyntheticKeyboardEvent} from "../interfaces";

export default {
  keyBindingFn: (event: string | React.KeyboardEvent<{}>) => getDefaultKeyBinding(<SyntheticKeyboardEvent>event),
};
