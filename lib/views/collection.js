Osteo.CollectionView = Osteo.View.extend({
  itemView:      Osteo.View,
  itemTemplate:  null,
  emptyTemplate: null,

  initialize: function(options) {
    Osteo.View.prototype.initialize.call(this, options);

    if (options.selector)      this.selector      = options.selector;
    if (options.itemView)      this.itemView      = options.itemView;
    if (options.itemTemplate)  this.itemTemplate  = options.itemTemplate;
    if (options.emptyTemplate) this.emptyTemplate = options.emptyTemplate;

    if (this.collection) {
      this.listenTo(this.collection, "add",     this.addItemView);
      this.listenTo(this.collection, "destroy", this.remItemView);
      this.listenTo(this.collection, "remove",  this.remItemView);
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

  addItemView: function(model, collection) {
    var view  = this.getItemView(model).show(),
        index = this.collection.indexOf(model),
        count = this.collection.length,
        exModel, exView;

    if (count === 1 && this.emptyTemplate) this.container().empty();

    if (index === 0) {
      this.container().prepend(view.$el);
    } else {
      exModel = collection.at(index - 1);
      exView  = this.getItemView(exModel);

      exView.$el.after(view.$el);
    }
  },

  getItemView: function(model) {
    var view = this.viewCache.get(model);

    if (!view) {
      view = new this.itemView({
        model:    model,
        template: this.itemTemplate
      });

      this.viewCache.add(view);
    }

    return view;
  },

  remItemView: function(model) {
    var view = this.getItemView(model);

    this.viewCache.remove(model);
    this.renderEmpty();

    view.destroy();
  },

  context: function() {
    return this.collection;
  },

  reset: function() {
    if (!this.isRendered()) this.render();

    var $elements = this.collection.map(function(model) {
      return this.getItemView(model).show().$el;
    }, this);

    this.container().html($elements);
    this.renderEmpty();

    return this;
  },

  renderEmpty: function() {
    if (this.collection.isEmpty() && this.emptyTemplate) {
      var empty = this.renderTemplate(this.emptyTemplate, _.result(this, "context"));

      this.container().html(empty);
    }
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
  }
});
