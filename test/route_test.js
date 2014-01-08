describe('Osteo.Route', function() {
  describe('.reset', function() {
    it('clears the singleton instance', function() {
      Osteo.Route.instance = {};
      Osteo.Route.reset();

      expect(Osteo.Route.instance).to.be.undefined;
    });
  });

  describe('#load', function() {
    it('is defaults to a no-op', function() {
      var route = new Osteo.Route();

      expect(route.load()).to.eql(route);
    });
  });
});
