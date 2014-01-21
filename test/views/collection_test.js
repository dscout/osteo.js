describe('Osteo.CollectionView', function() {
  describe('#initialize', function() {
    it('assigns passed options', function() {
      var cons = { id: 100 },
          view = new Osteo.CollectionView({ selector: '#thing', itemView: cons });

      expect(view.selector).to.eq('#thing');
      expect(view.itemView).to.eql(cons);
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

  describe('#context', function() {
    it('sets the context to the collection', function() {
      var coll = new Backbone.Collection(),
          view = new Osteo.CollectionView({ collection: coll });

      expect(view.context()).to.eql(coll);
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

  describe('#getItemView', function() {
    it('gets the view that matches the model', function() {
      var model = new Osteo.Model(),
          coll  = new Osteo.Collection(),
          view  = new Osteo.CollectionView({
            collection: coll,
            itemView: Osteo.View
          });

      var itemView = view.getItemView(model);

      expect(itemView).to.be.instanceof(Osteo.View);
      expect(itemView).to.eql(view.getItemView(model));
    });
  });
});
