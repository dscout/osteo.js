describe('Osteo.Router', function() {
  describe('#handle', function() {
    it('loads the route with the associated name', function() {
      var router    = new Osteo.Router(),
          HelpRoute = function() { this.load = sinon.spy(); };

      router.handlers = { 'help' : HelpRoute };

      var route = router.handle('help', 1);

      expect(route).to.be.instanceof(HelpRoute);
      expect(route.load.called).to.be.true;
    });

    it('unloads the previous route', function() {
      var router = new Osteo.Router(),
          HelpRoute = function() {
            this.load   = sinon.spy();
            this.unload = sinon.spy();
          },
          route;

      router.handlers = { 'help' : HelpRoute };
      route = router.handle('help');
      router.handle('other');

      expect(route.unload.called).to.be.true;
    });

    it('does not load unhandled routes', function() {
      var router = new Osteo.Router(),
          fn     = function() { router.handle('fake'); };

      expect(fn).not.to.throw(Error);
    });
  });

  describe('#pathFor', function() {
    it('resolves the full path by name', function() {
      var router = new Osteo.Router();

      router.routes = { 'help/section' : 'help' };

      expect(router.pathFor('help')).to.eq('help/section');
    });

    it('interpolates param parts of the path', function() {
      var router = new Osteo.Router(),
          context = { page: 'osteo', id: 100 };

      router.routes = { 'help/:page/sub/:id' : 'help' };

      expect(router.pathFor('help', context))
        .to.eq('help/osteo/sub/100');
    });

    it('replaces from the context attributes', function() {
      var router = new Osteo.Router(),
          context = { attributes: { page: 'osteo' } };

      router.routes = { 'help/:page' : 'help' };

      expect(router.pathFor('help', context))
        .to.eq('help/osteo');
    });

    it('raises an exception for an unknown path', function() {
      var router = new Osteo.Router(),
          fn = function() { router.pathFor('help'); };

      expect(fn).to.throw('No such path name: help');
    });
  });

  describe('#visit', function() {
    var router;

    beforeEach(function() {
      router = new Osteo.Router({ routes: { 'help' : 'help' } });
      router.start({ silent: true, pushState: false });
    });

    afterEach(function() {
      router.navigate('/');
    });

    it('navigates to the named path', function() {
      var handler = sinon.spy();

      router.on('route:help', handler);
      router.visit('help');

      expect(handler.called).to.be.true;
    });

    it('accepts options for navagate', function() {
      var spy = sinon.spy(router, 'navigate');

      router.visit('help', {}, { replace: true });

      expect(spy.calledWith('help', { trigger: true, replace: true })).to.be.true
    });
  });

  describe('#start', function() {
    afterEach(function() {
      Backbone.history.start.restore();
    });

    it('starts Backbone.history', function() {
      Backbone.History.started = false;

      var router = new Osteo.Router(),
          spy    = sinon.spy(Backbone.history, 'start');

      router.start({ root: '/path' });

      expect(spy.called).to.be.true
      expect(spy.getCall(0).args[0]).to.eql({ root: '/path' });
    });
  });
});
