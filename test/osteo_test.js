describe('Osteo', function() {
  it('attaches to the global object', function() {
    expect(Osteo).not.to.be.undefined;
  });

  it('defines a TEMPLATES object', function() {
    expect(Osteo.TEMPLATES).not.to.be.undefined;
  });
});
