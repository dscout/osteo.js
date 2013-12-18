;(function(window, undefined) {
"use strict";
window.Osteo = {
  TEMPLATES:    {},
  TRANSLATIONS: {},
  VERSION:      "0.4.0"
};

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

Osteo.Collection = Backbone.Collection.extend({
  initialize: function(_models, options) {
    options = options || {};

    this.root = options.root;
  },

  parse: function(response) {
    if (this.root) {
      this.associateRelations(response, this.root);
      return response[this.root];
    } else {
      return response;
    }
  },

  toPresenters: function(presenter) {
    if (!presenter) presenter = Osteo.Presenter;

    return this.map(function(model) {
      return new presenter(model);
    });
  },

  associateRelations: function(response, root) {
    return Osteo.Sideload.associate(response, root);
  }
});

Osteo.Model = Backbone.Model.extend({
  defaultAutoSaveDelay: 500,

  relations: {},

  constructor: function(attributes) {
    this.attachRelations(attributes);

    Backbone.Model.apply(this, arguments);
  },

  initialize: function() {
    this.autoSaveDelay = this.defaultAutoSaveDelay;
  },

  autoSave: function() {
    if (!this.debouncedSave) {
      this.debouncedSave = _.debounce(this.save, this.autoSaveDelay);
    }

    this.debouncedSave();

    return true;
  },

  attachRelations: function(attributes) {
    var relations = this.relations,
        data, collection;

    if (_.isFunction(relations)) relations = relations();

    for (var rel in relations) {
      data = attributes[rel];
      collection = relations[rel];

      this[rel] = new collection(data);

      delete attributes[rel];
    }

    return attributes;
  }
});

Osteo.Presenter = function(model) {
  this.model = model;
  this.model.on("change", this.replicate, this);

  this.replicate(model);
};

Osteo.Presenter.prototype = {
  get: function(key) {
    return this.model.get(key);
  },

  replicate: function(model) {
    var changed = _.isEmpty(model.changed) ? model.attributes : model.changed;

    for (var key in changed) {
      if (!_.isFunction(this[key])) this[key] = changed[key];
    }
  }
};

Osteo.Route = function() {
};

Osteo.Route.prototype = {
  load: function() {
    return this;
  },

  unload: function() {
    return this;
  }
};

Osteo.Router = Backbone.Router.extend({
  handlers: {},

  initialize: function() {
    this.on("route", this.handle, this);
  },

  handle: function(name, params) {
    var handlers = _.isFunction(this.handlers) ? this.handlers() : this.handlers,
        handler  = handlers[name],
        route;

    if (this.lastRoute) this.lastRoute.unload();

    if (handler) {
      route = this._getRouteInstance(handler);
      route.load(params);
    }

    this.lastRoute = route;

    return route;
  },

  pathFor: function(name, context) {
    var inverted = _.invert(this.routes),
        path     = inverted[name];

    context = context ? context.attributes || context : {};

    if (!path) throw new Error("No such path name: " + name);

    return path.replace(/:(.+?)(\/|$)/g, function(match, sub, term) {
      return context[sub] + term;
    });
  },

  visit: function(name, context) {
    var path = this.pathFor(name, context);

    this.navigate(path, { trigger: true });
  },

  _getRouteInstance: function(handler) {
    var route;

    if (!handler.instance) {
      route = new handler();
      handler.instance = function() { return route; };
    }

    return handler.instance();
  }
});

Osteo.View = Backbone.View.extend({
  lazyRenderDelay: 50,

  initialize: function(options) {
    this.options = options || {};
    this.lazyRenderDelay = this.options.lazyRenderDelay || this.lazyRenderDelay;

    if (options.presenter) this.presenter = this.options.presenter;
    if (options.template)  this.template  = this.options.template;

    if (options.disableBoundRendering !== true) {
      Osteo.BoundRenderer.extend(this);
    }
  },

  isRendered: function() {
    return !!this._rendered;
  },

  beforeRender: function() {
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
    this.beforeRender.call(this);

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
    if (!this.isRendered()) this.render();

    this.$el.removeClass("hide");

    return this;
  },

  hide: function() {
    if (this.isRendered()) this.$el.addClass("hide");

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
    var resolved = Osteo.TEMPLATES[template];

    if (!resolved) throw new Error("No such template: " + template);

    return resolved;
  }
});

Osteo.I18n = {
  pattern: /%\{(.+?)\}/g,

  lookup: function(path, options) {
    var hash = options ? (options.hash || options) : {};

    var buff = _.reduce(path.split("."), function(trans, key) {
      return trans[key];
    }, Osteo.TRANSLATIONS);

    return buff.replace(Osteo.I18n.pattern, function(match, capture) {
      return hash[capture];
    });
  }
};

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

Osteo.BoundRenderer = {
  extend: function(view) {
    view.boundRender   = this.boundRender;
    view.boundElements = {};

    if (view.model && view.model.on) {
      view.listenTo(view.model, "change", view.boundRender);
    }
  },

  boundRender: function(model) {
    var $element, value;

    for (var key in model.changed) {
      if (this.boundElements[key]) {
        $element = this.boundElements[key];
      } else {
        $element = this.$("[data-bind=" + key + "]");
        this.boundElements[key] = $element;
      }

      if (this.presenter) {
        value = this.presenter[key];
      } else {
        value = model.changed[key];
      }

      if ($element.length) $element.text(value);
    }
  }
};

Osteo.CollectionView = Osteo.View.extend({
  viewClass: Osteo.View,

  initialize: function(options) {
    Osteo.View.prototype.initialize.call(this, options);

    if (options.selector)  this.selector  = options.selector;
    if (options.viewClass) this.viewClass = options.viewClass;

    if (this.collection) {
      this.listenTo(this.collection, "add",     this.addView);
      this.listenTo(this.collection, "destroy", this.modelDestroyed);
      this.listenTo(this.collection, "reset",   this.reset);
      this.listenTo(this.collection, "sort",    this.sort);
    }

    this.viewCache = new Osteo.Cache();
  },

  container: function() {
    if (!this._container) {
      if (this.selector) {
        this._container = this.$(this.selector);
      } else {
        this._container = this.$el;
      }
    }

    return this._container;
  },

  addView: function(model, collection) {
    var view  = this.getView(model).show(),
        index = this.collection.indexOf(model),
        exModel, exView;

    if (index === 0) {
      this.container().prepend(view.$el);
    } else {
      exModel = collection.at(index - 1);
      exView  = this.getView(exModel);

      exView.$el.after(view.$el);
    }
  },

  getView: function(model) {
    var view = this.viewCache.get(model);

    if (!view) {
      view = new this.viewClass({ model: model });
      this.viewCache.add(view);
    }

    return view;
  },

  render: function() {
    Osteo.View.prototype.render.call(this);
    this.reset();

    return this;
  },

  renderContext: function() {
    return this.collection;
  },

  reset: function() {
    var $elements = this.collection.map(function(model) {
      return this.getView(model).show().$el;
    }, this);

    this.container().html($elements);

    return this;
  },

  sort: function() {
    var $container = this.container(),
        viewCache  = this.viewCache;

    _.each(this.viewCache.cached(), function(view) {
      view.$el.detach();
    });

    this.collection.each(function(model) {
      $container.append(viewCache.get(model).$el);
    });
  },

  modelDestroyed: function(model) {
    var view = this.getView(model);
    this.viewCache.remove(model);
    view.destroy();
  }
});

Osteo.ModalView = Osteo.View.extend({
  className:      "osteo-modal js-osteo-modal",
  rootSelector:   "body",
  screenTemplate: "<div class='osteo-screen js-osteo-screen'></div>",

  events: {
    "click .js-cancel" : "cancel",
    "click .js-return" : "cancel"
  },

  display: function(options) {
    if (!options) options = {};

    this.model      = options.model;
    this.presenter  = options.presenter;
    this.collection = options.collection;

    this.render();
    this.open();

    return this;
  },

  open: function() {
    this.appendBody();
    this.appendScreen();
  },

  cancel: function() {
    this.hide();
    this.hideScreen();

    return false;
  },

  hideScreen: function() {
    if (this.$screen) {
      this.$screen.addClass("hide");
    }
  },

  appendBody: function() {
    this.$el.appendTo(this.rootSelector).removeClass("hide");
  },

  appendScreen: function() {
    if (!this.$screen) {
      this.$screen = $(this.screenTemplate);
    }

    this.$screen
      .appendTo(this.rootSelector)
      .off("click.osteo")
      .on("click.osteo", this.cancel)
      .removeClass("hide");
  }
});
}(window));