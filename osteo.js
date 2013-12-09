(function() {
  window.Osteo = {
    TEMPLATE: {}
  };
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
      if (!this.debouncedSave) {
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

(function() {
  Osteo.View = Backbone.View.extend({
    lazyRenderDelay: 50,

    initialize: function(options) {
      this.options = options || {};
      this.lazyRenderDelay = options.lazyRenderDelay || this.lazyRenderDelay;

      if (options.presenter) this.presenter = options.presenter;
      if (options.template)  this.template  = options.template;

      if (options.disableBoundRendering !== true) {
        Osteo.BoundRenderer.extend(this);
      }
    },

    isRendered: function() {
      return !!this._rendered;
    },

    afterRender: function() {
    },

    bindEvents: function() {
      return this;
    },

    unbindEvents: function() {
      this.undelegateEvents();

      return this;
    },

    render: function() {
      this._rendered = true;

      if (this.template) {
        this.$el.html(this.renderTemplate(this.template, this.renderContext()));
      }

      this.afterRender.call(this);

      return this;
    },

    lazyRender: function() {
      if (!this.debouncedRender) {
        this.debouncedRender = _.debounce(this.render, this.lazyRenderDelay);
      }

      this.debouncedRender();

      return this;
    },

    renderTemplate: function(template, context) {
      return this._lookupTemplate(template)(context);
    },

    renderContext: function() {
      if (this.presenter) {
        return this.presenter;
      } else if (this.model) {
        return this.model.attributes;
      } else {
        return {};
      }
    },

    show: function() {
      if (!this.isRendered()) {
        this.render();
      }

      this.$el.show();

      return this;
    },

    hide: function() {
      if (this.isRendered()) {
        this.$el.hide();
      }

      return this;
    },

    destroy: function(options) {
      this.hide();
      this.unbindEvents();
      this.remove();

      if (options && options.complete) {
        this.model.destroy();
      }

      return this;
    },

    _lookupTemplate: function(template) {
      return Osteo.TEMPLATES[template];
    }
  });
})();

(function() {
  Osteo.BoundRenderer = {
    extend: function(view) {
      view.boundRender   = this.boundRender;
      view.boundElements = {};

      if (view.model && view.model.on) {
        view.listenTo(view.model, "change", view.boundRender);
      }
    },

    boundRender: function(model) {
      var $element, self = this;

      _.forOwn(model.changed, function(value, key) {
        if (self.boundElements[key]) {
          $element = self.boundElements[key];
        } else {
          $element = self.$("[data-bind=" + key + "]");
          self.boundElements[key] = $element;
        }

        if (self.presenter) {
          value = self.presenter[key];
        }

        if ($element.length) $element.text(value);
      });
    }
  };
})();
