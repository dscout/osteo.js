var Route = Osteo.Route = function() {
};

Route.reset = function() {
  this.instance = undefined;
};

_.extend(Route.prototype, {
  load: function() {
    return this;
  },

  unload: function() {
    return this;
  }
});

Route.extend = Backbone.Router.extend;
