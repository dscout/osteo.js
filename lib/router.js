Osteo.Router = Backbone.Router.extend({
  handlers: {},

  initialize: function() {
    this.on("route", this.handle, this);
  },

  start: function(options) {
    if (!Backbone.History.started) {
      Backbone.history.start(options);
    }
  },

  handle: function(name, params) {
    var handlers = _.isFunction(this.handlers) ? this.handlers() : this.handlers,
        handler  = handlers[name],
        route;

    if (this.lastRoute) this.lastRoute.unload();

    if (handler) {
      route = handler.singleton();
      route.load(params);
    }

    this.lastRoute = route;

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

  visit: function(name, context, options) {
    var path = this.pathFor(name, context);

    options = _.defaults({}, options, { trigger: true });

    this.navigate(path, options);
  }
});
