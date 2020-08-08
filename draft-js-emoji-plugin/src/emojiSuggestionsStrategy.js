/* @flow */

import findWithRegex from 'find-with-regex';

const EMOJI_REGEX = /(\s|^):[\w]*/g;

export default (contentBlock, callback) => {
  findWithRegex(EMOJI_REGEX, contentBlock, callback);
};
