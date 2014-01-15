describe('Osteo.Route', function() {
  describe('.reset', function() {
    it('clears the singleton instance', function() {
      Osteo.Route.instance = {};
      Osteo.Route.reset();

      expect(Osteo.Route._instance).to.be.undefined;
    });
  });

  describe('#load', function() {
    it('returns an automatically resolved promise', function(done) {
      var route = new Osteo.Route(),
          load;

      sinon.spy(route, 'loadData');
      sinon.spy(route, 'loadView');
      load = route.load();

      expect(load).to.be.instanceof(Promise);

      load.then(function() {
        expect(route.loadData.called).to.be.true;
        expect(route.loadView.called).to.be.true;
        done();
      })
    });

    it('calls the error handler when resolution fails', function(done) {
      var route = new Osteo.Route();

      sinon.spy(route, 'loadError');
      route.loadView = function() { throw new Error('Bad'); }

      route.load().then(function() {
        expect(route.loadError.called).to.be.true;
        done();
      });
    });
  });
});
