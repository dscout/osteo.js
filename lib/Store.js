var merge   = require('./utils/merge');
var Model   = require('./model');
var Promise = require('es6-promise').Promise;

var Store = function() {
  this.buckets = {};
};

merge(Store.prototype, {
  add: function(namespace, object) {
    var bucket = this._bucket(namespace);

    bucket[object.id] = this._vivify(object);

    return this;
  },

  find: function(namespace, id) {
    var bucket = this._bucket(namespace);

    return new Promise(function(resolve, reject) {
      resolve(bucket[id]);
    });
  },

  all: function(namespace) {
    var bucket = this._bucket(namespace);

    return new Promise(function(resolve, reject) {
      var objects = Object.keys(bucket).map(function(key) {
        return bucket[key];
      });

      resolve(objects);
    });
  },

  some: function(namespace, ids) {
    var bucket = this._bucket(namespace);

    return new Promise(function(resolve, reject) {
      resolve(ids.map(function(id) {
        return bucket[id];
      }));
    });
  },

  where: function(namespace, props) {
    var bucket = this._bucket(namespace);

    return new Promise(function(resolve, reject) {
      resolve(Object.keys(bucket).filter(function(key) {
        var model = bucket[key];
        var match  = true;

        for (var prop in props) {
          match = match && model.get(prop) === props[prop];
        }

        return match;
      }));
    });
  },

  count: function(namespace) {
    var bucket = this._bucket(namespace);

    return new Promise(function(resolve, reject) {
      resolve(Object.keys(bucket).length);
    });
  },

  parse: function(payload) {
    var bucket, objects;

    var assignObject = function(bucket, object) {
      bucket[object.id] = object;
    };

    for (var namespace in payload) {
      bucket = this._bucket(namespace);

      payload[namespace].forEach(assignObject.bind(null, bucket));
    }

    return this;
  },

  _bucket: function(namespace) {
    var bucket = this.buckets[namespace] || {};
    this.buckets[namespace] = bucket;

    return bucket;
  },

  _vivify: function(object) {
    var model = new Model(object);

    return model;
  }
});

module.exports = Store;
