Osteo.Sideload = {
  idKeys: function(object, root) {
    var keys = {}, singular, suffix;

    for (var key in object) {
      if (key !== root) {
        singular = this.singularize(key);
        suffix   = key !== singular ? "_ids" : "_id";
        keys[key] = singular + suffix;
      }
    }

    return keys;
  },

  associate: function(payload, root) {
    var idKeys  = this.idKeys(payload, root),
        finder  = this.findRelations,
        rootObj = payload[root];

    if (!_.isArray(rootObj)) rootObj = [rootObj];

    return _.map(rootObj, function(object) {
      for (var key in idKeys) {
        object[key] = finder(payload[key], object[idKeys[key]]);
      }

      return object;
    });
  },

  findRelations: function(array, ids) {
    if (!_.isArray(array)) return array;

    return _.map(ids, function(id) {
      return _.find(array, function(object) {
        return object.id === id;
      });
    });
  },

  singularize: function(word) {
    return word.replace(/s$/, "");
  }
};
