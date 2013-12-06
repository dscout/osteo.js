(function() {
  window.Osteo = {};
})();

(function() {
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

(function() {
  Osteo.Collection = Backbone.Collection.extend({
    toPresenters: function(presenter) {
      if (presenter === undefined) {
        presenter = Osteo.Presenter;
      }

      return this.map(function(model) {
        return new presenter(model);
      });
    }
  });
})();

(function() {
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

(function() {
  Osteo.Presenter = function(model) {
    this.model = model;
    this.model.on("change", this.replicateChanged, this);

    this.duplicateAttributes();

  };

  Osteo.Presenter.prototype = {
    get: function(key) {
      return this.model.get(key);
    },

    duplicateAttributes: function() {
      var self = this;

      _.forOwn(this.model.attributes, function(value, key) {
        if (self[key] === undefined) {
          self[key] = value;
        }
      });
    },

    // for key of model.changed
    //   @[key] = model.get(key) unless _.isFunction(@[key])
    replicateChanged: function(model) {
      var self = this;

      _.forOwn(model.changed, function(_value, key) {
        if (!_.isFunction(self[key])) {
          self[key] = model.get(key);
        }
      });
    }
  };
})();
