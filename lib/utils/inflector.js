module.exports = {
  singularize: function(word) {
    return word.replace(/s$/, '');
  },

  pluralize: function(word) {
    return word + 's';
  }
};
