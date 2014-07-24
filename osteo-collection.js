var defaults  = require('./lib/defaults');
var extend    = require('./lib/extend');
var inflector = require('./lib/inflector');
var merge     = require('./lib/merge');
var Events    = require('./osteo-events');
var Model     = require('./osteo-model');

// url
// sync
// fetch
// create
//
// remove
// reset
// set

var Collection = function(models, options) {
  options = options || {};

  this.length = 0;
  this.models = [];
  this.root   = options.root;
  this._byId  = {};

  if (models) {
    this.add(models);
  }
};

Collection.extend = extend;

merge(Collection.prototype, Events, {
  model: Model,

  root: null,

  get: function(id) {
    return this._byId[id];
  },

  at: function(index) {
    return this.models[index];
  },

  parse: function(response) {
    var parsed;

    if (response && this.root && response[this.root]) {
      parsed = response[this.root];
    } else {
      parsed = response;
    }

    if (!Array.isArray(parsed)) {
      parsed = [parsed];
    }

    return parsed;
  },

  dump: function(options) {
    var object = {};

    var models = this.models.map(function(model) {
      return merge({}, model.attributes);
    });

    if (options && options.rooted) {
      object[this.root] = models;

      return object;
    } else {
      return models;
    }
  },

  toJSON: function() {
    return this.dump.apply(this, arguments);
  },

  lookup: function(id, attributes) {
    var defaulted = defaults((attributes || {}), { id: id });

    this.add(defaulted);

    return this.get(id);
  },

  add: function(models, options) {
    var vivified;

    models  = this.parse(models);
    options = this._rootedOptions(options || {});

    models.forEach(function(attributes) {
      if (attributes instanceof this.model) {
        vivified = attributes;
      } else {
        vivified = new this.model(attributes, options);
      }

      if (!this.get(vivified.id)) {
        vivified.collection = this;

        this._storeModel(vivified);
        this._cacheModel(vivified);
        this.trigger('add', vivified, this);
      }
    }, this);

    this.length = this.models.length;
    this.sort();

    return this;
  },

  sort: function(options) {
    options = options || {};

    if (this.comparitor) {
      this.models.sort(this.comparitor.bind(this));
    }

    if (this.comparitor && !options.silent) {
      this.trigger('sort', this);
    }

    return this;
  },

  _storeModel: function(model) {
    this.models.push(model);
  },

  _cacheModel: function(model) {
    var idAttr = this.model.prototype.idAttribute;

    this._byId[model.get(idAttr)] = model;
  },

  _rootedOptions: function(options) {
    if (this.root) {
      options.root = inflector.singularize(this.root);
    }

    return options;
  }
});

module.exports = Collection;
