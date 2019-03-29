var random = require('./random.js');

const DEFAULTOPTIONS = {
  newCharacters: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
}

function stringMutator() {
  this.edit = (text, options = {}) => {
    if (text.length === 0) {
        return this.add(text, options);
    }

    const editType = Math.floor(random.next() * 3);
    let newText = text;

    switch(editType) {
      case 0:
        newText = this.add(text, options);
        break;
      case 1:
        newText = this.replace(text, options);
        break;
      case 2:
        newText = this.remove(text, options);
        break;
    }

    return newText;
  };

  this.add = (text, options = {}) => {
    options = { ...DEFAULTOPTIONS, ...options };

    const newCharIndex = Math.floor(random.next() * options.newCharacters.length);
    const newChar = options.newCharacters[newCharIndex];
    const newPosIndex = Math.floor(random.next() * (text.length + 1));
    const newText = text.slice(0, newPosIndex) + newChar + text.slice(newPosIndex, text.length);

    return newText;
  };

  this.replace = (text, options = {}) => {
    // Can't replace on an empty string
    if (text.length === 0) {
      return text;
    }

    options = { ...DEFAULTOPTIONS, ...options };

    const newCharIndex = Math.floor(random.next() * options.newCharacters.length);
    const newChar = options.newCharacters[newCharIndex];
    const charIndex = Math.floor(random.next() * text.length);
    const newText = text.slice(0, charIndex) + newChar + text.slice(charIndex + 1, text.length);

    return newText;
  };

  this.remove = (text, options = {}) => {
    // Can't remove on an empty string
    if (text.length === 0) {
      return text;
    }

    options = { ...DEFAULTOPTIONS, ...options };

    const charIndex = Math.floor(random.next() * text.length);
    const newText = text.slice(0, charIndex) + text.slice(charIndex + 1, text.length);

    return newText;
  };
};

const StringMutator = new stringMutator();
module.exports = StringMutator;
