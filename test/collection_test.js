describe('Osteo.Collection', function() {
  describe('#model', function() {
    it('defautlts the model to Osteo.Model', function() {
      var collection = new Osteo.Collection();

      expect(collection.model).to.eql(Osteo.Model);
    });
  });

  describe('#lookup', function() {
    it('returns existing models', function() {
      var collection = new Osteo.Collection([{ id: 1, name: 'osteo' }]);

      expect(collection.lookup(1).get('name')).to.eq('osteo');
    });

    it('returns a new model instance without an existing model', function() {
      var collection = new Osteo.Collection([]);

      var found = collection.lookup(1, { name: 'osteo' });

      expect(found.id).to.eq(1);
      expect(found.get('name')).to.eq('osteo');
    });

    it('gracefully handles undefined attributes', function() {
      var collection = new Osteo.Collection([]);

      expect(collection.lookup(1).id).to.eq(1);
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

  describe('#set', function() {
    it('correctly merges models with a root', function() {
      var payload    = [{ id: 1, name: 'a' }, { id: 2, name: 'b' }],
          collection = new Osteo.Collection(payload, { root: 'posts' });

      collection.set({ posts: [
        { id: 1, name: 'z' }, { id: 3, name: 'y' }
      ]}, { remove: false });

      expect(collection.pluck('name')).to.eql(['z', 'b', 'y'])
    });
  });

  describe('#create', function() {
    var LocalModel = Osteo.Model.extend({
      save: function() { return true; }
    });

    it('passes the root through to new models', function() {
      var coll = new Osteo.Collection([], {
        model: LocalModel,
        root: 'posts'
      });

      var model = coll.create({ id: 1 });

      expect(model.root).to.eq('post')
    });
  });

  describe('#toJSON', function() {
    it('flattens model attributes', function() {
      var models = [{ id: 1 }, { id: 2 }],
          collection = new Osteo.Collection(models, { root: 'posts' });

      expect(collection.toJSON()).to.eql(models);
    });

    it('flattens models into the root namespace', function() {
      var models = [{ id: 1 }, { id: 2 }],
          collection = new Osteo.Collection(models, { root: 'posts' });

      expect(collection.toJSON({ rooted: true })).to.eql({ posts: models });
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
