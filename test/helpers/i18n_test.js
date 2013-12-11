describe('Osteo.I18n', function() {
  beforeEach(function() {
    Osteo.TRANSLATIONS = {};
  });

  describe('.lookup', function() {
    var t = Osteo.I18n.lookup;

    it('translates basic keys', function() {
      Osteo.TRANSLATIONS = { 'simple': 'hello!' };

      expect(t('simple')).to.eq('hello!');
    });

    it('translates namespaced keys', function() {
      Osteo.TRANSLATIONS = { 'simple': {
        'hello': { 'world': 'Osteo' }
      }};

      expect(t('simple.hello.world')).to.eq('Osteo');
    });

    it('performs replacements on the final value', function() {
      Osteo.TRANSLATIONS = { 'simple': { 'path': 'Hello %{name}, the %{thing}' }};

      expect(t('simple.path', { name: 'Osteo', thing: 'framework' }))
        .to.eq('Hello Osteo, the framework');
    });
  });
});
