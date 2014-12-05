var inflector = require('./utils/inflector');
var merge     = require('./utils/merge');
var Model     = require('./Model');
var Prom      = require('es6-promise').Promise;

var Store = function(mapping) {
  this.mapping = mapping || {};
  this.buckets = {};
};

merge(Store.prototype, {
  add: function(namespace, object) {
    var bucket = this._bucket(namespace);

    bucket[object.id] = this._vivify(namespace, object);

    return this;
  },

  find: function(namespace, id, options) {
    var bucket = this._bucket(namespace);
    var object = bucket[id];

    return this._syncify(object, options);
  },

  all: function(namespace, options) {
    var bucket  = this._bucket(namespace);
    var objects = Object.keys(bucket).map(function(key) {
      return bucket[key];
    });

    return this._syncify(objects, options);
  },

  some: function(namespace, ids, options) {
    var bucket  = this._bucket(namespace);
    var objects = ids.map(function(id) {
      return bucket[id];
    });

    return this._syncify(objects, options);
  },

  where: function(namespace, props, options) {
    var bucket  = this._bucket(namespace);
    var objects = Object.keys(bucket).filter(function(key) {
      var model = bucket[key];
      var match  = true;

      for (var prop in props) {
        match = match && model.get(prop) === props[prop];
      }

      return match;
    });

    return this._syncify(objects, options);
  },

  count: function(namespace, options) {
    var bucket = this._bucket(namespace);
    var count  = Object.keys(bucket).length;

    return this._syncify(count, options);
  },

  parse: function(payload) {
    var namespace, values;

    for (var key in payload) {
      values    = payload[key];
      namespace = key;

      if (!Array.isArray(values)) {
        values    = [values];
        namespace = inflector.pluralize(key);
      }

      values.forEach(this.add.bind(this, namespace));
    }

    return this;
  },

  _bucket: function(namespace) {
    var bucket = this.buckets[namespace] || {};
    this.buckets[namespace] = bucket;

    return bucket;
  },

  _syncify: function(resolution, options) {
    if (options && options.sync) {
      return resolution;
    } else {
      return new Prom(function(resolve, reject) {
        resolve(resolution);
      });
    }
  },

  _vivify: function(namespace, object) {
    var key   = inflector.capitalize(inflector.singularize(namespace));
    var Cons  = this.mapping[key] || Model;
    var model = new Cons(object);

    return model;
  }
});

module.exports = Store;
