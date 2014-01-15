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
