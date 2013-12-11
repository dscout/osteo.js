describe('Osteo.Collection', function() {
  describe('#parse', function() {
    it('extracts data from the root key', function() {
      var collection = new Osteo.Collection([], { root: 'posts' }),
          payload    = { posts: [{ id: 1 }, { id: 2 }] };

      expect(collection.parse(payload).length).to.eq(2);
    });
  });

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
