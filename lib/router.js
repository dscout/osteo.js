Osteo.Router = Backbone.Router.extend({
  handlers: {},

  initialize: function() {
    this.routeCache = {};

    this.on("route", this.handle, this);
  },

  handle: function(name, params) {
    var handlers = _.isFunction(this.handlers) ? this.handlers() : this.handlers,
        handler  = handlers[name],
        route;

    if (handler) {
      route = this.routeCache[name] || new handler();
      route.load(params);

      this.routeCache[name] = route;
    }

    return route;
  },

  pathFor: function(name, context) {
    var inverted = _.invert(this.routes),
        path     = inverted[name];

    context = context ? context.attributes || context : {};

    if (!path) throw new Error("No such path name: " + name);

    return path.replace(/:(.+?)(\/|$)/g, function(match, sub, term) {
      return context[sub] + term;
    });
  },

  visit: function(name, context) {
    var path = this.pathFor(name, context);

    this.navigate(path, { trigger: true });
  }
});
