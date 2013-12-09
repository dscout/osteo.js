describe('Osteo.ModalView', function() {
  describe('#display', function() {
    it('jointly renders and opens the modal', function() {
      var modal = new Osteo.ModalView({});

      modal.display();

      expect($('.js-osteo-screen').length).to.eq(1);
      expect($('.js-osteo-modal').length).to.eq(1);
    });

    it('re-assigns model, presenter, and collection objects', function() {
      var modal = new Osteo.ModalView({}),
          model = { id: 1 },
          pres  = { model: model },
          coll  = [model];

      modal.display({ model: model, presenter: pres, collection: coll });

      expect(modal.model).to.eql(model);
      expect(modal.presenter).to.eql(pres);
      expect(modal.collection).to.eql(coll);
    });
  });

  describe('#cancel', function() {
    it('hides both the modal and the screen', function() {
      var modal = new Osteo.ModalView({});

      modal.display();
      modal.cancel();

      expect(modal.$el.hasClass('hide')).to.be.true;
      expect(modal.$screen.hasClass('hide')).to.be.true;
    });
  });
});
