describe('Osteo', function() {
  it('attaches to the global object', function() {
    expect(Osteo).not.to.be.undefined;
  });

  it('defines a TEMPLATE object', function() {
    expect(Osteo.TEMPLATE).not.to.be.undefined;
  });
});
