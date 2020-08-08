import findWithRegex from 'find-with-regex';
import emojione from 'emojione';

const unicodeRegex = new RegExp(emojione.unicodeRegexp, 'g');

export default (contentBlock, callback) => {
  findWithRegex(unicodeRegex, contentBlock, callback);
};
