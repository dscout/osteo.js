var inflector = require('./utils/inflector');

var Relation = {
  hasOne: function(relation) {
    return function() {
      var id     = this.get(relation + '_id');
      var plural = inflector.pluralize(relation);

      return this.store.find(plural, id);
    };
  },

  hasMany: function(relation) {
    return function() {
      var ids    = this.get(relation + '_ids');
      var plural = inflector.pluralize(relation);

      return this.store.some(plural, ids);
    };
  }
};

module.exports = Relation;
