describe('Osteo.View', function() {
  var view;

  describe('#render', function() {
    it('flags the view as being rendered', function() {
      view = new Osteo.View({});

      expect(view.isRendered()).to.be.false;

      view.render();

      expect(view.isRendered()).to.be.true;
    });

    it('returns itself for chaining', function() {
      view = new Osteo.View({});

      expect(view.render()).to.eql(view);
    });

    it('calls the afterRender hook', function() {
      var spy;

      view = new Osteo.View({});
      spy = view.afterRender = sinon.spy();

      view.render();

      expect(view.afterRender.called).to.be.true;
    });
  });

  describe('#renderTemplate', function() {
    it('looks up and calls the template', function() {
      Osteo.TEMPLATES = {
        generic: function(context) {
          return '<p>' + context.title + '</p>';
        }
      };

      view = new Osteo.View({});

      expect(view.renderTemplate('generic', { title: 'osteo' }))
        .to.eq('<p>osteo</p>');
    });
  });

  describe('#renderContext', function() {
    it('defaults to an empty object', function() {
      view = new Osteo.View({});

      expect(view.renderContext()).to.eql({});
    });

    it('is the model attributes without a presenter', function() {
      var model = new Backbone.Model({ id: 100 }),
          view  = new Osteo.View({ model: model });

      expect(view.renderContext()).to.eql({ id: 100 });
    });

    it('is a passed presenter instance', function() {
      var presenter = { id: 100 },
          view = new Osteo.View({ model: {}, presenter: presenter });

      expect(view.renderContext()).to.eql({ id: 100 });
    });
  });

  describe('#lazyRender', function() {
    it('debounces rendering with an interval', function(done) {
      view = new Osteo.View({ lazyRenderDelay: 1 });
      sinon.spy(view, 'render');

      view.lazyRender();

      setTimeout(function() {
        expect(view.render.called).to.be.true;
        done();
      }, 2);
    });
  });

  describe('#boundRender', function() {
    it('automatically includes bound rendering', function() {
      view = new Osteo.View({ boundAttributes: ['title'] });

      expect(view.boundRender).not.to.be.undefined;
    });
  });

  describe('#destroy', function() {
    it('destroys the associated model', function() {
      var model = { destroy: sinon.spy() },
          view  = new Osteo.View({ model: model });

      view.destroy({ complete: true });

      expect(model.destroy.called).to.be.true;
    });
  });
});
