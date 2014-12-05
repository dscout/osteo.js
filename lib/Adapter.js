var merge = require('./utils/merge');
var Request = require('proquest').Request;

var Adapter = function(options) {
  options = options || {};

  this.headers = options.headers || {};
  this.host    = options.host    || '';
};

Adapter.verbMap = {
  'create' : 'POST',
  'delete' : 'DELETE',
  'read'   : 'GET',
  'update' : 'PUT'
};

merge(Adapter.prototype, {
  buildRequest: function(method, path) {
    var url     = this.host + path;
    var request = new Request(method, url);

    for (var key in this.headers) {
      request.set(key, this.headers[key]);
    }

    return request;
  },

  sync: function(verb, model) {
    var method  = Adapter.verbMap[verb];
    var path    = model.path();
    var request = this.buildRequest(method, path);

    if (verb === 'create' || verb === 'update') {
      request.send(model.dump());
    }

    return request.end();
  }
});

module.exports = Adapter;
