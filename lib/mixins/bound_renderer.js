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
      var $element, value;

      for (var key in model.changed) {
        if (this.boundElements[key]) {
          $element = this.boundElements[key];
        } else {
          $element = this.$("[data-bind=" + key + "]");
          this.boundElements[key] = $element;
        }

        if (this.presenter) {
          value = this.presenter[key];
        } else {
          value = model.changed[key];
        }

        if ($element.length) $element.text(value);
      }
    }
  };
})();
