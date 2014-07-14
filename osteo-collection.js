var extend = require('./lib/extend');
var merge  = require('./lib/merge');
var Events = require('./osteo-events');
var Model  = require('./osteo-model');

// url
// parse
// dump -> toJSON
// toJSON
// sync
// fetch
// create
//
// remove
// reset
// set
// clone

var Collection = function(models, options) {
  this.length = 0;
  this.models = [];
  this._byId  = {};

  if (models) {
    this.add(models);
  }
};

Collection.extend = extend;

merge(Collection.prototype, Events, {
  model: Model,

  get: function(id) {
    return this._byId[id];
  },

  at: function(index) {
    return this.models[index];
  },

  add: function(models) {
    var vivified;

    if (!Array.isArray(models)) {
      models = [models];
    }

    models.forEach(function(attributes) {
      if (attributes instanceof this.model) {
        vivified = attributes;
      } else {
        vivified = new this.model(attributes);
      }

      vivified.collection = this;

      this.models.push(vivified);
      this._cacheLookup(vivified);
      this.trigger('add', vivified, this);
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

  _cacheLookup: function(model) {
    var idAttr = this.model.prototype.idAttribute;

    this._byId[model.get(idAttr)] = model;
  }
});

module.exports = Collection;
