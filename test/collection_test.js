describe('Osteo.Collection', function() {
  describe('#model', function() {
    it('defautlts the model to Osteo.Model', function() {
      var collection = new Osteo.Collection();

      expect(collection.model).to.eql(Osteo.Model);
    });
  });

  describe('#parse', function() {
    it('extracts data from the root key', function() {
      var collection = new Osteo.Collection([], { root: 'posts' }),
          payload    = { posts: [{ id: 1 }, { id: 2 }] };

      expect(collection.parse(payload).length).to.eq(2);
    });

    it('falls back to the response without a root', function() {
      var collection = new Osteo.Collection([], { root: 'posts' }),
          payload = [{ id: 1 }, { id: 2 }];

      expect(collection.parse(payload)).to.eql(payload);
    });
  });

  describe('.root', function() {
    it('passes root options through to models', function() {
      var collection = new Osteo.Collection([], { root: 'posts' }),
          models = collection.set({ posts: [{ id: 2 }, { id: 3 }]}, { parse: true });

      expect(models[0].root).to.eq('post');
      expect(models[1].root).to.eq('post');
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
