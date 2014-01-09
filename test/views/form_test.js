describe('Osteo.FormView', function() {
  describe('#form', function() {
    it('defaults to the first form element', function() {
      var view = new Osteo.FormView();
          template = '<form id="osteo-form"></form>';

      view.render()
      view.html(template);

      expect(view.$form().attr('id')).to.eq('osteo-form')
    });

    it('can be overridden to use a selector', function() {
      var view = new Osteo.FormView({ selector: '#alt-form' });
          template = '' +
            '<form id="osteo-form"></form>' +
            '<form id="alt-form"></form>';

      view.render()
      view.html(template);

      expect(view.$form().attr('id')).to.eq('alt-form')
    });
  });

  describe('#serialize', function() {
    it('extracts the names and values of all inputs', function() {
      var view = new Osteo.FormView(),
          template = '<form>' +
            '<input name="email" type="email" value="user@example.com" />' +
            '<input name="name"  type="text"  value="Userton" />'          +
            '<textarea name="note">A person</textarea>'                    +
            '<input name="profile[job]" type="text" value="Plumber" />'    +
            '<input name="profile[car]" type="text" value="Volvo" />'      +
            '</form>';

      view.render()
      view.html(template);

      expect(view.serialize()).to.eql({
        email: 'user@example.com',
        name:  'Userton',
        note:  'A person',
        profile: {
          job: 'Plumber',
          car: 'Volvo'
        }
      });
    });
  });
});
