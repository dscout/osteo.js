describe('Osteo.CollectionView', function() {
  describe('#initialize', function() {
    it('assigns passed options', function() {
      var cons = { id: 100 },
          view = new Osteo.CollectionView({ selector: '#thing', viewClass: cons });

      expect(view.selector).to.eq('#thing');
      expect(view.viewClass).to.eql(cons);
    });
  });

  describe('#container', function() {
    it('targets the selector when given', function() {
      var view = new Osteo.CollectionView({ selector: '#thing' });

      expect(view.container().selector).to.eq('#thing');
    });

    it('memoizes the container', function() {
      var view = new Osteo.CollectionView({ selector: '#thing' });

      view.container();
      view.selector = '#other';

      expect(view.container().selector).to.eq('#thing');
    });
  });

  describe('#renderContext', function() {
    it('sets the context to the collection', function() {
      var coll = new Backbone.Collection(),
          view = new Osteo.CollectionView({ collection: coll });

      expect(view.renderContext()).to.eql(coll);
    });
  });

  describe('#add', function() {
    it('inserts the new view in order', function() {
      var coll = new Backbone.Collection([{ id: 20 }]),
          view = new Osteo.CollectionView({ collection: coll });

      view.reset();
      coll.add({ id: 30 });

      expect(view.$el.children().length).to.eq(2);
    });
  });

  describe('#sort', function() {
    it('reorders views by collection position', function() {
      var coll = new Backbone.Collection([{ id: 10 }, { id: 20 }, { id: 30 }]),
          view = new Osteo.CollectionView({ collection: coll }),
          oldFirst, newFirst;

      coll.comparator = function(model) { return -model.id; }

      view.reset();
      oldFirst = view.$el.children().first();

      coll.sort();
      newFirst = view.$el.children().first();

      expect(newFirst[0]).not.to.eql(oldFirst[0]);
    });
  });
});
