(function() {
  Osteo.Sideload = {
    idKeys: function(object, root) {
      var keys = {};

      for (var key in object) {
        if (key !== root) {
          keys[key] = this.singularize(key) + "_ids";
        }
      }

      return keys;
    },

    associate: function(payload, root) {
      var idKeys = this.idKeys(payload, root),
          finder = this.findRelations;

      return _.map(payload[root], function(object) {
        for (var key in idKeys) {
          object[key] = finder(payload[key], object[idKeys[key]]);
        }

        return object;
      });
    },

    findRelations: function(array, ids) {
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
})();
