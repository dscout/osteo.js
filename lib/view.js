(function() {
  Osteo.View = Backbone.View.extend({
    lazyRenderDelay: 50,

    initialize: function(options) {
      this.options = options || {};
      this.lazyRenderDelay = options.lazyRenderDelay || this.lazyRenderDelay;

      if (options.presenter) this.presenter = options.presenter;
      if (options.template)  this.template  = options.template;

      if (options.disableBoundRendering !== true) {
        Osteo.BoundRenderer.extend(this);
      }
    },

    isRendered: function() {
      return !!this._rendered;
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
      this._rendered = true;

      if (this.template) {
        this.$el.html(this.renderTemplate(this.template, this.renderContext()));
      }

      this.afterRender.call(this);

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

    renderContext: function() {
      if (this.presenter) {
        return this.presenter;
      } else if (this.model) {
        return this.model.attributes;
      } else {
        return {};
      }
    },

    show: function() {
      if (!this.isRendered()) {
        this.render();
      }

      this.$el.show();

      return this;
    },

    hide: function() {
      if (this.isRendered()) {
        this.$el.hide();
      }

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
      return Osteo.TEMPLATES[template];
    }
  });
})();
