describe('Osteo.Router', function() {
  describe('#handle', function() {
    it('loads the route with the associated name', function() {
      var router    = new Osteo.Router(),
          HelpRoute = function(id) {
            this.id = id;
            this.load = sinon.spy();
          };

      router.handlers = function() {
        return { 'help' : HelpRoute };
      }

      var route = router.handle('help', 1);

      expect(route).to.be.instanceof(HelpRoute);
      expect(route.load.called).to.be.true;
    });

    it('does not load unhandled routes', function() {
      var router = new Osteo.Router(),
          fn     = function() { router.handle('fake'); };

      expect(fn).not.to.throw(Error);
      expect(router.routeCache).to.eql({});
    });
  });
});
