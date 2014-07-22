var inflector = {
  singularize: function(word) {
    return word.replace(/s$/, '');
  }
};

module.exports = inflector;
