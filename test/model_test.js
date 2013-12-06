describe('Osteo.Model', function() {
  describe('#autoSave', function() {
    it('stubs an autoSave method', function() {
      var model = new Osteo.Model({});
      model.autoSaveDelay = 0;
      model.save = function() {
        return true;
      };

      return expect(model.autoSave()).to.be.true;
    });
  });
});

