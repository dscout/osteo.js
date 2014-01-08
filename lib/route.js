var Route = Osteo.Route = function() {
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
