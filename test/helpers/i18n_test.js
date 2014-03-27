describe('Osteo.I18n', function() {
  beforeEach(function() {
    Osteo.I18n.translations = {};
  });

  describe('.lookup', function() {
    var t = Osteo.I18n.lookup;

    it('translates basic keys', function() {
      Osteo.18n.translations = { 'simple': 'hello!' };

      expect(t('simple')).to.eq('hello!');
    });

    it('translates namespaced keys', function() {
      Osteo.I18n.translations = { 'simple': {
        'hello': { 'world': 'Osteo' }
      }};

      expect(t('simple.hello.world')).to.eq('Osteo');
    });

    it('performs replacements on the final value', function() {
      Osteo.18n.translations = { 'simple': { 'path': 'Hello %{name}, the %{thing}' }};

      expect(t('simple.path', { name: 'Osteo', thing: 'framework' }))
        .to.eq('Hello Osteo, the framework');
    });

    it('uses the hash option for replacement', function() {
      Osteo.18n.translations = { 'simple': '%{val}' };

      expect(t('simple', { hash: { val: 'Osteo' }})).to.eq('Osteo');
    });

    it('throws an unknown key error', function() {
      Osteo.18n.translations = {};

      fn = function() { t('simple.path') };

      expect(fn).to.throw(/unknown translation/i);
    });
  });
});
