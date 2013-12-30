Osteo.Model = Backbone.Model.extend({
  defaultAutoSaveDelay: 500,

  relations: {},

  root: null,

  initialize: function() {
    this.autoSaveDelay = this.defaultAutoSaveDelay;
  },

  parse: function(response) {
    if (this.root) {
      return response[this.root] || response;
    } else {
      return response;
    }
  },

  set: function(attributes) {
    this.attachRelations(attributes);

    return Backbone.Model.prototype.set.apply(this, arguments);
  },

  autoSave: function() {
    if (!this.debouncedSave) {
      this.debouncedSave = _.debounce(this.save, this.autoSaveDelay);
    }

    this.debouncedSave();

    return true;
  },

  attachRelations: function(attributes) {
    var relations = this.relations,
        data, collection;

    if (_.isFunction(relations)) relations = relations();

    for (var rel in relations) {
      data = attributes[rel];
      collection = relations[rel];

      this[rel] = new collection(data);

      delete attributes[rel];
    }

    return attributes;
  }
});
