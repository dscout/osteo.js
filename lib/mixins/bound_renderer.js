Osteo.BoundRenderer = {
  extend: function(view) {
    view.boundElements = {};
    view.boundRender   = this.boundRender;

    if (view.model) {
      view.listenTo(view.model, "change", function(model) {
        if (view.isRendered()) this.boundRender(model.changed);
      });
    }
  },

  boundRender: function(changed) {
    var $element, value;

    for (var key in changed) {
      if (this.boundElements[key]) {
        $element = this.boundElements[key];
      } else {
        $element = this.$("[data-bind=" + key + "]");
        this.boundElements[key] = $element;
      }

      value = this.context()[key];

      if ($element.length) $element.text(value);
    }
  }
};
