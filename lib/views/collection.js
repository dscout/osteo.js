Osteo.CollectionView = Osteo.View.extend({
  viewClass: Osteo.View,

  initialize: function(options) {
    Osteo.View.prototype.initialize.call(this, options);

    if (options.selector)  this.selector  = options.selector;
    if (options.viewClass) this.viewClass = options.viewClass;

    if (this.collection) {
      this.listenTo(this.collection, "add",     this.addView);
      this.listenTo(this.collection, "destroy", this.modelDestroyed);
      this.listenTo(this.collection, "reset",   this.reset);
      this.listenTo(this.collection, "sort",    this.sort);
    }

    this.viewCache = new Osteo.Cache();
  },

  container: function() {
    if (!this._container) {
      if (this.selector) {
        this._container = this.$(this.selector);
      } else {
        this._container = this.$el;
      }
    }

    return this._container;
  },

  addView: function(model, collection) {
    var view  = this.getView(model).show(),
        index = this.collection.indexOf(model),
        exModel, exView;

    if (index === 0) {
      this.container().prepend(view.$el);
    } else {
      exModel = collection.at(index - 1);
      exView  = this.getView(exModel);

      exView.$el.after(view.$el);
    }
  },

  getView: function(model) {
    var view = this.viewCache.get(model);

    if (!view) {
      view = new this.viewClass({ model: model });
      this.viewCache.add(view);
    }

    return view;
  },

  renderContext: function() {
    return this.collection;
  },

  reset: function() {
    if (!this.isRendered()) this.render();

    var $elements = this.collection.map(function(model) {
      return this.getView(model).show().$el;
    }, this);

    this.container().html($elements);

    return this;
  },

  sort: function() {
    var $container = this.container(),
        viewCache  = this.viewCache;

    _.each(this.viewCache.cached(), function(view) {
      view.$el.detach();
    });

    this.collection.each(function(model) {
      $container.append(viewCache.get(model).$el);
    });
  },

  modelDestroyed: function(model) {
    var view = this.getView(model);
    this.viewCache.remove(model);
    view.destroy();
  }
});
