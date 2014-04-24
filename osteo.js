;(function(window, undefined) {
"use strict";
window.Osteo = {
  VERSION: "0.7.0"
};

Osteo.Model = Backbone.Model.extend({
  defaultAutoSaveDelay: 500,

  relations: {},

  root: null,

  constructor: function(models, options) {
    options = options || {};

    if (options.root) this.root = options.root;
    this.autoSaveDelay = this.defaultAutoSaveDelay;

    this.attachRelations();

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
    this.resetRelations(attributes);

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

  attachRelations: function() {
    var relations = this.relations,
        collection;

    if (_.isFunction(relations)) relations = relations.call(this);

    for (var rel in relations) {
      collection = relations[rel];

      this[rel] = new collection();
    }
  },

  resetRelations: function(attributes) {
    var relations = this.relations,
        data;

    if (_.isFunction(relations)) relations = relations.call(this);

    for (var rel in relations) {
      data = attributes[rel];

      if (this[rel]) this[rel].reset(data);

      delete attributes[rel];
    }

    return attributes;
  }
});

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

Osteo.I18n = {
  pattern: /%\{(.+?)\}/g,

  translations: {},

  lookup: function(path, options) {
    var hash = options ? (options.hash || options) : {};

    var buff = _.reduce(path.split("."), function(trans, key) {
      var match = trans[key];

      if (!match) {
        throw new Error("Unknown translation: " + path + ", " + key);
      } else {
        return trans[key];
      }
    }, Osteo.I18n.translations);

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
}(window));