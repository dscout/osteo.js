Osteo.Router = Backbone.Router.extend({
  handlers: function() { return {}; },

  initialize: function() {
    this.routeCache = {};

    this.on("route", this.handle, this);
  },

  handle: function(name, params) {
    var handler = this.handlers()[name],
        route;

    if (handler) {
      route = this.routeCache[name] || new handler();
      route.load(params);

      this.routeCache[name] = route;
    }

    return route;
  }
});
