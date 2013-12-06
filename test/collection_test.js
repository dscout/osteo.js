describe('Osteo.Collection', function() {
  describe('#toPresenters', function() {
    it('generates an array of presenter wrapped models', function() {
      var collection = new Osteo.Collection([
        { id: 1, title: 'a' },
        { id: 2, title: 'b' }
      ]);

      presenters = collection.toPresenters();

      expect(presenters.length).to.eq(2);
    });
  });
});
