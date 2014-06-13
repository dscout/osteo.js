describe('Osteo.AutoSaveMixin', function() {
  it('provides a debounced save', function() {
    var Model = Osteo.Model.extend({
      mixins: [Osteo.AutoSaveMixin]
    });
    var model = new Model();

    model.save = function() {
      return true;
    };

    return expect(model.autoSave()).to.be.true;
  });
});
