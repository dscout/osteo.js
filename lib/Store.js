var merge = require('./utils/merge');

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

    return bucket[id];
  },

  all: function(namespace) {
    var bucket = this._bucket(namespace);

    return Object.keys(bucket).map(function(key) {
      return bucket[key];
    });
  },

  some: function(namespace, ids) {
    var bucket = this._bucket(namespace);

    return ids.map(function(id) {
      return bucket[id];
    });
  },

  count: function(namespace) {
    var bucket = this._bucket(namespace);

    return Object.keys(bucket).length;
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
