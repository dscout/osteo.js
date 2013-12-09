(function() {
  Osteo.BoundRenderer = {
    extend: function(view) {
      view.boundRender   = this.boundRender;
      view.boundElements = {};

      if (view.model && view.model.on) {
        view.listenTo(view.model, "change", view.boundRender);
      }
    },

    boundRender: function(model) {
      var $element, self = this;

      _.forOwn(model.changed, function(value, key) {
        if (self.boundElements[key]) {
          $element = self.boundElements[key];
        } else {
          $element = self.$("[data-bind=" + key + "]");
          self.boundElements[key] = $element;
        }

        if (self.presenter) {
          value = self.presenter[key];
        }

        if ($element.length) $element.text(value);
      });
    }
  };
})();
