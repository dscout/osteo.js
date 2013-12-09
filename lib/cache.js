(function() {
  Osteo.Cache = function() {
    this.cache = {};
  };

  Osteo.Cache.prototype = {
    add: function(object) {
      if (object.model) {
        this.cache[object.model.cid] = object;
      }

      this.cache[object.cid] = object;
    },

    get: function(objOrCid) {
      if (objOrCid.cid) {
        return this.cache[objOrCid.cid];
      } else {
        return this.cache[objOrCid];
      }
    },

    remove: function(object) {
      if (object.model !== undefined) {
        delete(this.cache[object.model.cid]);
      }

      delete(this.cache[object.cid]);
    },

    cached: function() {
      return _.uniq(_.values(this.cache));
    }
  };
})();
