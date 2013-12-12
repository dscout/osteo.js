describe('Osteo.Route', function() {
  describe('#load', function() {
    it('is defaults to a no-op', function() {
      var route = new Osteo.Route();

      expect(route.load()).to.eql(route);
    });
  });
});
