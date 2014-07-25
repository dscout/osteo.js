var merge  = require('./lib/merge');
var Events = require('./osteo-events');

var Request = function(method, url) {
  this.method = method;
  this.url    = url;
  this.data   = {};
  this.header = {};

  this.on('end', function() {
    // var res = new Response(this);
    // if ('HEAD' === method) res.text = null;
    // this.callback(null, res);
  }.bind(this));
};

merge(Request.prototype, Events, {
  set: function(field, value) {
    this.header[field] = value;

    return this;
  },

  send: function(data) {
    merge(this.data, data);

    return this;
  },

  end: function() {
    var xhr = this.xhr = new XMLHttpRequest();

    xhr.onload    = function() {}; // resolve promise
    xhr.onerror   = function() {}; // reject promise
    xhr.ontimeout = function() {}; // reject promise

    if (this.isXDomainRequest()) {
      xhr.withCredentials = true;
    }

    xhr.open(this.method, this.url, true);

    for (var field in this.header) {
      xhr.setRequestHeader(field, this.header[field]);
    }

    xhr.send(this.serialized());

    // TODO: Wrap this in a promise
    return this;
  },

  isXDomainRequest: function(hostname) {
    hostname = hostname || window.location.hostname;
    var hostnameMatch = this.url.match(/http[s]?:\/\/([^\/]*)/);

    return (hostnameMatch && hostnameMatch[1] !== hostname);
  },

  serialized: function() {
    if (this.method !== 'GET' && this.method !== 'HEAD') {
      return JSON.stringify(this.data);
    } else {
      return this.data;
    }
  }
});

module.exports = Request;
