Osteo.View = Backbone.View.extend({
  lazyRenderDelay: 50,

  initialize: function(options) {
    if (!options) options = {};

    this.options         = options;
    this.lazyRenderDelay = options.lazyRenderDelay || this.lazyRenderDelay;

    if (options.context) this.context = options.context;
    if (options.boundRendering) Osteo.BoundRenderer.extend(this);
  },

  context: function() {
    if (this.model) {
      return this.model.attributes;
    } else {
      return {};
    }
  },

  isRendered: function() {
    return !!this._rendered;
  },

  beforeRender: function() {
  },

  afterRender: function() {
  },

  bindEvents: function() {
    return this;
  },

  unbindEvents: function() {
    this.undelegateEvents();

    return this;
  },

  render: function() {
    var context;

    this.beforeRender.call(this);

    this._rendered = true;

    if (this.template) {
      context = _.result(this, "context");

      this.$el.html(this.renderTemplate(this.template, context));
    }

    _.defer(_.bind(this.afterRender, this));

    return this;
  },

  lazyRender: function() {
    if (!this.debouncedRender) {
      this.debouncedRender = _.debounce(this.render, this.lazyRenderDelay);
    }

    this.debouncedRender();

    return this;
  },

  renderTemplate: function(template, context) {
    return this._lookupTemplate(template)(context);
  },

  show: function() {
    if (!this.isRendered()) this.render();

    this.$el.removeClass("hide");

    return this;
  },

  hide: function() {
    if (this.isRendered()) this.$el.addClass("hide");

    return this;
  },

  destroy: function(options) {
    this.hide();
    this.unbindEvents();
    this.remove();

    if (options && options.complete) {
      this.model.destroy();
    }

    return this;
  },

  _lookupTemplate: function(template) {
    var resolved = Osteo.TEMPLATES[template];

    if (!resolved) throw new Error("No such template: " + template);

    return resolved;
  }
});
