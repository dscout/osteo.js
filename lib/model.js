Osteo.Model = Backbone.Model.extend({
  defaultAutoSaveDelay: 500,

  relations: {},

  root: null,

  constructor: function(models, options) {
    options = options || {};

    if (options.root) this.root = options.root;
    this.autoSaveDelay = this.defaultAutoSaveDelay;

    this.attachRelations();

    Backbone.Model.prototype.constructor.apply(this, arguments);
  },

  parse: function(response) {
    if (response && this.root && response[this.root]) {
      return this.associateRelations(response, this.root)[0];
    } else {
      return response;
    }
  },

  toJSON: function() {
    var attributes = _.clone(this.attributes),
        rooted     = {};

    if (this.root) {
      rooted[this.root] = attributes;
      return rooted;
    } else {
      return attributes;
    }
  },

  set: function(attributes) {
    this.resetRelations(attributes);

    return Backbone.Model.prototype.set.apply(this, arguments);
  },

  autoSave: function() {
    if (!this.debouncedSave) {
      this.debouncedSave = _.debounce(this.save, this.autoSaveDelay);
    }

    this.debouncedSave();

    return true;
  },

  associateRelations: function(response, root) {
    return Osteo.Sideload.associate(response, root);
  },

  attachRelations: function() {
    var relations = this.relations,
        collection;

    if (_.isFunction(relations)) relations = relations.call(this);

    for (var rel in relations) {
      collection = relations[rel];

      this[rel] = new collection();
    }
  },

  resetRelations: function(attributes) {
    var relations = this.relations,
        data;

    if (_.isFunction(relations)) relations = relations.call(this);

    for (var rel in relations) {
      data = attributes[rel];

      if (this[rel] && data) {
        this[rel].reset(data);

        delete attributes[rel];
      }
    }

    return attributes;
  }
});
