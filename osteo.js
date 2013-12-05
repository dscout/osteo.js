(function() {
  window.Osteo = {};
})();
;(function() {
  var Cache = Osteo.Cache = function() {
    this.cidCache = {};
  };

  Cache.prototype.add = function(object) {
    if (object.model !== undefined) {
      this.cidCache[object.model.cid] = object;
    }

    this.cidCache[object.cid] = object;
  };

  Cache.prototype.get = function(cid) {
    return this.cidCache[cid];
  };

  Cache.prototype.remove = function(object) {
    if (object.model !== undefined) {
      delete(this.cidCache[object.model.cid]);
    }

    delete(this.cidCache[object.cid]);
  };
})();
;(function() {
  Osteo.Model = Backbone.Model.extend({
    defaultAutoSaveDelay: 500,

    initialize: function() {
      this.autoSaveDelay = this.defaultAutoSaveDelay;
    },

    autoSave: function() {
      if (this.debouncedSave === undefined) {
        this.debouncedSave = _.debounce(this.save, this.autoSaveDelay);
      }

      this.debouncedSave();

      return true;
    }
  });
})(this);
