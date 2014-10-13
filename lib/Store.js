var merge   = require('./utils/merge');
var Promise = require('es6-promise').Promise;

var Store = function() {
  this.buckets = {};
};

merge(Store.prototype, {
  add: function(namespace, object) {
    var bucket = this._bucket(namespace);

    bucket[object.id] = object;

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
        var object = bucket[key];
        var match  = true;

        for (var key in props) {
          match = match && object[key] === props[key];
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

    for (var namespace in payload) {
      bucket = this._bucket(namespace);

      payload[namespace].forEach(function(object) {
        bucket[object.id] = object;
      })
    }

    return this;
  },

  _bucket: function(namespace) {
    var bucket = this.buckets[namespace] || {};
    this.buckets[namespace] = bucket;

    return bucket;
  }
});

module.exports = Store;
