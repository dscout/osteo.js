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

  describe('#relations', function() {
    it('maps defined relational attributes', function() {
      var Post = Osteo.Model.extend({
        relations: function() {
          return {
            'tags'     : Backbone.Collection,
            'comments' : Backbone.Collection
          }
        }
      });

      var post = new Post({ id: 1, tags: [{ id: 2 }], comments: [{ id: 3 }] });

      expect(post.get('tags')).to.be.undefined;
      expect(post.get('comments')).to.be.undefined;
      expect(post.tags).to.be.instanceof(Backbone.Collection);
      expect(post.comments).to.be.instanceof(Backbone.Collection);
    });
  });
});

