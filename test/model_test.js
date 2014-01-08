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

  describe('#parse', function() {
    it('attempts to extract attributes from a root object', function() {
      var model = new Osteo.Model();

      model.root = 'post';

      expect(model.parse({ post: { id: 1 } })).to.eql({ id: 1 });
      expect(model.parse({ id: 1 })).to.eql({ id: 1 });
    });

    it('does not extract from an empty response', function() {
      var model = new Osteo.Model();

      model.root = 'post';

      expect(model.parse(undefined)).to.be.undefined;
    });
  });

  describe('#toJSON', function() {
    it('wraps the attributes in the root', function() {
      var model = new Osteo.Model({ id: 1 });

      model.root = 'post';

      expect(model.toJSON()).to.eql({ post: { id: 1 } });
    });
  });

  describe('#relations', function() {
    var Post = Osteo.Model.extend({
      relations: function() {
        return {
          'tags'     : Backbone.Collection,
          'comments' : Backbone.Collection
        }
      }
    });

    it('maps defined relational attributes', function() {
      var post = new Post({ id: 1, tags: [{ id: 2 }], comments: [{ id: 3 }] });

      expect(post.get('tags')).to.be.undefined;
      expect(post.get('comments')).to.be.undefined;
      expect(post.tags).to.be.instanceof(Backbone.Collection);
      expect(post.comments).to.be.instanceof(Backbone.Collection);
      expect(post.tags.length).to.eq(1)
      expect(post.comments.length).to.eq(1)
    });

    it('applies attributes after the model has been created', function() {
      var post = new Post({ id: 1 });

      post.set({ tags: [{ id: 2 }] });

      expect(post.get('tags')).to.be.undefined;
      expect(post.tags).to.be.instanceof(Backbone.Collection);
      expect(post.tags.length).to.eq(1)
    });
  });
});

