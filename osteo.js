;(function(window, undefined) {
"use strict";
window.Osteo = {
  TEMPLATES:    {},
  TRANSLATIONS: {},
  VERSION:      "0.6.1"
};

Osteo.Model = Backbone.Model.extend({
  defaultAutoSaveDelay: 500,

  relations: {},

  root: null,

  constructor: function(models, options) {
    options = options || {};

    if (options.root) this.root = options.root;
    this.autoSaveDelay = this.defaultAutoSaveDelay;

    Backbone.Model.prototype.constructor.apply(this, arguments);
  },

  parse: function(response) {
    if (response && this.root && response[this.root]) {
      return this.associateRelations(response, this.root)[0];
    } else {
      return response;
    }
  },

  toJSON: function() {
    var attributes = _.clone(this.attributes),
        rooted     = {};

    if (this.root) {
      rooted[this.root] = attributes;
      return rooted;
    } else {
      return attributes;
    }
  },

  set: function(attributes) {
    this.attachRelations(attributes);

    return Backbone.Model.prototype.set.apply(this, arguments);
  },

  autoSave: function() {
    if (!this.debouncedSave) {
      this.debouncedSave = _.debounce(this.save, this.autoSaveDelay);
    }

    this.debouncedSave();

    return true;
  },

  associateRelations: function(response, root) {
    return Osteo.Sideload.associate(response, root);
  },

  attachRelations: function(attributes) {
    var relations = this.relations,
        data, collection;

    if (_.isFunction(relations)) relations = relations.call(this);

    for (var rel in relations) {
      data = attributes[rel];
      collection = relations[rel];

      this[rel] = new collection(data);

      delete attributes[rel];
    }

    return attributes;
  }
});

var Cache = Osteo.Cache = function() {
  this.cache = {};
};

_.extend(Cache.prototype, {
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
});

Cache.extend = Backbone.Model.extend;

Osteo.Collection = Backbone.Collection.extend({
  model: Osteo.Model,

  constructor: function(models, options) {
    options = options || {};

    if (options.root) this.root = options.root;

    Backbone.Collection.prototype.constructor.apply(this, arguments);
  },

  lookup: function(id, attributes) {
    attributes = _.defaults((attributes || {}), { id: id });

    return this.get(id) || new this.model(attributes);
  },

  parse: function(response) {
    if (response && this.root && response[this.root]) {
      this.associateRelations(response, this.root);
      return response[this.root];
    } else {
      return response;
    }
  },

  toJSON: function(options) {
    var object = {};

    var models = this.map(function(model) {
      return _.clone(model.attributes);
    });

    if (options && options.rooted) {
      object[this.root] = models;

      return object;
    } else {
      return models;
    }
  },

  toPresenters: function(presenter) {
    if (!presenter) presenter = Osteo.Presenter;

    return this.map(function(model) {
      return new presenter(model);
    });
  },

  create: function(model, options) {
    options = options ? options : {};
    options = this._rootOptions(options);

    return Backbone.Collection.prototype.create.call(this, model, options);
  },

  set: function(models, options) {
    options = _.defaults({}, options, { parse: true });
    options = this._rootOptions(options);

    return Backbone.Collection.prototype.set.call(this, models, options);
  },

  associateRelations: function(response, root) {
    return Osteo.Sideload.associate(response, root);
  },

  _rootOptions: function(options) {
    if (this.root) {
      options.root = Osteo.Sideload.singularize(this.root);
    }

    return options;
  }
});

var Presenter = Osteo.Presenter = function(model) {
  this.model = model;
  this.model.on("change", this.replicate, this);
  this.replicate(model);
};

_.extend(Presenter.prototype, {
  get: function(key) {
    return this.model.get(key);
  },

  replicate: function(model) {
    var changed = _.isEmpty(model.changed) ? model.attributes : model.changed;

    for (var key in changed) {
      if (!_.isFunction(this[key])) this[key] = changed[key];
    }

    return true;
  }
});

Presenter.extend = Backbone.Model.extend;

var Route = Osteo.Route = function() {
};

Route.reset = function() {
  this._singleton = undefined;
};

Route.singleton = function() {
  this._singleton = this._singleton || new this();

  return this._singleton;
};

_.extend(Route.prototype, {
  load: function(params) {
    var promise = new Promise(function(resolve, reject) {
      resolve(params);
    });

    return promise
      .then(_.bind(this.loadData, this))
      .then(_.bind(this.loadView, this))
      .catch(_.bind(this.loadError, this));
  },

  unload: function(params) {
    var promise = new Promise(function(resolve, reject) {
      resolve(params);
    });

    return promise
      .then(_.bind(this.unloadData, this))
      .then(_.bind(this.unloadView, this))
      .catch(_.bind(this.unloadError, this));
  },

  loadData:  function() {},
  loadView:  function() {},
  loadError: function() {},

  unloadData:  function() {},
  unloadView:  function() {},
  unloadError: function() {}
});

Route.extend = Backbone.Model.extend;

Osteo.Router = Backbone.Router.extend({
  handlers: {},

  initialize: function() {
    this.on("route", this.handle, this);
  },

  start: function(options) {
    if (!Backbone.History.started) {
      Backbone.history.start(options);
    }
  },

  handle: function(name, params) {
    var handlers = _.isFunction(this.handlers) ? this.handlers() : this.handlers,
        handler  = handlers[name],
        route;

    if (this.lastRoute) this.lastRoute.unload();

    if (handler) {
      route = handler.singleton();
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

  visit: function(name, context, options) {
    var path = this.pathFor(name, context);

    options = _.defaults({}, options, { trigger: true });

    this.navigate(path, options);
  }
});

Osteo.View = Backbone.View.extend({
  lazyRenderDelay: 50,

  initialize: function(options) {
    if (!options) options = {};

    this.options         = options;
    this.lazyRenderDelay = options.lazyRenderDelay || this.lazyRenderDelay;

    if (options.context)  this.context = options.context;
    if (options.template) this.template = options.template;
    if (options.boundRendering) Osteo.BoundRenderer.extend(this);
  },

  context: function() {
    if (this.model) {
      return this.model.attributes;
    } else {
      return {};
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

  html: function(content) {
    this.$el.html(content);
  },

  render: function(template) {
    this.beforeRender.call(this);

    this._rendered = true;

    if (this.template) {
      this.html(this.renderTemplate(this.template, _.result(this, "context")));
    }

    _.defer(_.bind(this.afterRender, this));

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
      var match = trans[key];

      if (!match) {
        throw new Error("Unknown translation: " + path + ", " + key);
      } else {
        return trans[key];
      }
    }, Osteo.TRANSLATIONS);

    return buff.replace(Osteo.I18n.pattern, function(match, capture) {
      return hash[capture];
    });
  }
};

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

Osteo.BoundRenderer = {
  extend: function(view) {
    view.boundElements = {};
    view.boundRender   = this.boundRender;

    if (view.model) {
      view.listenTo(view.model, "change", function(model) {
        if (view.isRendered()) this.boundRender(model.changed);
      });
    }
  },

  boundRender: function(changed) {
    var $element, value;

    for (var key in changed) {
      if (this.boundElements[key]) {
        $element = this.boundElements[key];
      } else {
        $element = this.$("[data-bind=" + key + "]");
        this.boundElements[key] = $element;
      }

      value = this.context()[key];

      if ($element.length) $element.text(value);
    }
  }
};

Osteo.CollectionView = Osteo.View.extend({
  itemView:      Osteo.View,
  itemTemplate:  null,
  emptyTemplate: null,

  initialize: function(options) {
    Osteo.View.prototype.initialize.call(this, options);

    if (options.selector)      this.selector      = options.selector;
    if (options.itemView)      this.itemView      = options.itemView;
    if (options.itemTemplate)  this.itemTemplate  = options.itemTemplate;
    if (options.emptyTemplate) this.emptyTemplate = options.emptyTemplate;

    if (this.collection) {
      this.listenTo(this.collection, "add",     this.addItemView);
      this.listenTo(this.collection, "destroy", this.remItemView);
      this.listenTo(this.collection, "remove",  this.remItemView);
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

  addItemView: function(model, collection) {
    var view  = this.getItemView(model).show(),
        index = this.collection.indexOf(model),
        count = this.collection.length,
        exModel, exView;

    if (count === 1 && this.emptyTemplate) this.container().empty();

    if (index === 0) {
      this.container().prepend(view.$el);
    } else {
      exModel = collection.at(index - 1);
      exView  = this.getItemView(exModel);

      exView.$el.after(view.$el);
    }
  },

  getItemView: function(model) {
    var view = this.viewCache.get(model);

    if (!view) {
      view = new this.itemView({
        model:    model,
        template: this.itemTemplate
      });

      this.viewCache.add(view);
    }

    return view;
  },

  remItemView: function(model) {
    var view = this.getItemView(model);

    this.viewCache.remove(model);
    this.renderEmpty();

    view.destroy();
  },

  context: function() {
    return this.collection;
  },

  reset: function() {
    if (!this.isRendered()) this.render();

    var $elements = this.collection.map(function(model) {
      return this.getItemView(model).show().$el;
    }, this);

    this.container().html($elements);
    this.renderEmpty();

    return this;
  },

  renderEmpty: function() {
    if (this.collection.isEmpty() && this.emptyTemplate) {
      var empty = this.renderTemplate(this.emptyTemplate, _.result(this, "context"));

      this.container().html(empty);
    }
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
  }
});

Osteo.FormView = Osteo.View.extend({
  initialize: function(options) {
    if (!options) options = {};

    Osteo.View.prototype.initialize.call(this, options);

    if (options.selector) this.selector = options.selector;
  },

  $form: function() {
    var selector = this.selector || "form";

    return this.$(selector);
  },

  serialize: function($form) {
    $form = $form || this.$form();

    var $inputs = $form.find("input, textarea");

    return _.reduce($inputs, function(params, elem) {
      var name  = elem.name,
          value = elem.value,
          outer;

      if (name.indexOf("[") > -1) {
        name.replace(/(\w+)\[(\w+)\]/, function(_match, out, inn) {
          outer = out;
          name  = inn;
        });

        if (!params[outer]) params[outer] = {};

        params[outer][name] = value;
      } else {
        params[name] = value;
      }

      return params;
    }, {});
  },
});

Osteo.ModalView = Osteo.View.extend({
  className:    "modal-view js-osteo-modal",
  rootSelector: "body",

  events: {
    "click .js-cancel" : "cancel",
  },

  display: function(options) {
    if (!options) options = {};

    this.collection = options.collection;
    this.context    = options.context;
    this.model      = options.model;

    this.render();
    this.open();

    return this;
  },

  open: function() {
    this.appendBody();
  },

  cancel: function() {
    this.hide();

    return false;
  },

  appendBody: function() {
    this.$el.appendTo(this.rootSelector).removeClass("hide");
  }
});
}(window));