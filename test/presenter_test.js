describe('Osteo.Presenter', function() {
  var presenter, model;

  describe('.extend', function() {
    it('supports Backbone style inheritance', function() {
      var AbsPres = Osteo.Presenter.extend({
        ident: function() {}
      });

      model     = new Backbone.Model();
      presenter = new AbsPres(model);

      expect(presenter.get).not.to.be.undefined;
      expect(presenter.ident).not.to.be.undefined;
    });
  });

  describe('#get', function() {
    it('delegates to the wrapped model', function() {
      model = new Backbone.Model({ title: 'dogs' });
      presenter = new Osteo.Presenter(model);

      expect(presenter.get('title')).to.eq('dogs');
    });
  });

  describe('#duplicateAttributes', function() {
    it('initially copies all model attributes', function() {
      model = new Backbone.Model({ id: 12, title: 'dogs' });
      presenter = new Osteo.Presenter(model);

      expect(presenter.id).to.eq(12);
      expect(presenter.title).to.eq('dogs');
    });
  });

  describe('#replicateChanged', function() {
    it('replicates model attributes on change', function() {
      model = new Backbone.Model({ title: 'dogs' });
      presenter = new Osteo.Presenter(model);

      model.set({ title: 'cats' });

      expect(presenter.title).to.eq('cats')
    });
  });
});
