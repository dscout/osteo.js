var extend = require('./lib/extend');
var merge  = require('./lib/merge');
var Events = require('./osteo-events');
var Model  = require('./osteo-model');

// toJSON
// sync
// add
// remove
// reset
// set
// get
// at
// length
// comparator
// sort
// url
// parse
// clone
// fetch
// create

var Collection = function(models, options) {
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

    return this;
  },

  _cacheLookup: function(model) {
    var idAttr = this.model.prototype.idAttribute;

    this._byId[model.get(idAttr)] = model;
  }
});

module.exports = Collection;
