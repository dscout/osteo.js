Osteo.Sideload = {
  associate: function(payload, root) {
    var relKeys = this._relKeys(payload, root),
        finder  = this._findRelations,
        rootObj = payload[root],
        self    = this;

    if (!_.isArray(rootObj)) rootObj = [rootObj];

    return _.map(rootObj, function(object) {
      for (var key in relKeys) {
        object[key] = finder.call(self, payload[key], relKeys[key], object);
      }

      return object;
    });
  },

  singularize: function(word) {
    return word.replace(/s$/, "");
  },

  _relKeys: function(payload, root) {
    var keys = {};

    for (var key in payload) {
      if (key !== root) {
        keys[key] = this.singularize(key);
      }
    }

    return keys;
  },

  _findRelations: function(relations, relKey, rootObj) {
    var idKey = this._idKey(relKey, rootObj),
        ids   = rootObj[idKey];

    if (!_.isArray(ids)) ids = [ids];

    return _.map(ids, function(id) {
      return _.find(relations, function(object) {
        return object.id === id;
      });
    });
  },

  _idKey: function(relKey, object) {
    var key = relKey + "_ids";

    return object[key] ? key : relKey + "_id";
  }
};
